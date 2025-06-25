#!/bin/bash

echo "🏰 Setting up Kingdoms of Fate..."

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

echo "📦 Installing dependencies..."
npm install

echo "🔧 Setting up Convex..."
if ! command -v npx &> /dev/null; then
    echo "❌ npx is not available. Please ensure Node.js is properly installed."
    exit 1
fi

# Check if convex is available
if ! npx convex --version &> /dev/null; then
    echo "📥 Installing Convex CLI..."
    npm install -g convex
fi

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo "1. Run 'npm run dev' to start the frontend"
echo "2. Run 'npx convex dev' to start the backend"
echo ""
echo "📖 See SETUP.md for detailed instructions"
