#!/bin/bash

echo "🚀 QualityBot Deployment Script"
echo "================================"

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

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Deploy frontend to Vercel:"
    echo "   - Install Vercel CLI: npm i -g vercel"
    echo "   - Run: vercel"
    echo ""
    echo "2. Deploy backend to Railway:"
    echo "   - Install Railway CLI: npm i -g @railway/cli"
    echo "   - Run: railway login && railway up"
    echo ""
    echo "3. Update API URLs in frontend after backend deployment"
    echo ""
    echo "📚 See deploy-vercel.md for detailed instructions"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
