# Ambassadors Agency

Premium branding & printing agency website built with React, TypeScript, Tailwind CSS v4, and Vite.

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview   # Preview production build locally
```

The build outputs to `dist/`.

## Deploy Express App to AWS Elastic Beanstalk

The current app includes an Express server and protected admin/product APIs, so the recommended AWS deployment target is Elastic Beanstalk rather than static S3 hosting.

### Option 1 - PowerShell Script

```powershell
# Requires:
# - AWS CLI installed and configured
# - Existing Elastic Beanstalk application and environment

.\deploy-eb.ps1 -ApplicationName "ambassadors-agency" -EnvironmentName "ambassadors-agency-prod" -Region "us-east-1"
```

The script will:
1. Build the app
2. Package server + dist + data for deployment
3. Upload the bundle to Elastic Beanstalk storage
4. Register a new application version
5. Update the target environment
6. Push `JWT_SECRET`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD` from `.env` unless explicit values are passed

### Option 2 - Manual Elastic Beanstalk

1. Create a Node.js Elastic Beanstalk application/environment
2. Run `npm run build`
3. Zip these items:
	- `server.js`
	- `package.json`
	- `package-lock.json`
	- `Procfile`
	- `.ebextensions/`
	- `data/`
	- `dist/`
4. Upload the zip as a new application version
5. Set environment variables in Elastic Beanstalk:
	- `JWT_SECRET`
	- `ADMIN_USERNAME`
	- `ADMIN_PASSWORD`
6. Deploy the new version to your environment

## Legacy Static Deploy

The S3 + CloudFront script still exists for static-only deployment, but it does not run the Express API required by admin login and product management.

## Deploy to AWS S3 (Static Site)

### Option 1 — PowerShell Script

```powershell
# Requires: AWS CLI installed & configured (aws configure)
.\deploy-aws.ps1 -BucketName "your-bucket-name" -Region "us-east-1"
```

### Option 2 — Manual

1. Build: `npm run build`
2. Create an S3 bucket with static website hosting enabled
3. Upload the contents of `dist/` to the bucket
4. Set the index document to `index.html` and error document to `index.html`
5. Configure the bucket policy for public read access

### Option 3 — AWS Amplify

1. Push to a Git repo (GitHub, CodeCommit, etc.)
2. Connect the repo in AWS Amplify Console
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS v4
- Vite 8
