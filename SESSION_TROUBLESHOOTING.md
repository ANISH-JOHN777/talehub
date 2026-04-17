# Session System - Troubleshooting Guide

## 🔧 Common Problems & Solutions

---

## 1. Sessions Not Loading in BookDetails

### Problem: "Loading sessions..." stuck or never disappears

**Possible Causes:**
- Backend not running
- Database not connected
- Wrong port (should be 5000)
- CORS issue
- Fetch URL incorrect

**Solution:**

```bash
# Step 1: Check backend is running
curl http://localhost:5000/api/info
# Should return endpoint info

# Step 2: Check specific endpoint
curl http://localhost:5000/api/sessions/[BOOK_ID]
# Should return { success: true, data: [...] }

# Step 3: Check browser console
# Press F12 → Console tab
# Look for fetch errors
```

**Fix:**
```javascript
// In browser console, run:
fetch('http://localhost:5000/api/sessions')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e))
```

---

## 2. "No token provided" Error When Creating Session

### Problem: 401 Unauthorized when trying to create session

**Cause:** Not authenticated or token not sent correctly

**Solution:**

```javascript
// In browser console, check token exists:
const token = localStorage.getItem('token')
console.log(token)  // Should show long JWT string

// If empty, you need to login first
```

**Fix:**
```bash
# 1. Go to http://localhost:5173/login
# 2. Login with valid account
# 3. Try creating session again with token in header

curl -X POST http://localhost:5000/api/sessions \
  -H "Authorization: Bearer PASTE_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

---

## 3. "Date must be in the future" Error

### Problem: Getting 400 error when date seems correct

**Cause:** Date is in past or server time is different

**Solution:**

```javascript
// Check current time
const now = new Date()
console.log(now.toISOString())
// Output example: 2025-01-15T10:30:45.123Z

// Create date 2 hours from now
const futureDate = new Date(Date.now() + 2 * 60 * 60 * 1000)
console.log(futureDate.toISOString())
// Use THIS date in API call
```

**Fix:**
```bash
# Always use ISO format with future timestamp
curl -X POST http://localhost:5000/api/sessions \
  -d '{
    "date": "2025-12-31T18:00:00Z"  # ✅ Far future = Safe
  }'
```

---

## 4. "Invalid URL" Error for Meet Link

### Problem: 400 error saying meetLink is invalid

**Cause:** URL doesn't match validation pattern or missing protocol

**Solution:**

```bash
# ✅ VALID URLs
"meetLink": "https://meet.google.com/abc-defg-hij"
"meetLink": "https://zoom.us/j/123456789"
"meetLink": "https://teams.microsoft.com/l/meetup-join/..."

# ❌ INVALID URLs
"meetLink": "meet.google.com/abc"  # Missing https://
"meetLink": "http://invalid-site"  # Not HTTPS
"meetLink": "not a url"  # No URL format
```

**Fix:**
```bash
curl -X POST http://localhost:5000/api/sessions \
  -d '{
    "meetLink": "https://meet.google.com/your-meeting-id"
  }'
```

---

## 5. Cannot Join Session - Already Attending

### Problem: 400 "Already attending this session"

**Cause:** User already in attendees array

**Solution:**

```bash
# Check if you're already in attendees
curl http://localhost:5000/api/sessions/[SESSION_ID]
# Look for your user ID in attendees array

# If already there, either:
# 1. Leave first, then rejoin
# 2. Ask another user to join
```

**Fix:**
```bash
# Leave session first
curl -X POST http://localhost:5000/api/sessions/[ID]/leave \
  -H "Authorization: Bearer $TOKEN"

# Then join again
curl -X POST http://localhost:5000/api/sessions/[ID]/join \
  -H "Authorization: Bearer $TOKEN"
```

---

## 6. Cannot Delete Session - Not Authorized

### Problem: 403 "Not authorized to delete session"

**Cause:** Only session creator can delete

**Solution:**

```bash
# Check who created the session
curl http://localhost:5000/api/sessions/[SESSION_ID]
# Look at createdBy field

# Check who you are
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# If IDs don't match, you can't delete
```

**Fix:**
- Only creator can delete
- Try creating your own session and deleting that one
- Or ask the creator to delete it

---

## 7. Frontend: Button Says "Session Ended" When Should Be "Join"

### Problem: All join buttons disabled even for future sessions

**Cause:** Date comparison issue in BookDetails component

**Solution:**

```javascript
// Check current time vs session date in browser console:
const sessionDate = new Date("2025-02-20T18:00:00Z")
const now = new Date()
console.log('Session Date:', sessionDate)
console.log('Now:', now)
console.log('Is Upcoming:', sessionDate > now)
```

**Fix in Code:**
```javascript
// In BookDetails.jsx, check the date comparison:
const isUpcoming = new Date(session.date) > new Date()

// Make sure session.date is valid timestamp
console.log(session.date)  // Should look like: 2025-02-20T18:00:00Z
```

---

## 8. Meet Link Doesn't Open When Click Join

### Problem: Click join button but nothing happens

**Cause:** 
- Browser blocking popups
- Link not in attendees array yet
- JavaScript error

**Solution:**

```javascript
// In browser console, test:
window.open('https://meet.google.com/abc-defg-hij', '_blank')
// Should open in new tab

// Check for JS errors (F12 → Console)
// Check if session has meetLink:
console.log(sessions[0].meetLink)
```

**Fix:**
```bash
# 1. Allow popups for this site
# 2. Manually copy meetLink and paste in browser
# 3. Clear browser cache and reload
```

---

## 9. CORS Error: "Access to XMLHttpRequest blocked"

### Problem: Browser blocks fetch request from frontend

**Cause:** Backend CORS not configured

**Solution:**

```javascript
// Check if backend has CORS enabled:
// In server.js should have:
const cors = require('cors')
app.use(cors())

