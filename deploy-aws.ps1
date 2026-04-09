# AWS S3 + CloudFront (HTTPS) Deployment Script
# Prerequisites: AWS CLI installed and configured (aws configure)
#
# First run:  Creates S3 bucket, CloudFront distribution, and uploads files
# Next runs:  Uploads files and invalidates CloudFront cache
#
# Usage:
#   .\deploy-aws.ps1 -BucketName "your-bucket-name"
#   .\deploy-aws.ps1 -BucketName "ambassadors-agency" -Region "us-east-1"

param(
    [Parameter(Mandatory=$true)]
    [string]$BucketName,

    [string]$Region = "us-east-1"
)

$ErrorActionPreference = "Stop"

# ── 1. Build ──────────────────────────────────────────────
Write-Host "Building project..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "Build failed!" -ForegroundColor Red; exit 1 }

# ── 2. Create S3 bucket (private, no website hosting) ────
Write-Host "Creating S3 bucket: $BucketName ..." -ForegroundColor Cyan
aws s3 mb "s3://$BucketName" --region $Region 2>$null

# Block all public access — CloudFront will access via OAC
aws s3api put-public-access-block --bucket $BucketName --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# ── 3. Check if CloudFront distribution already exists ────
Write-Host "Checking for existing CloudFront distribution..." -ForegroundColor Cyan
$existingDistId = $null
$distributions = aws cloudfront list-distributions --query "DistributionList.Items[?Origins.Items[0].DomainName=='$BucketName.s3.$Region.amazonaws.com'].Id" --output text 2>$null
if ($distributions -and $distributions -ne "None") {
    $existingDistId = $distributions.Trim()
}

if (-not $existingDistId) {
    # ── 4. Create Origin Access Control ───────────────────
    Write-Host "Creating Origin Access Control..." -ForegroundColor Cyan
    $oacConfig = @"
{
    "Name": "$BucketName-oac",
    "Description": "OAC for $BucketName",
    "SigningProtocol": "sigv4",
    "SigningBehavior": "always",
    "OriginAccessControlOriginType": "s3"
}
"@
    [System.IO.File]::WriteAllText("$PWD\oac-config.json", $oacConfig)
    $oacResult = aws cloudfront create-origin-access-control --origin-access-control-config file://oac-config.json --output json | ConvertFrom-Json
    $oacId = $oacResult.OriginAccessControl.Id
    Remove-Item "oac-config.json"
    Write-Host "  OAC ID: $oacId" -ForegroundColor Gray

    # ── 5. Create CloudFront distribution ─────────────────
    Write-Host "Creating CloudFront distribution (this takes a few minutes)..." -ForegroundColor Cyan

    $callerRef = [guid]::NewGuid().ToString()
    $distConfig = @"
{
    "CallerReference": "$callerRef",
    "Comment": "$BucketName static site",
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-$BucketName",
        "ViewerProtocolPolicy": "redirect-to-https",
        "AllowedMethods": { "Quantity": 2, "Items": ["GET", "HEAD"], "CachedMethods": { "Quantity": 2, "Items": ["GET", "HEAD"] } },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": { "Forward": "none" }
        },
        "MinTTL": 0,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000,
        "Compress": true
    },
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-$BucketName",
                "DomainName": "$BucketName.s3.$Region.amazonaws.com",
                "OriginAccessControlId": "$oacId",
                "S3OriginConfig": { "OriginAccessIdentity": "" }
            }
        ]
    },
    "Enabled": true,
    "DefaultRootObject": "index.html",
    "CustomErrorResponses": {
        "Quantity": 1,
        "Items": [
            {
                "ErrorCode": 403,
                "ResponsePagePath": "/index.html",
                "ResponseCode": "200",
                "ErrorCachingMinTTL": 0
            }
        ]
    },
    "HttpVersion": "http2",
    "PriceClass": "PriceClass_100"
}
"@
    [System.IO.File]::WriteAllText("$PWD\cf-config.json", $distConfig)
    $cfResult = aws cloudfront create-distribution --distribution-config file://cf-config.json --output json | ConvertFrom-Json
    $distId = $cfResult.Distribution.Id
    $cfDomain = $cfResult.Distribution.DomainName
    Remove-Item "cf-config.json"

    Write-Host "  Distribution ID: $distId" -ForegroundColor Gray
    Write-Host "  Domain: $cfDomain" -ForegroundColor Gray

    # ── 6. Set S3 bucket policy to allow CloudFront OAC ──
    Write-Host "Setting bucket policy for CloudFront access..." -ForegroundColor Cyan
    $awsAccount = (aws sts get-caller-identity --query "Account" --output text).Trim()
    $policy = @"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowCloudFrontServicePrincipalReadOnly",
            "Effect": "Allow",
            "Principal": { "Service": "cloudfront.amazonaws.com" },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BucketName/*",
            "Condition": {
                "StringEquals": {
                    "AWS:SourceArn": "arn:aws:cloudfront::${awsAccount}:distribution/$distId"
                }
            }
        }
    ]
}
"@
    [System.IO.File]::WriteAllText("$PWD\bucket-policy.json", $policy)
    aws s3api put-bucket-policy --bucket $BucketName --policy file://bucket-policy.json
    Remove-Item "bucket-policy.json"

} else {
    $distId = $existingDistId
    $cfDomain = (aws cloudfront get-distribution --id $distId --query "Distribution.DomainName" --output text).Trim()
    Write-Host "  Using existing distribution: $distId ($cfDomain)" -ForegroundColor Gray
}

# ── 7. Upload files to S3 ────────────────────────────────
Write-Host "Uploading dist/ to S3..." -ForegroundColor Cyan
aws s3 sync ./dist "s3://$BucketName" --delete --cache-control "public, max-age=31536000, immutable" --exclude "*.html"
aws s3 sync ./dist "s3://$BucketName" --delete --cache-control "no-cache" --include "*.html"

# ── 8. Invalidate CloudFront cache ───────────────────────
Write-Host "Invalidating CloudFront cache..." -ForegroundColor Cyan
aws cloudfront create-invalidation --distribution-id $distId --paths "/*" --output text | Out-Null

# ── Done ──────────────────────────────────────────────────
Write-Host ""
Write-Host "Deployed successfully!" -ForegroundColor Green
Write-Host "HTTPS URL: https://$cfDomain" -ForegroundColor Yellow
Write-Host ""
Write-Host "Note: First deploy takes 5-10 min for CloudFront to propagate." -ForegroundColor DarkYellow
Write-Host "      After that, your site is live with free HTTPS!" -ForegroundColor DarkYellow
