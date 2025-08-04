#!/bin/bash

echo "🚀 Starting deployment process..."

# Check if required tools are installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Install with: npm i -g vercel"
    exit 1
fi

if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Install with: npm i -g @railway/cli"
    exit 1
fi

# Build the frontend
echo "📦 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

echo "✅ Frontend built successfully"

# Deploy backend first
echo "🔧 Deploying backend to Railway..."
cd firebase

# Check if Railway project is initialized
if [ ! -f "railway.json" ]; then
    echo "📋 Initializing Railway project..."
    railway init
fi

echo "🚀 Deploying backend..."
railway up

if [ $? -ne 0 ]; then
    echo "❌ Backend deployment failed"
    exit 1
fi

# Get backend URL
echo "🔗 Getting backend URL..."
BACKEND_URL=$(railway domain)

if [ -z "$BACKEND_URL" ]; then
    echo "❌ Could not get backend URL"
    exit 1
fi

echo "✅ Backend deployed to: $BACKEND_URL"

# Go back to root
cd ..

# Deploy frontend
echo "🌐 Deploying frontend to Vercel..."
vercel --prod

if [ $? -ne 0 ]; then
    echo "❌ Frontend deployment failed"
    exit 1
fi

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Set environment variables in Railway:"
echo "   - NODE_ENV=production"
echo "   - FRONTEND_URL=https://your-frontend-domain.vercel.app"
echo "   - FIREBASE_SERVICE_ACCOUNT=your-service-account-json"
echo "   - FIREBASE_STORAGE_BUCKET=your-bucket-name"
echo ""
echo "2. Set environment variables in Vercel:"
echo "   - REACT_APP_API_URL=$BACKEND_URL"
echo ""
echo "3. Test your deployment:"
echo "   - Backend health: curl $BACKEND_URL/api/health"
echo "   - Frontend: Visit your Vercel domain" 