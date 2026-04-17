# Session System - Complete Implementation Guide

## 📋 Overview

The Session System allows users to schedule and join study sessions for books. Each session includes a meeting link, description, and track attendees.

## 🏗️ Architecture

```
User creates session
    ↓
POST /api/sessions
    ↓
Backend validates data
    ↓
Create Session document
    ↓
User joins by clicking "Join Session"
    ↓
GET /api/sessions/:bookId
    ↓
Show all sessions in BookDetails
    ↓
Click button opens meet link
```

## 📊 Database Schema

### Session Model

```javascript
{
  title: String (required, 3-100 chars),
  date: Date (required, must be future),
  meetLink: String (required, valid URL),
  bookId: ObjectId reference to Book (required),
  createdBy: ObjectId reference to User (required),
  attendees: [ObjectId references to Users],
  description: String (optional, max 500 chars),
  status: enum ['upcoming', 'ongoing', 'completed', 'cancelled'],
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🔌 Backend API Endpoints

### 1. **POST /api/sessions** - Create Session

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "title": "Advanced Reading Techniques",
  "date": "2025-02-15T18:00:00Z",
  "meetLink": "https://meet.google.com/abc-defg-hij",
  "bookId": "607f1f77bcf86cd799439011",
  "description": "Let's discuss chapters 5-8 together"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "607f1f77bcf86cd799439020",
    "title": "Advanced Reading Techniques",
    "date": "2025-02-15T18:00:00Z",
    "meetLink": "https://meet.google.com/abc-defg-hij",
    "bookId": { "_id": "607f1f77bcf86cd799439011", "title": "Book Title" },
    "createdBy": { "_id": "507f1f77bcf86cd799439011", "name": "John" },
    "attendees": ["507f1f77bcf86cd799439011"],
    "description": "Let's discuss chapters 5-8 together",
    "status": "upcoming",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "Session date must be in the future"
}
```

---

### 2. **GET /api/sessions** - Get All Sessions

**Authentication:** Not required

**Request:**
```bash
curl http://localhost:5000/api/sessions
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "607f1f77bcf86cd799439020",
      "title": "Advanced Reading",
      "date": "2025-02-15T18:00:00Z",
      "status": "upcoming",
      "attendees": ["507f1f77bcf86cd799439011"],
      "createdBy": { "name": "John" }
    }
  ],
  "count": 1
}
```

---

### 3. **GET /api/sessions/:bookId** - Get Sessions for Book

**Authentication:** Not required

**Request:**
```bash
curl http://localhost:5000/api/sessions/607f1f77bcf86cd799439011
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "607f1f77bcf86cd799439020",
      "title": "Discussion Session",
      "date": "2025-02-15T18:00:00Z",
      "meetLink": "https://meet.google.com/...",
      "status": "upcoming",
      "attendees": ["507f1f77bcf86cd799439011"],
      "description": "Chapter discussion"
    }
  ],
  "count": 1
}
```

---

### 4. **POST /api/sessions/:sessionId/join** - Join Session

**Authentication:** Required (Bearer token)

**Request:**
```bash
curl -X POST http://localhost:5000/api/sessions/607f1f77bcf86cd799439020/join \
  -H "Authorization: Bearer {token}"
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Successfully joined session",
    "session": { /* full session data */ },
    "totalAttendees": 3
  }
}
```

---

### 5. **POST /api/sessions/:sessionId/leave** - Leave Session

**Authentication:** Required (Bearer token)

**Request:**
```bash
curl -X POST http://localhost:5000/api/sessions/607f1f77bcf86cd799439020/leave \
  -H "Authorization: Bearer {token}"
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Successfully left session",
    "totalAttendees": 2
  }
}
```

---

### 6. **DELETE /api/sessions/:sessionId** - Delete Session

**Authentication:** Required (Bearer token, creator only)

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/sessions/607f1f77bcf86cd799439020 \
  -H "Authorization: Bearer {token}"
