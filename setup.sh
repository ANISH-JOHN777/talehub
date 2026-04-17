#!/bin/bash

# LearnTales Full Stack Setup Script for macOS/Linux
echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  LearnTales - Full Stack Setup Script                  ║"
echo "║  React + Express + MongoDB                             ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
echo "[1/4] Checking for Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first!"
    echo "📥 Download from https://nodejs.org/"
    exit 1
else
    echo "✅ Node.js found:"
    node --version
fi

echo ""
echo "[2/4] Installing Backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    cd ..
    echo "❌ Backend installation failed!"
    exit 1
fi
cd ..
echo "✅ Backend dependencies installed"

echo ""
echo "[3/4] Installing Frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    cd ..
    echo "❌ Frontend installation failed!"
    exit 1
fi
cd ..
echo "✅ Frontend dependencies installed"

echo ""
echo "[4/4] Checking Backend configuration..."
if [ ! -f "backend/.env" ]; then
    echo "⚠️  No .env file found in backend/"
    echo "📝 Creating .env from template..."
    cp backend/.env.example backend/.env
    echo "✅ .env created - please edit it with your MongoDB URI"
fi

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  ✅ Setup Complete!                                    ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "1. Edit backend/.env with your MongoDB connection string"
echo ""
echo "2. Open TWO terminals:"
echo "   Terminal 1: cd backend && npm run dev"
echo "   Terminal 2: cd frontend && npm run dev"
echo ""
echo "3. Open browser: http://localhost:3000"
echo ""
echo "📚 For more info, read README.md or QUICKSTART.md"
echo ""
