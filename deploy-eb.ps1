param(
    [Parameter(Mandatory = $true)]
    [string]$ApplicationName,

    [Parameter(Mandatory = $true)]
    [string]$EnvironmentName,

    [string]$Region = "us-east-1",
    [string]$VersionLabel = "",
    [string]$JwtSecret = "",
    [string]$AdminUsername = "",
    [string]$AdminPassword = "",
    [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"

function Get-EnvValue {
    param(
        [string]$ExplicitValue,
        [string]$EnvKey,
        [string]$Fallback = ""
    )

    if ($ExplicitValue) { return $ExplicitValue }
    if (Test-Path ".env") {
        $line = Get-Content ".env" | Where-Object { $_ -match "^$EnvKey=" } | Select-Object -First 1
        if ($line) { return ($line -split "=", 2)[1] }
    }
    $envValue = [System.Environment]::GetEnvironmentVariable($EnvKey)
    if ($envValue) { return $envValue }
    return $Fallback
}

if (-not $VersionLabel) {
    $VersionLabel = "deploy-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
}

$JwtSecret = Get-EnvValue -ExplicitValue $JwtSecret -EnvKey "JWT_SECRET"
$AdminUsername = Get-EnvValue -ExplicitValue $AdminUsername -EnvKey "ADMIN_USERNAME" -Fallback "admin"
$AdminPassword = Get-EnvValue -ExplicitValue $AdminPassword -EnvKey "ADMIN_PASSWORD" -Fallback "admin123"

if (-not $JwtSecret) {
    throw "JWT secret is required. Set it in .env or pass -JwtSecret."
}

if (-not $SkipBuild) {
    Write-Host "Building project..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed."
    }
}

$stagingDir = Join-Path $PWD ".eb-deploy"
$zipPath = Join-Path $PWD "deploy-eb.zip"

if (Test-Path $stagingDir) {
    Remove-Item $stagingDir -Recurse -Force
}
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

New-Item -ItemType Directory -Path $stagingDir | Out-Null
New-Item -ItemType Directory -Path (Join-Path $stagingDir ".ebextensions") | Out-Null
New-Item -ItemType Directory -Path (Join-Path $stagingDir "data") | Out-Null
New-Item -ItemType Directory -Path (Join-Path $stagingDir "dist") | Out-Null

Copy-Item "package.json" $stagingDir
Copy-Item "package-lock.json" $stagingDir
Copy-Item "server.js" $stagingDir
Copy-Item "Procfile" $stagingDir
Copy-Item ".ebextensions\nodecommand.config" (Join-Path $stagingDir ".ebextensions\nodecommand.config")
Copy-Item "data\products.json" (Join-Path $stagingDir "data\products.json")
Copy-Item "dist\*" (Join-Path $stagingDir "dist") -Recurse

# Build zip with forward-slash entry names so Linux unzip accepts it
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zipStream = [System.IO.File]::Open($zipPath, [System.IO.FileMode]::Create)
$archive = [System.IO.Compression.ZipArchive]::new($zipStream, [System.IO.Compression.ZipArchiveMode]::Create)
Get-ChildItem $stagingDir -Recurse -File | ForEach-Object {
    $entryName = $_.FullName.Substring($stagingDir.Length + 1).Replace('\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
        $archive, $_.FullName, $entryName,
        [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
}
$archive.Dispose()
$zipStream.Dispose()

$storageBucket = (aws elasticbeanstalk create-storage-location --region $Region --query S3Bucket --output text).Trim()
$storageKey = "$ApplicationName/$VersionLabel.zip"

Write-Host "Uploading bundle to Elastic Beanstalk storage..." -ForegroundColor Cyan
aws s3 cp $zipPath "s3://$storageBucket/$storageKey" --region $Region | Out-Null

Write-Host "Registering uploaded bundle as application version..." -ForegroundColor Cyan
aws elasticbeanstalk create-application-version `
  --region $Region `
  --application-name $ApplicationName `
  --version-label $VersionLabel `
    --source-bundle S3Bucket="$storageBucket",S3Key="$storageKey" | Out-Null

# Write option settings to a temp JSON file to avoid PowerShell/AWS CLI quoting issues
$optionsFile = Join-Path $env:TEMP "eb-options-$VersionLabel.json"
$optionsJson = @(
    @{ Namespace = "aws:elasticbeanstalk:application:environment"; OptionName = "JWT_SECRET";       Value = $JwtSecret      }
    @{ Namespace = "aws:elasticbeanstalk:application:environment"; OptionName = "ADMIN_USERNAME";   Value = $AdminUsername  }
    @{ Namespace = "aws:elasticbeanstalk:application:environment"; OptionName = "ADMIN_PASSWORD";   Value = $AdminPassword  }
) | ConvertTo-Json
$noBomUtf8 = [System.Text.UTF8Encoding]::new($false)
[System.IO.File]::WriteAllText($optionsFile, $optionsJson, $noBomUtf8)

Write-Host "Updating environment..." -ForegroundColor Cyan
aws elasticbeanstalk update-environment `
  --region $Region `
  --environment-name $EnvironmentName `
  --version-label $VersionLabel `
  --option-settings "file://$optionsFile" | Out-Null

Remove-Item $optionsFile -Force -ErrorAction SilentlyContinue

Write-Host "Deployment submitted successfully." -ForegroundColor Green
Write-Host "Application: $ApplicationName" -ForegroundColor Yellow
Write-Host "Environment: $EnvironmentName" -ForegroundColor Yellow
Write-Host "Version: $VersionLabel" -ForegroundColor Yellow

Remove-Item $stagingDir -Recurse -Force
