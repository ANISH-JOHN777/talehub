# Session System - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### What is the Session System?

The Session System lets users schedule and join **study sessions** for books they're reading. Think of it like scheduling meetups for your book club with video conference links included.

**Example:**
```
You're reading "The Great Gatsby"
  ↓
You create a session: "Chapters 1-3 Discussion"
  ↓
Schedule for tomorrow at 6pm
  ↓
Add Google Meet link
  ↓
Other readers can join!
```

---

## 📋 Prerequisites

1. Backend running: `npm start` (port 5000)
2. MongoDB connected
3. Logged in on frontend (http://localhost:5173)
4. At least 1 book in database

---

## ✅ Quick Setup

### 1. Verify Backend is Ready

```bash
# Test backend is running
curl http://localhost:5000/api/info

# Should show sessions endpoint:
{
  "endpoints": {
    "books": "/api/books",
    "users": "/api/users",
    "sessions": "/api/sessions"  ✅ This should exist
  }
}
```

### 2. Get Your JWT Token

```bash
# Login in browser and copy token from localStorage
# Open browser DevTools (F12) → Console → Run:
localStorage.getItem('token')

# Copy the token value (starts with eyJ...)
```

### 3. Create Your First Session

```bash
TOKEN="paste_your_token_here"
BOOK_ID="paste_any_book_id_from_/api/books"

curl -X POST http://localhost:5000/api/sessions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "First Discussion",
    "date": "2025-02-20T18:00:00Z",
    "meetLink": "https://meet.google.com/abc-defg-hij",
    "bookId": "'$BOOK_ID'",
    "description": "First session test"
  }'
```

**Should return:**
```json
{
  "success": true,
  "data": { /* your session */ }
}
```

### 4. View Sessions in Browser

```
1. Go to http://localhost:5173/books/[BOOK_ID]
2. Scroll down to "📚 Study Sessions"
3. See your session card!
4. Click "🎥 Join Session" button
5. Opens Google Meet in new tab
```

---

## 📦 Files You Need to Know

| File | Purpose | Status |
|------|---------|--------|
| `backend/models/Session.js` | Database schema | ✅ Created |
| `backend/controllers/sessionController.js` | Business logic | ✅ Created |
| `backend/routes/sessionRoutes.js` | API endpoints | ✅ Created |
| `backend/server.js` | Routes mounted | ✅ Updated |
| `frontend/src/pages/BookDetails.jsx` | Display sessions | ✅ Updated |

---

## 🎯 Main Features

### For Students

```
✅ View all study sessions for a book
✅ See who's leading each session
✅ Check how many people are attending
✅ Join sessions with one click
✅ Opens video conference link
```

### For Session Creators

```
✅ Schedule new sessions
✅ Set future date and time
✅ Add Google Meet link
✅ Write session description
✅ See who joined
✅ Cancel session if needed
```

---

## 🔌 All API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/sessions` | ✅ | Create session |
| GET | `/api/sessions` | ❌ | All sessions |
| GET | `/api/sessions/:bookId` | ❌ | Sessions for book |
| POST | `/api/sessions/:id/join` | ✅ | Join session |
| POST | `/api/sessions/:id/leave` | ✅ | Leave session |
| PUT | `/api/sessions/:id/status` | ✅ | Update status |
| DELETE | `/api/sessions/:id` | ✅ | Delete session |

---

## 💡 Example Workflows

### Workflow 1: Student Joins Session

```
1. Open book details page
2. Scroll to Study Sessions
3. See "Chapter 5 Discussion" at 6pm
4. Click "🎥 Join Session"
5. Google Meet opens → Join call
6. Discuss with others!
```

### Workflow 2: Teacher Creates Session

```
1. Login with teacher account
2. POST /api/sessions with:
   - Title: "Advanced Topics"
   - Date: 2025-02-20 18:00
   - MeetLink: Google Meet URL
   - BookId: The book to discuss
3. Session created
4. Students can now see it
5. Students join and attend
```

---

## 🧪 Test in 30 Seconds

### Method 1: Command Line

```bash
# See if sessions endpoint works
curl http://localhost:5000/api/sessions

# Should return: { success: true, data: [...] }
```

### Method 2: Browser

```
1. Go to network any BookDetails page
2. Open DevTools (F12)
3. Network tab
4. Refresh page
5. Look for: /api/sessions/[...] requests
6. Check response status (should be 200)
```

### Method 3: Frontend

```
1. Navigate to any book
2. Scroll to "Study Sessions"
3. See if sessions load
4. Try clicking Join button
5. Meets link opens? ✅ Working!
```

---

## ⚠️ Common Setup Issues

### Issue 1: "No token provided" Error

**Cause:** Not logged in
**Fix:**
```
1. Go to http://localhost:5173/login
2. Register or login
3. Try API call again with token
```

### Issue 2: "Date must be in future"

**Cause:** Using past date
**Fix:**
```
# Use future date like:
"date": "2025-12-31T18:00:00Z"  # December 31, 2025

# NOT:
"date": "2020-01-01T00:00:00Z"  # Past date - Error!
```

### Issue 3: Sessions Not Showing on BookDetails

**Cause:** Endpoint not returning data
**Fix:**
```
1. Check backend is running
2. Verify book has sessions created
3. Check browser console for errors
4. Test API: curl http://localhost:5000/api/sessions/[BOOK_ID]
```

### Issue 4: "Not authorized" When Deleting

**Cause:** You didn't create the session
**Fix:**
```
Only the session creator can delete.
Create your own session first, then delete that one.
```

---

## 📊 Understanding Session Status

Sessions have 4 status types:

| Status | Meaning | Button |
|--------|---------|--------|
| 🔵 **Upcoming** | Before session time | Clickable Join |
| 🟢 **Ongoing** | During session time | Clickable Join |
| ⚫ **Completed** | Session ended | Disabled |
| 🔴 **Cancelled** | Session cancelled | Disabled |

---

## 🎨 Session Card Fields

Each session displays:

```
┌─────────────────────────────────┐
│ Advanced Reading Techniques 🔵  │ ← Status badge
├─────────────────────────────────┤
│ Feb 15, 2025 at 6:00 PM         │ ← Date/Time
│ Led by: Sarah Chen              │ ← Creator
│ 5 people attending              │ ← Attendee count
├─────────────────────────────────┤
│ Let's discuss chapters 5-8...   │ ← Description
│                                 │
│     [🎥 Join Session]           │ ← Button
└─────────────────────────────────┘
```

---

## 🔄 Data Flow Diagram

```
User Creates Session
        ↓
POST /api/sessions
        ↓
Backend validates (future date, URL, etc.)
        ↓
MongoDB saves Session
        ↓

User Views BookDetails
        ↓
Frontend fetch /api/sessions/:bookId
        ↓
Backend queries MongoDB
        ↓
Returns array of sessions
        ↓
Frontend renders session cards
        ↓

User clicks "Join Session"
        ↓
window.open(meetLink)
        ↓
Google Meet opens in new tab
```

---

## 🚀 Next Steps

1. **Test It**
   - Create a session
   - View on BookDetails
   - Click Join button
   - See if Meet opens

2. **Build UI**
   - Create form for users to make sessions
   - Add session creation modal
   - Handle form validation

3. **Enhance Features**
   - Session notes/chat
   - Session recordings
   - Session RSVP
   - Email reminders

4. **Deploy**
   - Move to production
   - Set up MongoDB Atlas
   - Deploy frontend to Vercel
   - Deploy backend to Heroku/Railway

---

## 📚 Full Documentation

For complete API details, see: [SESSION_SYSTEM_GUIDE.md](SESSION_SYSTEM_GUIDE.md)

For testing procedures, see: [SESSION_TESTING_GUIDE.md](SESSION_TESTING_GUIDE.md)

---

## ✨ That's It!

You now have a working study session system. Sessions are created, displayed, and users can join them with one click.

**What's working:**
- ✅ Create sessions
- ✅ View sessions for books
- ✅ Join sessions (opens meet link)
- ✅ Leave sessions
- ✅ Delete sessions (creator only)
- ✅ Update session status

**Have fun building! 🎉**
