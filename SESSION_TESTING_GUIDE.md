# Session System - Testing Guide

## 🧪 Pre-Testing Checklist

- [ ] Backend server running on port 5000
- [ ] MongoDB connected and running
- [ ] Frontend running on port 5173
- [ ] At least one book exists in database
- [ ] User is logged in with valid JWT token

---

## 📝 Manual Testing Steps

### Test 1: Create a Test User

**Step 1.1:** Register/login to get JWT token
```
Navigate to: http://localhost:5173/login
- Click "Don't have account?"
- Register with email & password
- Login to get token
- Copy token from localStorage
```

**Expected Result:**
- ✅ User created
- ✅ JWT token stored in browser
- ✅ Redirected to dashboard

---

### Test 2: Verify Book Exists

**Step 2.1:** Check if books are loaded
```bash
curl http://localhost:5000/api/books
```

**Expected Result:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "BOOK_ID_HERE",
      "title": "Sample Book",
      ...
    }
  ]
}
```

**If no books exist:**
```bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "description": "A classic American novel",
    "category": "Fiction",
    "pages": 180,
    "publishedYear": 1925,
    "coverImage": "https://via.placeholder.com/300x400"
  }'
```

---

### Test 3: Create Session via API

**Step 3.1:** Create new session
```bash
TOKEN="your_jwt_token_here"
BOOK_ID="book_id_from_step_2"

curl -X POST http://localhost:5000/api/sessions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Chapter 1-3 Discussion",
    "date": "2025-02-20T18:00:00Z",
    "meetLink": "https://meet.google.com/abc-defg-hij",
    "bookId": "'$BOOK_ID'",
    "description": "Let us discuss the opening chapters"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "SESSION_ID",
    "title": "Chapter 1-3 Discussion",
    "date": "2025-02-20T18:00:00Z",
    "meetLink": "https://meet.google.com/abc-defg-hij",
    "status": "upcoming",
    "attendees": [
      "YOUR_USER_ID"
    ],
    "createdBy": {
      "_id": "YOUR_USER_ID",
      "name": "Your Name"
    }
  }
}
```

**Error Cases to Test:**
```bash
# Past date (should fail)
curl -X POST http://localhost:5000/api/sessions \
  -d '{"date": "2020-01-01T00:00:00Z", ...}'
# Expected: 400 "Date must be in future"

# Invalid URL (should fail)
curl -X POST http://localhost:5000/api/sessions \
  -d '{"meetLink": "not-a-url", ...}'
# Expected: 400 "Invalid URL"

# Missing authentication
curl -X POST http://localhost:5000/api/sessions \
  -d '{...}'
# Expected: 401 "No token provided"
```

---

### Test 4: Fetch Sessions via API

**Step 4.1:** Get all sessions for a book
```bash
curl http://localhost:5000/api/sessions/$BOOK_ID
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "SESSION_ID",
      "title": "Chapter 1-3 Discussion",
      "date": "2025-02-20T18:00:00Z",
      "meetLink": "https://meet.google.com/...",
      "status": "upcoming",
      "attendees": ["USER_ID"],
      "description": "..."
    }
  ],
  "count": 1
}
```

**Step 4.2:** Get ALL sessions across platform
```bash
curl http://localhost:5000/api/sessions
```

**Expected:** Returns all sessions sorted by date

---

### Test 5: Join Session via API

**Step 5.1:** Join a session
```bash
curl -X POST http://localhost:5000/api/sessions/$SESSION_ID/join \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Successfully joined session",
    "totalAttendees": 2
  }
}
```

**Error Cases:**
```bash
# Already in attendees (should fail)
# Expected: 400 "Already attending this session"

# Session not found
curl -X POST http://localhost:5000/api/sessions/invalid_id/join
# Expected: 404 "Session not found"

# Without token
curl -X POST http://localhost:5000/api/sessions/$SESSION_ID/join
# Expected: 401 "No token provided"
```

---

### Test 6: Leave Session via API

**Step 6.1:** Leave the session
```bash
curl -X POST http://localhost:5000/api/sessions/$SESSION_ID/leave \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Successfully left session",
    "totalAttendees": 1
  }
}
```

---

### Test 7: Frontend - View Sessions in BookDetails

**Step 7.1:** Navigate to book details page
```
1. Go to http://localhost:5173/dashboard
2. Click on a book card
3. OR go to http://localhost:5173/books/BOOK_ID
```

**Expected Result:**
- ✅ Page loads book details
- ✅ "Study Sessions" section visible
- ✅ Sessions list shows with cards
- ✅ Each card shows: title, date, status, attendee count

**Step 7.2:** Click "Join Session" button
```
1. Scroll to Study Sessions section
2. Click "🎥 Join Session" on any upcoming session
3. Google Meet link opens in new tab
```

**Expected Result:**
- ✅ New browser tab opens
- ✅ Redirects to Google Meet URL
- ✅ Button changes to disabled state if session is past

---

### Test 8: Update Session Status

**Step 8.1:** Update status (creator only)
```bash
curl -X PUT http://localhost:5000/api/sessions/$SESSION_ID/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "ongoing"}'
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "SESSION_ID",
    "status": "ongoing",
    ...
  }
}
```

**Valid Status Values:**
- `upcoming` - Before session date
- `ongoing` - During session
- `completed` - After session ends
- `cancelled` - Session cancelled

**Error Cases:**
```bash
# Non-creator trying to update
# Expected: 403 "Not authorized to update session"

