#!/bin/bash

echo "🔥 Setting up Firebase for Rotary Lake Website..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Create firebase directory if it doesn't exist
if [ ! -d "firebase" ]; then
    echo "📁 Creating firebase directory..."
    mkdir -p firebase
fi

# Install Firebase dependencies
echo "📦 Installing Firebase dependencies..."
cd firebase
npm install

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    cp env.example .env
    echo "✅ .env file created. Please edit it with your Firebase configuration."
else
    echo "✅ .env file already exists"
fi

# Check if serviceAccountKey.json exists
if [ ! -f "serviceAccountKey.json" ]; then
    echo "⚠️  serviceAccountKey.json not found!"
    echo "📋 Please download it from Firebase Console:"
    echo "   1. Go to Firebase Console"
    echo "   2. Project Settings > Service Accounts"
    echo "   3. Click 'Generate new private key'"
    echo "   4. Save as 'firebase/serviceAccountKey.json'"
    echo ""
    echo "After downloading, run: node setup.js"
else
    echo "✅ serviceAccountKey.json found"
    echo "🚀 Running Firebase setup..."
    node setup.js
fi

# Go back to root directory
cd ..

# Install additional frontend dependencies
echo "📦 Installing additional frontend dependencies..."
npm install axios react-icons

# Create frontend .env file
echo "⚙️  Creating frontend .env file..."
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

echo ""
echo "🎉 Firebase setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Edit firebase/.env with your Firebase project details"
echo "2. Download serviceAccountKey.json from Firebase Console"
echo "3. Run: cd firebase && node setup.js"
echo "4. Start backend: cd firebase && npm run dev"
echo "5. Start frontend: npm start"
echo "6. Access admin panel at: http://localhost:3000/admin"
echo ""
echo "📖 For detailed instructions, see README-FIREBASE-SETUP.md" 