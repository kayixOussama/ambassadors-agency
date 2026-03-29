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
