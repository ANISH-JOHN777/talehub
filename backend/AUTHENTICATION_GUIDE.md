# Authentication System Setup & Documentation

## 📋 Overview

This document covers the complete JWT authentication system for LearnTales backend.

### Architecture
```
User Input
    ↓
POST /api/auth/register or /api/auth/login
    ↓
User Model (Mongoose)
    ↓
bcrypt (Password Hashing)
    ↓
JWT Token Generation
    ↓
Response with Token
    ↓
Client stores token
    ↓
Include token in Authorization header: "Bearer {token}"
    ↓
protect middleware verifies token
    ↓
Access protected routes
```

## 🚀 Installation

### 1. Install Required Packages

```bash
cd backend
npm install bcrypt jsonwebtoken
```

**Package Details:**
- **bcrypt**: For password hashing (v5.1.0+)
- **jsonwebtoken**: For JWT token management (v9.1.0+)

### 2. Verify Files Created

```bash
# Models
backend/models/User.js

# Controllers
backend/controllers/authController.js

# Middleware
backend/middleware/auth.js

# Routes
backend/routes/authRoutes.js

# Configuration
backend/.env
```

### 3. Environment Variables

**.env file:**
```
JWT_SECRET=your_jwt_secret_key_change_this_in_production_make_it_long_and_random_at_least_32_characters
JWT_EXPIRE=7d
MONGO_URI=mongodb://localhost:27017/learntales
PORT=5000
```

**⚠️ Important:** Change `JWT_SECRET` to a long, random string for production!

## 📚 API Endpoints

### 1. **POST /api/auth/register**

**Description:** Register a new user

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Email already registered"
}
```

**Validation Rules:**
- ✅ Name: 2-50 characters, required
- ✅ Email: Valid email format, required, unique
- ✅ Password: Minimum 6 characters, required
- ✅ Passwords must match
- ✅ Email must be unique in database

---

### 2. **POST /api/auth/login**

**Description:** Login user and receive JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

### 3. **GET /api/auth/me** *(Protected)*

**Description:** Get current logged-in user details

**Required Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

---

### 4. **POST /api/auth/logout** *(Protected)*

**Description:** Logout current user (mainly for frontend cleanup)

**Required Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

## 🔐 Using Protected Routes

### Protecting Routes

**Example: Protect book creation route**

```javascript
const { protect } = require('../middleware/auth')

// This route requires authentication
router.post('/create', protect, createBook)
```

### Making Authenticated Requests

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Fetch Example:**
```javascript
const token = localStorage.getItem('token')

const response = await fetch('http://localhost:5000/api/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})

const data = await response.json()
```

**Axios Example:**
```javascript
import axios from 'axios'

const token = localStorage.getItem('token')

const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

const { data } = await apiClient.get('/api/auth/me')
```

## 🧪 Testing with cURL

### 1. Register New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Smith",
    "email": "alice@example.com",
    "password": "password123",
    "passwordConfirm": "password123"
  }'
```

### 2. Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "password123"
  }'
```

**Output:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YTQ0YTQ0YTQ0YTQ0YTQ0YTQ0YTQ0YSIsImlhdCI6MTcwNTE5MTk4MCwiZXhwIjoxNzA1Nzk2NzgwfQ.abc123def456..."
  }
}
```

### 3. Use Token to Access Protected Route

```bash
# Save token from login response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Get current user
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## 🔒 How Passwords Are Secured

### Registration Flow
```
User submits password: "password123"
    ↓
Middleware validation (required, min 6 chars)
    ↓
Check password confirmation matches
    ↓
bcrypt.genSalt(10) → creates random salt
    ↓
bcrypt.hash(password, salt) → produces hashed password
    ↓
Hashed password stored in MongoDB
    ↓
Original password never stored
```

### Login Flow
```
User submits email + password
    ↓
Find user by email in database
    ↓
Select password field (+password)
    ↓
bcrypt.compare(submitted_password, stored_hash)
    ↓
Returns true/false
    ↓
