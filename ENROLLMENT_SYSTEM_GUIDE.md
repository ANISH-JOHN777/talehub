# Program Enrollment System - Implementation Guide

## Overview
This document outlines the new **Program Enrollment Customization System** that has been implemented for the TaleHub platform. The system allows users to:
- Customize their session schedule (date, time, count)
- Choose between Human (expert-led) or AI-powered learning
- View book explanation videos
- Provide contact information
- Complete payment
- View enrolled courses with session details and meet links

---

## Frontend Components Created

### 1. **EnrollmentCustomizationPage.jsx** 
**Path:** `frontend/src/pages/EnrollmentCustomizationPage.jsx`

**Features:**
- 5-step wizard interface with progress tracking
- Step 1: Session type selection (Human vs AI) with pricing
- Step 2: Schedule customization (date/time picker for each session)
- Step 3: Video library of book explanations
- Step 4: Contact information collection (phone number)
- Step 5: Order review and summary

**Key Props:**
- Accepts `programId` from URL params
- Navigates to `/payment` with enrollment data

**State Management:**
- Session type, count, dates, times
- Phone number, current pricing
- Active step tracking

---

### 2. **Enhanced PaymentPage.jsx**
**Path:** `frontend/src/pages/PaymentPage.jsx`

**Features:**
- Updated to handle enrollment payments (not just bookings)
- Validates card details (16-digit number, MM/YY expiry, CVV)
- Simulated payment processing with 1.5s delay
- Creates enrollment record after payment
- Shows transaction ID and success confirmation
- Auto-redirects to dashboard after payment

**Enrollment Data Processing:**
- Receives enrollment data from URL state or sessionStorage
- Creates enrollment with customized sessions
- Stores payment transaction details
- Clears pending enrollment data after success

---

### 3. **EnrolledCoursesPage.jsx**
**Path:** `frontend/src/pages/EnrolledCoursesPage.jsx`

**Features:**
- Displays all user's enrolled programs
- Shows upcoming next session with join button
- Progress tracking (percentage complete, sessions attended)
- Session details modal with all scheduled sessions
- Generates unique Google Meet links for each session
- Quick stats sidebar (total courses, sessions, attended)
- Enrollment success notification

**Session Details Include:**
- Date and time of each session
- One-click join button for Google Meet
- Full session list with timestamps

---

### 4. **Updated ProgramDetailPage.jsx**
**Changes:**
- Modified `handleEnroll()` to navigate to `/enroll/{programId}` instead of direct enrollment
- Users now go through the customization flow before payment

---

## Routes Added

### New Routes in `App.jsx`

```javascript
// Enrollment Flow (Protected)
<Route path="/enroll/:id" element={<ProtectedRoute><EnrollmentCustomizationPage /></ProtectedRoute>} />
<Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />

// Enrolled Courses (Protected)
<Route path="/my-courses" element={<ProtectedRoute><EnrolledCoursesPage /></ProtectedRoute>} />
<Route path="/enrolled-courses" element={<ProtectedRoute><EnrolledCoursesPage /></ProtectedRoute>} />
```

### Navigation Updates
- Added "My Courses" link in navbar (visible when logged in)
- Points to `/my-courses` to view enrolled programs

---

## Backend Updates Required

### 1. **Update Enrollment Model** (`backend/models/Enrollment.js`)

Add these fields to track customized sessions:

```javascript
const enrollmentSchema = new mongoose.Schema({
  // ... existing fields ...
  
  // NEW FIELDS
  sessionType: {
    type: String,
    enum: ['human', 'ai'],
    required: true,
  },
  sessionCount: {
    type: Number,
    required: true,
  },
  customizedSessions: [
    {
      date: String,      // YYYY-MM-DD format
      time: String,      // HH:MM format
      status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled',
      },
      meetLink: String,  // Google Meet link
      recordingLink: String,
      attendees: [String], // User IDs who attended
    }
  ],
  phoneNumber: {
    type: String,
    required: true,
  },
})
```

