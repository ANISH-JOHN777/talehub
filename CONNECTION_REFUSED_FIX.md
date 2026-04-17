# ERR_CONNECTION_REFUSED - Server Not Running Fix

## 🔴 What This Error Means

```
localhost refused to connect
ERR_CONNECTION_REFUSED
```

**This means:**
- ❌ Server is not running
- ❌ Server crashed
- ❌ Port is blocked or in use
- ❌ Backend/Frontend process stopped

---

## ✅ Quick Fix (3 Steps)

### Step 1: Check Backend is Running

**Open Terminal 1 and verify:**
```bash
cd backend
npm run dev
```

**Look for these messages:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

**If you don't see these, MongoDB might not be running:**
```bash
# Start MongoDB (Windows Command Prompt - NOT PowerShell)
mongod
```

### Step 2: Check Frontend is Running

**Open Terminal 2 and verify:**
```bash
cd frontend
npm run dev
```

**Look for these messages:**
```
VITE ready in xxx ms
➜  Local:   http://localhost:3000/
```

### Step 3: Test Both Servers

**Check backend:**
```bash
# In another terminal, run:
curl http://localhost:5000/api/test
```

**Should return:**
```json
{
  "message": "✅ Backend API is running!",
  "status": "Connected"
}
```

**Check frontend:**
```bash
curl http://localhost:3000/
```

**Should return HTML page**

---

## 🐛 Detailed Troubleshooting

### Issue 1: Port 5000 Already in Use

**Symptom:** Backend won't start on port 5000

**Solution A: Kill Process Using Port 5000**
```powershell
# PowerShell - Find and kill process on port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with number shown)
taskkill /PID <PID> /F

# Now restart backend
npm run dev
```

**Solution B: Use Different Port**
```bash
# Edit backend/.env
PORT=5001

# Restart backend
npm run dev
```

### Issue 2: Port 3000 Already in Use

**Symptom:** Frontend won't start on port 3000

**Solution A: Kill Process Using Port 3000**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Solution B: Use Different Port**
```bash
# Edit frontend/vite.config.js
# Change port: 3000 to port: 3001

# Restart frontend
npm run dev
```

### Issue 3: MongoDB Not Connected

**Symptom:** Backend starts but shows MongoDB error

```
❌ MongoDB connection error
```

**Solution:**

**Option A: Start Local MongoDB**
```bash
# Windows Command Prompt (NOT PowerShell)
mongod
```

**Check if mongod is running:**
```powershell
tasklist | findstr mongod
```

**Option B: Use MongoDB Atlas (Cloud)**

1. Create account: https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update `backend/.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/learntales
   ```
5. Restart backend: `npm run dev`

### Issue 4: Server Crashed After Starting

**Symptom:** Server started but then stopped

**Check error messages in console:**
- MongoDB connection error → Fix MongoDB
- Port error → Free up port
- Module error → Run `npm install`

**Restart with debug:**
```bash
NODE_ENV=development npm run dev
```

---

## 🔍 Full Diagnostic Checklist

Run these commands in PowerShell:

### Check if Node.js is installed
```powershell
node --version
npm --version
```

### Check running processes
```powershell
# Check if node is running
tasklist | findstr node

# Check if mongod is running
tasklist | findstr mongod
```

### Check if ports are in use
```powershell
# Check port 3000 (frontend)
netstat -ano | findstr :3000

# Check port 5000 (backend)
netstat -ano | findstr :5000

# Check port 27017 (MongoDB)
netstat -ano | findstr :27017
```

### Test connectivity
```powershell
# Test backend connection
Test-NetConnection -ComputerName localhost -Port 5000

# Test frontend connection
Test-NetConnection -ComputerName localhost -Port 3000
```

---

## 📋 Server Startup Sequence (Correct Order)

### 1️⃣ Start MongoDB (Terminal 0 - Command Prompt)
```bash
mongod
# Should show: "waiting for connections on port 27017"
```

### 2️⃣ Start Backend (Terminal 1 - PowerShell)
```bash
cd backend
npm run dev
# Should show: "✅ MongoDB connected successfully"
#              "🚀 Server running on port 5000"
```