If true → Generate JWT token
If false → Return "Invalid credentials"
```

## 🎫 JWT Token Structure

A JWT token has 3 parts separated by dots:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YTQ0YTQ0YTQ0YTQ0YTQ0YTQ0YTQ0YSIsImlhdCI6MTcwNTE5MTk4MCwiZXhwIjoxNzA1Nzk2NzgwfQ.abc123def456...
↑                                      ↑                                                        ↑
Header                                 Payload                                                Signature
```

**Decoded Payload Example:**
```json
{
  "id": "65a44a44a44a44a44a44a44a",
  "iat": 1705191980,
  "exp": 1705796780
}
```

- **id**: User's MongoDB ID
- **iat**: Issued At (timestamp)
- **exp**: Expiration (7 days by default)

## 🛡️ Security Best Practices

### ✅ Currently Implemented

1. **Password Hashing**: bcrypt with salt rounds (10)
2. **Password Confirmation**: Must match during registration
3. **Email Validation**: Regex pattern matching
4. **Unique Email**: Database enforces unique constraint
5. **Password Hidden**: Select field marked with `select: false`
6. **Token Expiration**: Expires in 7 days by default
7. **Token Verification**: Middleware validates every request
8. **Error Messages**: Vague ("Invalid credentials") for security

### 📝 Recommended Additions (Future)

```javascript
// 1. Rate limiting on auth routes
const rateLimit = require('express-rate-limit')

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: 'Too many login attempts, please try again later'
})

router.post('/login', authLimiter, login)

// 2. Email verification
// Check email is real before allowing account

// 3. Password strength requirements
// Enforce uppercase, numbers, special characters

// 4. Refresh tokens
// Issue separate refresh token for token renewal

// 5. Token blacklist
// Invalidate tokens on logout
```

## 📖 User Model Schema

```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, valid email format),
  password: String (hashed, required, min 6 chars, hidden by default),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🔗 Integration with Frontend

### 1. Store Token After Login

```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})

const data = await response.json()

if (data.success) {
  // Store token in localStorage
  localStorage.setItem('token', data.data.token)
  localStorage.setItem('user', JSON.stringify(data.data))
}
```

### 2. Use Token in Requests

```javascript
// Create axios instance with token
const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})

// All requests automatically include the token
const { data } = await apiClient.get('/api/books')
```

### 3. Clear Token on Logout

```javascript
localStorage.removeItem('token')
localStorage.removeItem('user')
// Redirect to login page
```

## 🐛 Troubleshooting

### Issue: "JWT_SECRET is not defined"
**Solution:** Add JWT_SECRET to .env file

```env
JWT_SECRET=your_secret_key_here
```

### Issue: "Email already registered"
**Solution:** Use different email or reset database

```bash
# In MongoDB shell
use learntales
db.users.deleteMany({})
```

### Issue: "Invalid credentials"
**Solution:** Check email/password are correct

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Issue: "Not authorized to access this route"
**Solution:** Include valid Bearer token in Authorization header

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Issue: "Token expired"
**Solution:** User needs to login again to get new token

```javascript
// Handle 401 response
if (error.response?.status === 401) {
  localStorage.removeItem('token')
  // Redirect to login
  window.location.href = '/login'
}
```

## 📊 File Overview

| File | Purpose | Lines |
|------|---------|-------|
| models/User.js | User schema with password hashing | ~65 |
| controllers/authController.js | Register, login, getMe, logout logic | ~120 |
| middleware/auth.js | JWT verification middleware | ~50 |
| routes/authRoutes.js | Auth endpoint routing | ~15 |

## ✨ Next Steps

1. ✅ **Install packages**: `npm install bcrypt jsonwebtoken`
2. ✅ **Test endpoints**: Use cURL or Postman
3. ⏳ **Create Login UI**: React login form component
4. ⏳ **Create Register UI**: React registration form
5. ⏳ **Add protected book routes**: Require auth for create/update/delete
6. ⏳ **Add refresh token logic**: For better UX
7. ⏳ **Add email verification**: Before account activation
8. ⏳ **Add role-based access**: Admin, user, guest roles

## 📚 References

- [bcrypt Documentation](https://www.npmjs.com/package/bcrypt)
- [JWT Documentation](https://www.npmjs.com/package/jsonwebtoken)
- [Mongoose Schema](https://mongoosejs.com/docs/schema.html)
- [Express Middleware](https://expressjs.com/en/guide/using-middleware.html)
