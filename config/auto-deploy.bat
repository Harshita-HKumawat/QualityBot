@echo off
echo 🚀 QualityBot Auto-Deployment Script
echo =====================================

echo.
echo 📋 Checking prerequisites...

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed. Please install Git first.
    echo Download from: https://git-scm.com/downloads
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed!

echo.
echo 🔧 Step 1: Building project...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed! Please check the errors above.
    pause
    exit /b 1
)

echo ✅ Build successful!

echo.
echo 📁 Step 2: Initializing Git repository...
if not exist ".git" (
    git init
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)

echo.
echo 📤 Step 3: Adding files to Git...
git add .

echo.
echo 📋 Checking what will be uploaded...
git status

echo.
echo ⚠️  IMPORTANT: Make sure you don't see config.py or .env files above!
echo If you see them, they are not properly hidden by .gitignore
echo.

set /p confirm="Do you want to continue with the commit? (y/n): "
if /i "%confirm%" neq "y" (
    echo Deployment cancelled.
    pause
    exit /b 1
)

echo.
echo 💾 Step 4: Making first commit...
git commit -m "Initial commit: QualityBot - AI-Powered Quality Management Assistant with Excel/ERP Integration"

echo.
echo 🎯 Step 5: Ready for GitHub push!
echo.
echo 📋 Next steps:
echo 1. Create GitHub repository at: https://github.com/new
echo    - Name: qualitybot-msme
echo    - Description: AI-Powered Quality Management Assistant with Excel/ERP Integration for MSMEs
echo    - Make it Public
echo    - Don't initialize with README
echo.
echo 2. Push to GitHub:
echo    git remote add origin https://github.com/YOUR_USERNAME/qualitybot-msme.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Deploy to Vercel:
echo    - Go to: https://vercel.com/new
echo    - Import your GitHub repository
echo    - Framework: Vite
echo    - Build Command: npm run build
echo    - Output Directory: dist
echo.
echo 4. Deploy Backend to Railway:
echo    npm i -g @railway/cli
echo    railway login
echo    railway init
echo    railway up
echo.
echo 📚 See deploy-to-github.md for detailed instructions
echo.

pause