### 3️⃣ Start Frontend (Terminal 2 - PowerShell)
```bash
cd frontend
npm run dev
# Should show: "➜  Local:   http://localhost:3000/"
```

### 4️⃣ Open Browser
```
http://localhost:3000
```

---

## ❌ Common Issues & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `ERR_CONNECTION_REFUSED` | Server not running | Start server with `npm run dev` |
| `Port already in use` | Another process on same port | Kill process or use different port |
| `MongoDB connection error` | MongoDB not running | Start `mongod` |
| `Cannot find module` | Dependencies missing | Run `npm install` |
| `Blank/loading page` | Backend not responding | Check backend is running |
| `"Cannot GET /api/books"` | API endpoint issue | Check backend logs |

---

## 🚀 Complete Startup Script

**Create file: `START_SERVERS.bat`**
```batch
@echo off
echo Starting LearnTales...

REM Check if running from correct directory
if not exist "backend" (
    echo Error: Run this from the project root (learn tales folder)
    pause
    exit /b 1
)

echo.
echo [1/3] Starting MongoDB...
start "MongoDB" mongod
timeout /t 3

echo [2/3] Starting Backend...
start "Backend" cmd /k "cd backend && npm run dev"
timeout /t 5

echo [3/3] Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3

echo.
echo ✅ All services starting...
echo Open: http://localhost:3000
echo Press any key to close these messages
pause
```

**Run:** Double-click `START_SERVERS.bat`

---

## 🔧 Manual Full Reset

If everything is broken, try a clean start:

```bash
# 1. Kill all Node processes
taskkill /F /IM node.exe

# 2. Kill all mongod processes  
taskkill /F /IM mongod.exe

# 3. Clear node_modules (both folders)
cd backend
rm -r node_modules
npm install

cd ../frontend
rm -r node_modules
npm install

# 4. Start fresh
# Terminal 0: mongod
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm run dev
```

---

## ✅ Verification Commands

**When everything works, these should all succeed:**

```bash
# 1. Test backend health
curl http://localhost:5000/health

# 2. Test backend API
curl http://localhost:5000/api/test

# 3. Test frontend proxy
curl http://localhost:3000/api/test

# 4. Check MongoDB
# MongoDB should be running and listening on 27017
```

---

## 📝 Required Environment

### Windows Specific:
- ✅ PowerShell or Command Prompt
- ✅ Node.js v16+ installed
- ✅ MongoDB installed OR MongoDB Atlas account
- ✅ npm or yarn
- ✅ Ports 3000, 5000, 27017 available

### Ports Used:
- `3000` - React frontend (Vite)
- `5000` - Express backend
- `27017` - MongoDB (local)

---

## 🎯 Quick Verification

```powershell
# All-in-one test (run these in sequence)

# Test 1: Can you reach localhost:5000?
(New-Object System.Net.WebClient).DownloadString("http://localhost:5000/api/test")

# Test 2: Can you reach localhost:3000?
(New-Object System.Net.WebClient).DownloadString("http://localhost:3000/")

# Test 3: Are ports listening?
netstat -an | Select-String "3000|5000|27017"
```

---

## 💡 Pro Tips

1. **Always start in this order:**
   - MongoDB first
   - Backend second (wait for "connected")
   - Frontend third

2. **Keep terminals open:**
   - Don't close tab without stopping server
   - Ctrl+C stops the server gracefully

3. **Check logs first:**
   - Look for error messages in terminal
   - 99% of issues show in terminal output

4. **Restart if unsure:**
   - Stop with Ctrl+C
   - Wait 2 seconds
   - Start again with npm run dev

5. **Port conflicts:**
   - Many apps use port 3000
   - Check what's using it and close it

---

## 🆘 If Still Not Working

1. **Post the exact error message** you see in terminal
2. **Show what's running:**
   ```powershell
   tasklist | findstr "node mongod"
   ```
3. **Show port status:**
   ```powershell
   netstat -ano | findstr ":3000\|:5000\|:27017"
   ```
4. **Show npm version:**
   ```powershell
   npm --version
   node --version
   ```

---

**Try the Quick Fix above first - it solves 90% of connection refused errors! 🚀**
