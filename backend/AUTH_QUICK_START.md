# Authentication System - Quick Start Guide

## 1️⃣ Install Dependencies

```bash
cd backend
npm install bcrypt jsonwebtoken
```

**What gets installed:**
- bcrypt (v5.1.0+) - Password hashing
- jsonwebtoken (v9.1.0+) - JWT token management

## 2️⃣ Set Environment Variables

**File: `backend/.env`**

```env
# JWT Configuration (REQUIRED)
JWT_SECRET=your_very_secure_random_secret_key_change_this_make_it_32_chars_long
JWT_EXPIRE=7d

# Database
MONGO_URI=mongodb://localhost:27017/learntales

# Server
PORT=5000
NODE_ENV=development
```

⚠️ **Important**: Change `JWT_SECRET` to a long random string for production!

```bash
# Generate a secure secret
openssl rand -base64 32
# Example output: FxR2k8L9mPqWvN3xYjZ5hG7sT9bK4cD6eF1pQ2rS...
```

## 3️⃣ Verify File Structure

Your backend folder should now have:

```
backend/
├── models/
│   ├── Book.js
│   └── User.js ✅ NEW
├── controllers/
│   ├── bookController.js
│   └── authController.js ✅ NEW
├── routes/
│   ├── bookRoutes.js
│   └── authRoutes.js ✅ NEW
├── middleware/
│   └── auth.js ✅ NEW
├── server.js ✅ UPDATED
├── .env ✅ NEW
├── package.json
├── seedBooks.js
└── AUTHENTICATION_GUIDE.md ✅ NEW
```

## 4️⃣ Start the Server

```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start backend
cd backend
npm run dev
# or npm start

# Expected output:
# ✅ MongoDB connected successfully
# 🚀 Server running on port 5000
```

## 5️⃣ Test Authentication

### Quick Test (Using cURL)

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "passwordConfirm": "password123"
  }'

# Response with token
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Test User",
    "email": "test@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Using the Test Script

```bash
cd backend

# On Linux/Mac
bash test-auth.sh

# On Windows (requires jq)
# Or use individual curl commands from the script
```

## 6️⃣ API Endpoints Ready

### Public Routes (No Authentication Needed)

- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login and get token

### Protected Routes (Requires Bearer Token)

- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user

## 7️⃣ Using the Authentication in Frontend

### Example: React Login

```jsx
// LoginPage.jsx
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (data.success) {
        // Store token
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data))
        // Redirect to dashboard
        window.location.href = '/dashboard'
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  )
}
```

## 8️⃣ Next: Protect Book Routes

### Example: Make Book Creation Require Auth

**File: `backend/routes/bookRoutes.js`**

```javascript
const { protect } = require('../middleware/auth')

// Only authenticated users can create books
router.post('/', protect, createBook)

// But anyone can read books
router.get('/', getAllBooks)
```

## ✅ Verification Checklist

- [ ] bcrypt and jsonwebtoken installed
- [ ] .env file with JWT_SECRET
- [ ] MongoDB running
- [ ] Backend started successfully
- [ ] Can register new user
- [ ] Can login and receive token
- [ ] Can access /auth/me with token
- [ ] Token rejected when expired
- [ ] New auth routes show in API

## 🐛 Common Issues & Solutions

### "JWT_SECRET is not defined"
```
✅ Solution: Add JWT_SECRET to .env file
```

### "Cannot find module 'bcrypt'"
```
✅ Solution: Run npm install bcrypt
```

### "Cannot find module 'jsonwebtoken'"
```
✅ Solution: Run npm install jsonwebtoken
```

### "Email already registered"
```
✅ Solution: Use different email or delete user from MongoDB
```

### "Invalid credentials"
```
✅ Solution: Check email/password are correct
```

## 📖 Full Documentation

For complete details, see: `AUTHENTICATION_GUIDE.md`

Contents:
- Architecture diagram
- All endpoint specifications
- cURL testing examples
- Security best practices
- Frontend integration patterns
- Troubleshooting guide

## 🎯 What You Can Do Now

✅ Register new users with password hashing
✅ Login users and get JWT tokens
✅ Protect routes with authentication middleware
✅ Add role-based access control
✅ Refresh tokens (advanced)
✅ Email verification (advanced)
✅ Password reset (advanced)

## 🚀 Ready to Test?

1. Start MongoDB: `mongod`
2. Start backend: `npm run dev`
3. Register: `curl -X POST http://localhost:5000/api/auth/register ...`
4. Login: `curl -X POST http://localhost:5000/api/auth/login ...`
5. Get token: Save from response
6. Use token: `curl -X GET http://localhost:5000/api/auth/me -H "Authorization: Bearer {token}"`

You're all set! 🎉
