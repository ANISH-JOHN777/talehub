#!/bin/bash

# Authentication API Testing Guide
# Run these commands to test the authentication system

# ============================================
# 1. REGISTER USER
# ============================================
echo "📝 Testing Registration..."
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "passwordConfirm": "password123"
  }' | jq .

echo -e "\n"

# ============================================
# 2. LOGIN USER
# ============================================
echo "🔑 Testing Login..."
RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }')

echo $RESPONSE | jq .

# Extract token from response
TOKEN=$(echo $RESPONSE | jq -r '.data.token')
echo "Token: $TOKEN"

echo -e "\n"

# ============================================
# 3. GET CURRENT USER (Protected Route)
# ============================================
echo "👤 Testing Get Current User..."
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "\n"

# ============================================
# 4. LOGOUT USER
# ============================================
echo "🚪 Testing Logout..."
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "\n"

# ============================================
# 5. TEST ERROR CASES
# ============================================
echo "❌ Testing Error: Missing Email"
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "password": "password123"
  }' | jq .

echo -e "\n"

echo "❌ Testing Error: Invalid Email"
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "password123"
  }' | jq .

echo -e "\n"

echo "❌ Testing Error: Password Mismatch"
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123",
    "passwordConfirm": "different123"
  }' | jq .

echo -e "\n"

echo "❌ Testing Error: Duplicate Email"
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe 2",
    "email": "john@example.com",
    "password": "password123",
    "passwordConfirm": "password123"
  }' | jq .

echo -e "\n"

echo "❌ Testing Error: Missing Token"
curl -X GET http://localhost:5000/api/auth/me | jq .

echo -e "\n"

echo "✅ All tests completed!"
