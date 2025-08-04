#!/bin/bash

echo "🧪 Starting TEST deployment process..."

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

# Deploy backend to test environment
echo "🔧 Deploying backend to Railway (TEST)..."
cd firebase

# Check if Railway project is initialized
if [ ! -f "railway.json" ]; then
    echo "📋 Initializing Railway project..."
    railway init
fi

echo "🚀 Deploying backend to test environment..."
railway up --environment=development

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

# Deploy frontend to test environment
echo "🌐 Deploying frontend to Vercel (TEST)..."
vercel

if [ $? -ne 0 ]; then
    echo "❌ Frontend deployment failed"
    exit 1
fi

echo "✅ Test deployment completed successfully!"
echo ""
echo "🧪 Test Environment URLs:"
echo "Backend: $BACKEND_URL"
echo "Frontend: Check Vercel dashboard for preview URL"
echo ""
echo "📋 Test the deployment:"
echo "1. Backend health: curl $BACKEND_URL/api/health"
echo "2. Frontend: Visit the Vercel preview URL"
echo "3. Test all functionality before going to production" 