### 2. **Update Enrollment Controller** (`backend/controllers/enrollmentController.js`)

**Create Enrollment Endpoint** - `POST /api/enrollments`

```javascript
exports.createEnrollment = async (req, res) => {
  try {
    const { 
      programId, 
      sessionType, 
      sessionCount, 
      customizedSessions, 
      phoneNumber, 
      price,
      tier,
      paymentDetails 
    } = req.body

    // Validate required fields
    if (!programId || !sessionType || !sessionCount || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      })
    }

    // Generate meet links for each session
    const sessionsWithLinks = customizedSessions.map(session => ({
      ...session,
      meetLink: `https://meet.google.com/${generateMeetCode()}`,
      status: 'scheduled'
    }))

    // Create enrollment
    const enrollment = new Enrollment({
      user: req.user._id,
      program: programId,
      tier: tier || 'Pro',
      price: price,
      sessionType,
      sessionCount,
      customizedSessions: sessionsWithLinks,
      phoneNumber,
      paymentDetails: {
        ...paymentDetails,
        paidAt: new Date()
      }
    })

    await enrollment.save()
    
    // Populate program details
    await enrollment.populate('program')

    res.status(201).json({
      success: true,
      data: enrollment
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
```

**Get User Enrollments** - `GET /api/enrollments/user`

```javascript
exports.getUserEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate('program')
      .sort({ enrolledAt: -1 })

    res.json({
      success: true,
      data: enrollments
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
```

### 3. **Update Enrollment Routes** (`backend/routes/enrollmentRoutes.js`)

```javascript
router.post('/', auth, enrollmentController.createEnrollment)
router.get('/user', auth, enrollmentController.getUserEnrollments)
router.get('/:id', auth, enrollmentController.getEnrollment)
router.put('/:id', auth, enrollmentController.updateEnrollment)
```

### 4. **Helper Function - Generate Meet Code**

```javascript
function generateMeetCode() {
  // Generate a unique Google Meet-like code
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let code = ''
  for (let i = 0; i < 10; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}
```

### 5. **Create Session Management Endpoint** (Optional but recommended)

```javascript
// Mark session as completed
PUT /api/enrollments/:enrollmentId/sessions/:sessionIndex/complete

// Update attendance
PUT /api/enrollments/:enrollmentId/sessions/:sessionIndex/attendance
```

---

## Data Flow

### Enrollment Creation Flow

```
User → Browse Programs
  ↓
Clicks "Enroll" on Program
  ↓
Navigate to /enroll/{programId}
  ↓
EnrollmentCustomizationPage
  ├─ Step 1: Select Human/AI
  ├─ Step 2: Schedule sessions
  ├─ Step 3: Watch videos
  ├─ Step 4: Enter phone
  └─ Step 5: Review & Confirm
  ↓
Navigate to /payment with enrollment data
  ↓
PaymentPage
  ├─ Collect card details
  ├─ Validate card
  └─ Process payment (simulated)
  ↓
POST /api/enrollments (Create enrollment in DB)
  ↓
Success → Redirect to /my-courses
  ↓
EnrolledCoursesPage (shows all enrolled programs)
```

### Session Joining Flow

```
User on EnrolledCoursesPage
  ↓
Click "Join" on upcoming session
  ↓
Open Google Meet link (generateMeetLink function)
  ↓
Attend session
  ↓
POST /api/enrollments/{id}/sessions/{index}/complete
  ↓
Update progress on dashboard
```

---

## Pricing Configuration

### Current Pricing (in Rupees)

**Human Sessions:**
- Per session: ₹50
- 4 sessions: ₹200
- 8 sessions: ₹400
- 12 sessions: ₹600
- 16 sessions: ₹800

**AI Sessions:**
- Per session: ₹25
- 4 sessions: ₹100
- 8 sessions: ₹200
- 12 sessions: ₹300
- 16 sessions: ₹400

### Customizing Pricing

Update pricing in `EnrollmentCustomizationPage.jsx`:

```javascript
const pricingByType = {
  human: {
    perSession: 50,  // Change this
    description: 'Live expert-led sessions with Q&A',
    color: 'from-purple-500 to-indigo-600',
  },
  ai: {
    perSession: 25,  // Change this
    description: 'AI-powered personalized learning',
    color: 'from-blue-500 to-cyan-500',
  },
}
```

---

## Key Features Implementation Notes

### 1. **Phone Number Reminders**
Currently stores phone number in enrollment. To enable actual SMS reminders:
- Integrate Twilio or similar SMS service
- Create scheduled job to send reminders 24 hours before session
- Add webhook for SMS delivery status

### 2. **Meet Link Generation**
Currently generates dummy links. To use real Google Meet:
- Create a service account for Google Meet API
- Generate authenticated meet links using the service account
- Store actual meet links in database
- Consider using meet.google.com with room codes

### 3. **Session Recording**
To enable video recording:
- Set up recording permission in Google Meet
- Store recording URLs in customizedSessions.recordingLink
- Make recordings available in course dashboard
- Consider storage with Google Cloud Storage or similar

### 4. **Payment Gateway Integration**
Currently simulated. To integrate real payments:
- Set up Stripe or PayPal developer account
- Install Stripe SDK in backend
- Create checkout session
- Handle webhook for payment confirmation
- Update enrollment status based on webhook

---

## Testing Checklist

### Frontend Testing

- [ ] EnrollmentCustomizationPage loads correctly
  - [ ] Step 1: Session type selection works
  - [ ] Step 2: Date/time picker functions
  - [ ] Step 3: Video library displays
  - [ ] Step 4: Phone number validation works
  - [ ] Step 5: Order summary accurate
  
- [ ] PaymentPage
  - [ ] Card validation works
  - [ ] Payment processing succeeds
  - [ ] Success notification shows
  - [ ] Redirects to dashboard

- [ ] EnrolledCoursesPage
  - [ ] Displays all enrollments
  - [ ] Upcoming session shows correctly
  - [ ] Session details modal opens
  - [ ] Join button works

### Backend Testing

- [ ] POST /api/enrollments
  - [ ] Creates enrollment with correct data
  - [ ] Generates meet links
  - [ ] Updates user enrollments

- [ ] GET /api/enrollments/user
  - [ ] Returns user's enrollments
  - [ ] Populates program details
  - [ ] Sorted correctly

- [ ] Database
  - [ ] Enrollment documents store customized sessions
  - [ ] Phone numbers saved correctly
  - [ ] Payment details persisted

---

## Test Card for Payment Page

```
Card Number: 4111 1111 1111 1111
Expiry: 12/25
CVV: 123
Cardholder Name: Test User
Email: test@example.com
```

---

## Future Enhancements

1. **Session Recording & Playback**
   - Record all sessions automatically
   - Make recordings available for lifetime access
   - Add playback controls and speed options

2. **Interactive Features**
   - Live Q&A during sessions
   - Chat system for participants
   - File sharing and resources

3. **Completion Certificates**
   - Generate PDFs upon completion
   - Email certificates to users
   - Add to LinkedIn

4. **Advanced Analytics**
   - Track attendance rates
   - Monitor engagement metrics
   - Performance recommendations

5. **Rescheduling**
   - Allow users to reschedule sessions
   - Check instructor availability
   - Send notifications

6. **Feedback System**
   - Post-session surveys
   - Instructor ratings
   - Continuous improvement

---

## Support

For issues or questions about implementation:
1. Check that all backend routes are properly defined
2. Verify enrollment model fields match the new schema
3. Ensure authentication middleware is in place
4. Test API endpoints with Postman or similar tool
5. Check browser console for frontend errors