// If not there, add it
```

**Fix:**
```bash
# In backend/server.js add at top:
const cors = require('cors')
app.use(cors())

# Before route definitions
# Then restart backend: npm start
```

---

## 10. MongoDB Connection Error

### Problem: Backend shows "Can't connect to MongoDB"

**Cause:** MongoDB not running or wrong connection string

**Solution:**

```bash
# Check MongoDB is running
# Windows:
wsl -d Ubuntu  # Or your Linux distro
sudo systemctl start mongodb

# macOS:
brew services start mongodb-community

# Or use MongoDB Atlas (cloud)
```

**Fix:**
```bash
# 1. Start MongoDB locally
# 2. OR use MongoDB Atlas connection string in .env

# In .env file:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/learntales
```

---

## 11. Sessions not showing in "Study Sessions" section

### Problem: Section shows but no sessions listed

**Possible Causes:**
- No sessions created for that book
- Sessions created for different book
- Empty state not showing properly

**Solution:**

```bash
# Check what sessions exist for book
curl http://localhost:5000/api/sessions/[BOOK_ID]

# If empty array:
# - Create a session for this book (see guide)
# - Use correct bookId in creation

# If has data but not showing in UI:
# Check browser console for render errors
```

**Fix:**
```javascript
// In browser console:
// If on BookDetails page, check:
console.log(sessions)  // Should show array
console.log(sessionsLoading)  // Should be false
```

---

## 12. Attendee Count Not Updating After Join

### Problem: Click join but count stays same

**Possible Causes:**
- UI not refreshing
- Join request failed silently
- Wrong session ID

**Solution:**

```bash
# 1. Check join request succeeded:
curl -X POST http://localhost:5000/api/sessions/[ID]/join \
  -H "Authorization: Bearer $TOKEN" \
  | grep -i success

# 2. Manual refresh in browser (F5) to see updated count

# 3. Check MongoDB directly:
db.sessions.findOne({_id: ObjectId("...")})
# Look at attendees array
```

**Fix:**
```javascript
// After joining, manually refresh sessions:
const response = await fetch(`http://localhost:5000/api/sessions/${id}`)
const data = await response.json()
if (data.success) setSessions(data.data)
```

---

## 13. Title or Description Not Saving

### Problem: Created session but title shows empty

**Possible Causes:**
- Title too short (needs 3+ chars)
- Special characters in title
- Request didn't actually send

**Solution:**

```bash
# Title requirements:
# - Minimum 3 characters
# - Maximum 100 characters
# - No HTML tags

# ✅ Valid
"title": "Chapter Discussion"

# ❌ Invalid
"title": "Ch"  # Too short
"title": "<script>..."  # HTML not allowed
```

**Fix:**
```bash
curl -X POST http://localhost:5000/api/sessions \
  -d '{
    "title": "Advanced Topics Discussion Here",
    "description": "Let us discuss..."
  }'
```

---

## 14. Can't Update Session Status

### Problem: PUT request to update status fails

**Cause:** Not authorized or invalid status value

**Solution:**

```bash
# Valid status values only:
# - "upcoming"
# - "ongoing"  
# - "completed"
# - "cancelled"

# ❌ Invalid
"status": "done"  # Not in enum
"status": "UPCOMING"  # Case sensitive
```

**Fix:**
```bash
curl -X PUT http://localhost:5000/api/sessions/[ID]/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "ongoing"}'
```

---

## 15. Book ID Invalid When Creating Session

### Problem: 404 "Book not found"

**Cause:** Using wrong bookId or book doesn't exist

**Solution:**

```bash
# 1. Get list of books
curl http://localhost:5000/api/books

# 2. Copy _id of a book (not title!)
# Example: "607f1f77bcf86cd799439011"

# 3. Use that id when creating session
curl -X POST http://localhost:5000/api/sessions \
  -d '{
    "bookId": "607f1f77bcf86cd799439011"
  }'
```

**Fix:**
```bash
# Make sure bookId is:
# - Real MongoDB ObjectId (24 hex chars)
# - Not the book title
# - From /api/books endpoint
```

---

## 🆘 Emergency Debug Checklist

If nothing works, go through this:

```
[ ] Backend running on port 5000?
    - curl http://localhost:5000/api/info

[ ] MongoDB connected?
    - Backend starts without connection error

[ ] Logged in on frontend?
    - localStorage.getItem('token') shows value

[ ] Using valid JWT token?
    - Token comes from login response

[ ] Using future date for sessions?
    - Date > current time

[ ] Using valid book ID?
    - From /api/books endpoint

[ ] Using HTTPS meetLink?
    - Starts with https://

[ ] Can see other API endpoints working?
    - /api/books, /api/books/:id, etc.

[ ] Tried restarting backend?
    - npm start

[ ] Tried clearing browser cache?
    - Ctrl+Shift+Delete or Cmd+Shift+Delete

[ ] Checked browser console for errors?
    - F12 → Console tab
```

---

## 📞 Still Stuck?

Check these files for more help:

1. **[SESSION_QUICK_START.md](SESSION_QUICK_START.md)** - Setup basics
2. **[SESSION_SYSTEM_GUIDE.md](SESSION_SYSTEM_GUIDE.md)** - Full API docs
3. **[SESSION_TESTING_GUIDE.md](SESSION_TESTING_GUIDE.md)** - Testing procedures

---

## 🐛 Report Issue

If you find a bug not listed here:

```
1. Check browser console (F12 → Console)
2. Check backend logs (terminal where npm start runs)
3. Check Network tab for failed requests
4. Write down the error message exactly
5. Note the steps to reproduce
6. Provide this info when reporting
```

---

That's all! Happy session sessions! 🎉