```

**Response (200):**
```json
{
  "success": true,
  "data": { "message": "Session deleted successfully" }
}
```

---

### 7. **PUT /api/sessions/:sessionId/status** - Update Status

**Authentication:** Required (Bearer token, creator only)

**Request:**
```bash
curl -X PUT http://localhost:5000/api/sessions/607f1f77bcf86cd799439020/status \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"status": "ongoing"}'
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* updated session */ }
}
```

---

## 🎨 Frontend Implementation

### BookDetails Component Features

**New State Variables:**
```javascript
const [sessions, setSessions] = useState([])              // Array of sessions
const [sessionsLoading, setSessionsLoading] = useState(false)  // Loading state
const [joiningSessions, setJoiningSessions] = useState({})     // Join button states
```

**New Effect Hook:**
```javascript
useEffect(() => {
  const fetchSessions = async () => {
    const response = await fetch(`http://localhost:5000/api/sessions/${id}`)
    const data = await response.json()
    if (data.success) setSessions(data.data)
  }
  if (id) fetchSessions()
}, [id])
```

**Join Session Function:**
```javascript
const handleJoinSession = (sessionId, meetLink) => {
  window.open(meetLink, '_blank')  // Opens in new tab
}
```

### Session Card Display

Each session shows:
- ✅ Title
- ✅ Date/Time formatted
- ✅ Status badge (upcoming/ongoing/completed/cancelled)
- ✅ Creator name
- ✅ Number of attendees
- ✅ Description (if available)
- ✅ Join button (disabled if session ended)

**Button States:**
```
Upcoming Session: [🎥 Join Session] → Opens meet link
Ended Session:   [Session Ended] → Disabled/Grayed out
```

---

## 📝 Code Examples

### Backend - Session Creation

```javascript
exports.createSession = async (req, res) => {
  const { title, date, meetLink, bookId, description } = req.body
  const createdBy = req.user.id

  // 1. Validate book exists
  const book = await Book.findById(bookId)
  if (!book) return res.status(404).json({ error: 'Book not found' })

  // 2. Validate date is future
  if (new Date(date) <= new Date()) {
    return res.status(400).json({ error: 'Date must be in future' })
  }

  // 3. Create session
  const session = await Session.create({
    title, date, meetLink, bookId, description,
    createdBy,
    attendees: [createdBy]  // Creator joins automatically
  })

  res.status(201).json({ success: true, data: session })
}
```

### Frontend - Fetch Sessions

```jsx
useEffect(() => {
  const fetchSessions = async () => {
    try {
      setSessionsLoading(true)
      const response = await fetch(`http://localhost:5000/api/sessions/${id}`)
      const data = await response.json()
      
      if (data.success) {
        setSessions(data.data)  // Sorted by date
      }
    } finally {
      setSessionsLoading(false)
    }
  }
  
  if (id) fetchSessions()
}, [id])
```

### Frontend - Session Card

```jsx
<button
  onClick={() => handleJoinSession(session._id, session.meetLink)}
  className={`w-full py-3 px-4 rounded-lg font-semibold ${
    isUpcoming
      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
      : 'bg-gray-400 text-white cursor-not-allowed'
  }`}
  disabled={!isUpcoming}
>
  {isUpcoming ? '🎥 Join Session' : 'Session Ended'}
</button>
```

---

## 🧪 Testing

### Test 1: Create Session

```bash
curl -X POST http://localhost:5000/api/sessions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Chapter Discussion",
    "date": "2025-02-15T18:00:00Z",
    "meetLink": "https://meet.google.com/abc-defg-hij",
    "bookId": "607f1f77bcf86cd799439011",
    "description": "Discussion of chapters 5-8"
  }'
```

### Test 2: Get Sessions for Book

```bash
curl http://localhost:5000/api/sessions/607f1f77bcf86cd799439011
```

### Test 3: In Frontend (BookDetails)

```
1. Navigate to book page
2. Scroll down to "Study Sessions" section
3. View all upcoming sessions
4. Click "Join Session" button
5. Opens meet.google.com in new tab
```

---

## 📊 Data Flow

```
BookDetails Component
    ↓
useEffect runs on mount
    ↓
Fetch /api/sessions/:bookId
    ↓
Backend finds all sessions for book
    ↓
Populates user references
    ↓
Returns array sorted by date
    ↓
Frontend displays session cards
    ↓
User clicks "Join Session"
    ↓
window.open(meetLink) → Opens Google Meet
```

---

## 🔒 Security

✅ Create/Update/Delete requires authentication
✅ Only creator can delete sessions
✅ Only creator can update status
✅ Date validation (must be future)
✅ Meet link validated with regex
✅ Error messages don't leak data

---

## 📁 Files Created/Modified

| File | Changes |
|------|---------|
| `backend/models/Session.js` | NEW - 50 lines |
| `backend/controllers/sessionController.js` | NEW - 200+ lines |
| `backend/routes/sessionRoutes.js` | NEW - 20 lines |
| `backend/server.js` | UPDATED - Added routes |
| `frontend/src/pages/BookDetails.jsx` | UPDATED - Added sessions section |

---

## ✨ Features

✅ Create study sessions
✅ Schedule for future dates
✅ Add Google Meet link
✅ Include session description
✅ Track attendees
✅ View all sessions for a book
✅ Join sessions with one click
✅ Disable past sessions
✅ Status tracking
✅ Responsive design

---

## 🎯 User Flow

```
1. User views book details
2. Scrolls to "Study Sessions" section
3. Sees list of upcoming sessions
4. Each session shows:
   - Title & description
   - Date/time
   - Who's leading it
   - How many people attending
5. Clicks "🎥 Join Session"
6. Opens Google Meet in new tab
7. Joins video call
8. Can discuss book with others
```

---

## 🚀 Deployment

1. ✅ Session routes mounted in server.js
2. ✅ Session model created with validation
3. ✅ All CRUD operations implemented
4. ✅ BookDetails showing sessions
5. ✅ Join button opens meet links
6. ✅ Error handling complete
7. ✅ Responsive design

---

## 📚 Next Enhancements

1. **Session Notes** - Add notes during session
2. **Session Recording** - Link to recorded sessions
3. **Session RSVP** - Pre-register for sessions
4. **Notifications** - Email reminders before session
5. **Session History** - View past session discussions
6. **Rating Sessions** - Rate quality of sessions
7. **Auto Status Update** - Change status based on time

---

That's the complete session system! 🎉
