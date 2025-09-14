@echo off
echo 🚀 QualityBot Deployment Script
echo ================================

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

echo ✅ Node.js and npm are installed

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Build the project
echo 🔨 Building the project...
npm run build

REM Check if build was successful
if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo.
    echo 🎯 Next steps:
    echo 1. Deploy frontend to Vercel:
    echo    - Install Vercel CLI: npm i -g vercel
    echo    - Run: vercel
    echo.
    echo 2. Deploy backend to Railway:
    echo    - Install Railway CLI: npm i -g @railway/cli
    echo    - Run: railway login ^&^& railway up
    echo.
    echo 3. Update API URLs in frontend after backend deployment
    echo.
    echo 📚 See deploy-vercel.md for detailed instructions
) else (
    echo ❌ Build failed. Please check the errors above.
)

pause
