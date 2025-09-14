@echo off
echo ========================================
echo    QualityBot - Setup and Run Script
echo ========================================
echo.

:: Check if Node.js is installed
echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo Version 18.0.0 or higher is required.
    pause
    exit /b 1
)

:: Check if npm is installed
echo Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    echo Please install npm (comes with Node.js).
    pause
    exit /b 1
)

:: Display versions
echo Node.js version:
node --version
echo npm version:
npm --version
echo.

:: Check if we're in the correct directory
if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Please run this script from the project directory.
    echo Current directory: %CD%
    pause
    exit /b 1
)

:: Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
    echo.
)

:: Kill any existing Node.js processes on port 5173
echo Checking for existing processes on port 5173...
netstat -ano | findstr :5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo Found existing process on port 5173. Stopping it...
    taskkill /f /im node.exe >nul 2>&1
    timeout /t 2 >nul
)

:: Start the development server
echo Starting QualityBot development server...
echo.
echo ========================================
echo    QualityBot is starting...
echo ========================================
echo.
echo Access the application at:
echo - Local: http://localhost:5173
echo - Network: http://[your-ip]:5173
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev

echo.
echo Server stopped.
pause 