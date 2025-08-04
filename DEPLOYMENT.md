# Deployment Guide

## Overview
This project consists of:
- **Frontend**: React TypeScript app (deploy to Vercel)
- **Backend**: Node.js Express server with Firebase (deploy to Railway)

## Prerequisites
1. Install Vercel CLI: `npm i -g vercel`
2. Install Railway CLI: `npm i -g @railway/cli`
3. Have your Firebase service account key ready

## Step 1: Deploy Backend (Railway)

### 1.1 Prepare Backend
```bash
cd firebase
```

### 1.2 Login to Railway
```bash
railway login
```

### 1.3 Initialize Railway Project
```bash
railway init
```

### 1.4 Set Environment Variables
```bash
railway variables set NODE_ENV=production
railway variables set FRONTEND_URL=https://your-frontend-domain.vercel.app
# Add your Firebase service account key as a variable
railway variables set FIREBASE_SERVICE_ACCOUNT='{"type": "service_account", ...}'
railway variables set FIREBASE_STORAGE_BUCKET=your-bucket-name
```

### 1.5 Deploy Backend
```bash
railway up
```

### 1.6 Get Backend URL
```bash
railway domain
```

## Step 2: Deploy Frontend (Vercel)

### 2.1 Prepare Frontend
```bash
cd ..  # Go back to root
```

### 2.2 Update API URL
Update the proxy in `package.json` to point to your Railway backend URL:
```json
"proxy": "https://your-railway-app.railway.app"
```

### 2.3 Login to Vercel
```bash
vercel login
```

### 2.4 Deploy Frontend
```bash
vercel --prod
```

### 2.5 Set Environment Variables
```bash
vercel env add REACT_APP_API_URL
# Enter your Railway backend URL
```

## Step 3: Connect Frontend to Backend

### 3.1 Update Frontend API Calls
Make sure all API calls use the environment variable:
```typescript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
```

### 3.2 Redeploy Frontend
```bash
vercel --prod
```

## Environment Variables Checklist

### Backend (Railway)
- `NODE_ENV=production`
- `FRONTEND_URL=https://your-frontend-domain.vercel.app`
- `FIREBASE_SERVICE_ACCOUNT` (JSON string)
- `FIREBASE_STORAGE_BUCKET=your-bucket-name`
- `JWT_SECRET=your-jwt-secret`

### Frontend (Vercel)
- `REACT_APP_API_URL=https://your-railway-app.railway.app`

## Testing Deployment

### 1. Test Backend Health
```bash
curl https://your-railway-app.railway.app/api/health
```

### 2. Test Frontend
Visit your Vercel domain and test all functionality

### 3. Test API Integration
Check that frontend can communicate with backend

## Troubleshooting

### Common Issues
1. **CORS errors**: Ensure `FRONTEND_URL` is set correctly in Railway
2. **API not found**: Check that Railway domain is correct in Vercel env vars
3. **Firebase errors**: Verify service account key is properly set in Railway

### Logs
- Railway logs: `railway logs`
- Vercel logs: Check in Vercel dashboard

## Production Checklist
- [ ] Backend deployed and healthy
- [ ] Frontend deployed and accessible
- [ ] API communication working
- [ ] All environment variables set
- [ ] Custom domain configured (optional)
- [ ] SSL certificates working
- [ ] Performance tested
- [ ] Error monitoring set up 