# CORS Error Fix & Troubleshooting Guide

## ❌ Error Message
```
Unsafe attempt to load URL http://localhost:5000/api/books from frame with URL chrome-error://chromewebdata/. 
Domains, protocols and ports must match.
```

## 🔍 What This Means

CORS (Cross-Origin Resource Sharing) error occurs when:
- Frontend and Backend are on different origins
- The browser blocks cross-origin requests for security
- The proxy isn't configured or working

---

## ✅ Solution

### Step 1: Restart Both Servers

**Ensure BOTH servers are running:**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Expected Output:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE ready in xxx ms
➜  Local:   http://localhost:3000/
```

---

### Step 2: Test Directly (Without Proxy)

Open browser and test backend directly:
```
http://localhost:5000/api/test
```

**You should see:**
```json
{
  "message": "✅ Backend API is running!",
  "timestamp": "...",
  "status": "Connected",
  "version": "2.0"
}
```

If this fails:
- ❌ Backend isn't running
- ❌ MongoDB isn't connected
- ❌ Backend crashed

---

### Step 3: Test Frontend Proxy

Open browser and test through proxy:
```
http://localhost:3000/api/test
```

**You should see same response as above** (but through proxy)

If this fails:
- ❌ Proxy configuration issue
- ❌ Frontend server restarted needed

---

## 🔧 Configuration Changes Made

### Backend (server.js) - Updated CORS
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

**What this does:**
- ✅ Allows requests from port 3000 (Vite default)
- ✅ Allows requests from port 5173 (Vite alternative)
- ✅ Allows credentials (cookies, auth)
- ✅ Allows all HTTP methods
- ✅ Allows common headers

---

### Frontend (vite.config.js) - Enhanced Proxy
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
    secure: false,
    ws: true
  }
}
```

**What this does:**
- ✅ Routes `/api/*` to backend
- ✅ Changes origin header
- ✅ Allows insecure (http) connections
- ✅ Enables WebSocket support

---

## 🧪 Quick Test

### 1. Check Backend Health
```bash
curl http://localhost:5000/health
```

### 2. Check if API works
```bash
curl http://localhost:5000/api/test
```

### 3. Create a test book
```bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","author":"Test","description":"Test"}'
```

### 4. Test from React Code
```javascript
// In your React component
useEffect(() => {
  fetch('/api/books')
    .then(res => res.json())
    .then(data => console.log('✅ Success:', data))
    .catch(err => console.error('❌ Error:', err))
}, [])
```

---

## 🐛 Troubleshooting Checklist

- [ ] **Backend running?**
  ```bash
  Frontend says: ✅ Backend API is running!
  ```

- [ ] **MongoDB connected?**
  ```bash
  Backend console shows: ✅ MongoDB connected successfully
  ```

- [ ] **Both ports correct?**
  - Frontend: `http://localhost:3000`
  - Backend: `http://localhost:5000`

- [ ] **Firewall blocking?**
  - Try accessing backend from browser directly
  - Check Windows Defender Firewall

- [ ] **Did you restart frontend after config change?**
  - Stop: `Ctrl+C`
  - Restart: `npm run dev`

---

## ❌ Common Issues & Fixes

### Issue 1: "Cannot GET /api/books"
**Cause:** Backend not running
**Fix:** Start backend with `npm run dev` in backend folder

### Issue 2: "Connection refused"
**Cause:** Backend on wrong port
**Fix:** Check `.env` PORT is 5000

### Issue 3: "CORS error still showing"
**Cause:** Frontend not restarted after config change
**Fix:** 
```bash
# Stop frontend with Ctrl+C
npm run dev   # Restart
```

### Issue 4: "MongoDB disconnected"
**Cause:** MongoDB not running
**Fix:**
```bash
# Windows: Start MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGO_URI in .env with connection string
```

### Issue 5: "Port 5000 already in use"
**Cause:** Another process using the port
**Fix:** Change PORT in `.env` to 5001

---

## 🔍 How the API Call Works Now

```
Frontend (localhost:3000)
    ↓
fetch('/api/books')
    ↓
Vite Proxy (catches /api/*)
    ↓
Routes to http://localhost:5000/api/books
    ↓
Backend Server
    ↓
CORS Middleware (allows request)
    ↓
Routes to controller
    ↓
Queries MongoDB
    ↓
Returns response through proxy
    ↓
Frontend receives data ✅
```

---

## 📝 Frontend Code Template

**Safe way to fetch from backend:**

```javascript
import { useState, useEffect } from 'react'

export default function TestAPI() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Use relative URL - proxy will handle
    fetch('/api/test')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        return res.json()
      })
      .then(data => {
        console.log('✅ API Response:', data)
        setData(data)
        setError(null)
      })
      .catch(error => {
        console.error('❌ Fetch Error:', error)
        setError(error.message)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div style={{color: 'red'}}>Error: {error}</div>
  
  return (
    <div>
      <h2>✅ API Connected!</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
```

---

## ✨ Best Practices

### DO:
- ✅ Use relative URLs: `/api/books`
- ✅ Use proxy during development
- ✅ Keep both servers running
- ✅ Test backend independently first
- ✅ Check browser console for errors

### DON'T:
- ❌ Use full URLs: `http://localhost:5000/api/books`
- ❌ Forget to restart frontend after config changes
- ❌ Leave backend offline
- ❌ Run multiple instances on same port
- ❌ Ignore CORS errors - always fix them

---

## 🚀 Verification Steps

1. **Check Backend**
   ```bash
   curl http://localhost:5000/api/test
   # Should return: ✅ Backend API is running!
   ```

2. **Check Proxy**
   ```bash
   curl http://localhost:3000/api/test
   # Should return: ✅ Backend API is running!
   ```

3. **Check Console**
   - Open DevTools: F12
   - Check Console tab for errors
   - Check Network tab for requests

4. **Test in Browser**
   - Visit http://localhost:3000
   - Check home page shows "Connected" badge
   - Navigate to pages and verify they work

---

## 📞 Still Having Issues?

### Step 1: Verify Servers
```bash
# Backend
curl -v http://localhost:5000/health

# Frontend (should redirect/work)
curl -v http://localhost:3000/
```

### Step 2: Check Logs
- Backend console: Any error messages?
- Frontend console (DevTools): Any error messages?

### Step 3: Clear Cache
- Browser: Ctrl+Shift+Del (Clear browsing data)
- Frontend: Stop and restart with `npm run dev`

### Step 4: Check .env
```
# backend/.env
MONGO_URI=mongodb://localhost:27017/learntales
PORT=5000
NODE_ENV=development
```

---

## 🎯 Success Signs

When everything works:
- ✅ Backend console: `✅ MongoDB connected successfully`
- ✅ Frontend console: No CORS errors
- ✅ Network tab: API requests show 200 status
- ✅ Home page shows: `✅ Connected`
- ✅ Response data appears on pages

---

**CORS is now fixed! 🎉**

If you still have issues after following this guide, let me know the exact error message from the browser console and I can debug further.
