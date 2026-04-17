@echo off
REM LearnTales Full Stack Setup Script for Windows
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║  LearnTales - Full Stack Setup Script (Windows)        ║
echo ║  React + Express + MongoDB                             ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
echo [1/4] Checking for Node.js...
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install it first!
    echo 📥 Download from https://nodejs.org/
    exit /b 1
) else (
    echo ✅ Node.js found: 
    node --version
)

echo.
echo [2/4] Installing Backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    cd ..
    echo ❌ Backend installation failed!
    exit /b 1
)
cd ..
echo ✅ Backend dependencies installed

echo.
echo [3/4] Installing Frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    cd ..
    echo ❌ Frontend installation failed!
    exit /b 1
)
cd ..
echo ✅ Frontend dependencies installed

echo.
echo [4/4] Checking Backend configuration...
if not exist "backend\.env" (
    echo ⚠️  No .env file found in backend/
    echo 📝 Creating .env from template...
    copy backend\.env.example backend\.env >nul
    echo ✅ .env created - please edit it with your MongoDB URI
)

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║  ✅ Setup Complete!                                    ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo 📋 NEXT STEPS:
echo.
echo 1. Edit backend\.env with your MongoDB connection string
echo.
echo 2. Open TWO terminals:
echo    Terminal 1: cd backend ^&^& npm run dev
echo    Terminal 2: cd frontend ^&^& npm run dev
echo.
echo 3. Open browser: http://localhost:3000
echo.
echo 📚 For more info, read README.md or QUICKSTART.md
echo.
pause