# Invalid status value
curl ... -d '{"status": "invalid"}'
# Expected: 400 "Invalid status"
```

---

### Test 9: Delete Session

**Step 9.1:** Delete session (creator only)
```bash
curl -X DELETE http://localhost:5000/api/sessions/$SESSION_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Session deleted successfully"
  }
}
```

**Error Cases:**
```bash
# Non-creator trying to delete
# Expected: 403 "Not authorized to delete session"

# Session not found
curl -X DELETE http://localhost:5000/api/sessions/invalid_id
# Expected: 404 "Session not found"
```

---

## 🎨 Frontend UI Testing

### Test 10: Session Display States

**Case 1: Loading State**
```
When BookDetails first loads:
- Should show "Loading sessions..."
- Should not show session cards yet
- Should complete within 2 seconds
```

**Case 2: Empty State**
```
When book has no sessions:
- Should show "📭 No sessions yet"
- Should show message encouraging to create
- Should not show any cards
```

**Case 3: Session Cards**
```
When sessions exist:
- Each card should show all info
- Status badge colored correctly
- Attendee count visible
- Join button enabled/disabled appropriately
```

### Test 11: Session Status Badges

| Status | Color | Appearance |
|--------|-------|------------|
| Upcoming | Blue | `bg-blue-500` |
| Ongoing | Green | `bg-green-500` |
| Completed | Gray | `bg-gray-500` |
| Cancelled | Red | `bg-red-500` |

**Test:**
```
1. Create sessions with different statuses
2. View in BookDetails
3. Verify badge colors match table above
```

### Test 12: Join Button States

**Upcoming Session:**
```
- Button enabled (clickable)
- Shows "🎥 Join Session"
- onClick opens meetLink
```

**Past Session:**
```
- Button disabled (not clickable)
- Shows "Session Ended"
- Gray background (not-allowed cursor)
```

---

## 🔍 Browser Console Debugging

### Check Session State
```javascript
// In browser console on BookDetails page
console.log(sessions)  // See all sessions
console.log(sessionsLoading)  // See loading state
```

### Check Network Requests
```
1. Open DevTools (F12)
2. Go to Network tab
3. Reload BookDetails page
4. Look for /api/sessions/:bookId request
5. Check response status and data
```

### Check Authentication
```javascript
// In browser console
const token = localStorage.getItem('token')
console.log(token)  // Should show JWT token
```

---

## ✅ Comprehensive Test Checklist

| Test | Pass | Notes |
|------|------|-------|
| Create session with future date | [ ] | |
| Create session with past date (fails) | [ ] | |
| Create session without auth (fails) | [ ] | |
| Fetch sessions for book | [ ] | |
| Fetch all platform sessions | [ ] | |
| Join session from API | [ ] | |
| Can't join same session twice | [ ] | |
| Leave session from API | [ ] | |
| View sessions in BookDetails | [ ] | |
| Click Join Session opens link | [ ] | |
| Session list shows correct status | [ ] | |
| Empty state shows when no sessions | [ ] | |
| Loading state shows initially | [ ] | |
| Update session status (creator only) | [ ] | |
| Delete session (creator only) | [ ] | |
| Non-creator can't delete (fails) | [ ] | |
| Session cards responsive on mobile | [ ] | |
| Session cards responsive on desktop | [ ] | |
| Date formatting is readable | [ ] | |
| Attendee count updates | [ ] | |

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "No token provided" error | Login first, verify token in localStorage |
| "Date must be in future" | Use future date that's at least 1 hour away |
| Sessions not showing | Check browser console for fetch errors |
| Meet link not opening | Paste URL directly in browser (test URL) |
| CORS error | Verify backend has CORS enabled |
| 404 on session create | Verify bookId exists in database |
| Button not clickable | Check if session date is in future |

---

## 📊 Performance Testing

### Test Load Times

```bash
# Time session creation
time curl -X POST http://localhost:5000/api/sessions ...

# Time session fetch for book with 100 sessions
time curl http://localhost:5000/api/sessions/$BOOK_ID

# Time get all sessions
time curl http://localhost:5000/api/sessions
```

**Expected Benchmarks:**
- Create session: < 200ms
- Fetch sessions for book: < 500ms
- Get all sessions (1-100 sessions): < 1s

---

## 🧬 Database Verification

### Check Sessions in MongoDB

```bash
# From MongoDB shell
use learntales
db.sessions.find()  # Show all sessions

# Count sessions
db.sessions.countDocuments()

# Find sessions for specific book
db.sessions.find({ bookId: ObjectId("...") })

# Find sessions created by user
db.sessions.find({ createdBy: ObjectId("...") })
```

---

## ✨ Success Criteria

Session system is working correctly when:

✅ Frontend displays sessions from API
✅ Sessions only show for their book
✅ Join button opens meet link
✅ Button disabled for past sessions
✅ Status badges show correct colors
✅ Attendee count is accurate
✅ Loading/empty states work
✅ Error messages are helpful
✅ Responsive design works
✅ All API endpoints return correct format

---

Navigate to [SESSION_SYSTEM_GUIDE.md](SESSION_SYSTEM_GUIDE.md) for full API documentation
