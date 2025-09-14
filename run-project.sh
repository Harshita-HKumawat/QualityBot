#!/bin/bash

echo "========================================"
echo "   QualityBot - Setup and Run Script"
echo "========================================"
echo

# Check if Node.js is installed
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    echo "Version 18.0.0 or higher is required."
    exit 1
fi

# Check if npm is installed
echo "Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed!"
    echo "Please install npm (comes with Node.js)."
    exit 1
fi

# Display versions
echo "Node.js version:"
node --version
echo "npm version:"
npm --version
echo

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "ERROR: package.json not found!"
    echo "Please run this script from the project directory."
    echo "Current directory: $(pwd)"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies!"
        exit 1
    fi
    echo "Dependencies installed successfully!"
    echo
fi

# Kill any existing Node.js processes on port 5173
echo "Checking for existing processes on port 5173..."
if lsof -ti:5173 > /dev/null 2>&1; then
    echo "Found existing process on port 5173. Stopping it..."
    lsof -ti:5173 | xargs kill -9
    sleep 2
fi

# Start the development server
echo "Starting QualityBot development server..."
echo
echo "========================================"
echo "   QualityBot is starting..."
echo "========================================"
echo
echo "Access the application at:"
echo "- Local: http://localhost:5173"
echo "- Network: http://$(hostname -I | awk '{print $1}'):5173"
echo
echo "Press Ctrl+C to stop the server"
echo

npm run dev

echo
echo "Server stopped." 