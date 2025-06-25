@echo off
echo 🏰 Setting up Kingdoms of Fate...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
npm install

echo 🔧 Setting up Convex...
npx convex --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📥 Installing Convex CLI...
    npm install -g convex
)

echo ✅ Setup complete!
echo.
echo 🚀 To start the application:
echo 1. Run 'npm run dev' to start the frontend
echo 2. Run 'npx convex dev' to start the backend
echo.
echo 📖 See SETUP.md for detailed instructions
pause
