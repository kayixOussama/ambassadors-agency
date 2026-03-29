# AWS S3 Static Site Deployment Script
# Prerequisites: AWS CLI installed and configured (aws configure)
#
# Usage:
#   .\deploy-aws.ps1 -BucketName "your-bucket-name"
#   .\deploy-aws.ps1 -BucketName "ambassadors-agency" -Region "us-east-1"

param(
    [Parameter(Mandatory=$true)]
    [string]$BucketName,

    [string]$Region = "us-east-1"
)

Write-Host "Building project..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "Build failed!" -ForegroundColor Red; exit 1 }

Write-Host "Creating S3 bucket: $BucketName ..." -ForegroundColor Cyan
aws s3 mb "s3://$BucketName" --region $Region 2>$null

Write-Host "Configuring bucket for static website hosting..." -ForegroundColor Cyan
aws s3 website "s3://$BucketName" --index-document index.html --error-document index.html

Write-Host "Setting bucket policy for public access..." -ForegroundColor Cyan
$policy = @"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BucketName/*"
        }
    ]
}
"@
$policy | Out-File -FilePath "bucket-policy.json" -Encoding utf8
aws s3api put-public-access-block --bucket $BucketName --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
aws s3api put-bucket-policy --bucket $BucketName --policy file://bucket-policy.json
Remove-Item "bucket-policy.json"

Write-Host "Uploading dist/ to S3..." -ForegroundColor Cyan
aws s3 sync ./dist "s3://$BucketName" --delete --cache-control "public, max-age=31536000, immutable" --exclude "*.html"
aws s3 sync ./dist "s3://$BucketName" --delete --cache-control "no-cache" --include "*.html"

$url = "http://$BucketName.s3-website-$Region.amazonaws.com"
Write-Host ""
Write-Host "Deployed successfully!" -ForegroundColor Green
Write-Host "Website URL: $url" -ForegroundColor Yellow
