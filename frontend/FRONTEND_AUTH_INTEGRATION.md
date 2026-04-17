# Frontend Authentication Integration Guide

## 📋 Overview

This guide shows you how to integrate the backend JWT authentication system with your React frontend.

## 🗂️ New Frontend Files Created

```
frontend/src/
├── pages/
│   └── LoginPage.jsx ✅ NEW - Login & Register form
├── context/
│   └── AuthContext.jsx ✅ NEW - Auth state management
└── components/
    └── ProtectedRoute.jsx ✅ NEW - Route protection
```

## 🚀 Setup Steps

### 1. Wrap App with AuthProvider

**File: `frontend/src/main.jsx` or `frontend/src/App.jsx`**

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
```

### 2. Update Your Router

**File: `frontend/src/App.jsx`**

Add these imports at the top:

```jsx
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
```

Then wrap your router:

```jsx
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar /> {/* Update navbar to show login/logout buttons */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/books" element={<BookList />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book/:id"
            element={
              <ProtectedRoute>
                <BookDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
```

## 🎯 Using Authentication in Components

### Example 1: Simple Login/Logout Button in Navbar

```jsx
// components/Navbar.jsx
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <nav className="bg-indigo-600 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          📚 LearnTales
        </Link>

        <div className="flex gap-4">
          <Link to="/books">Browse Books</Link>

          {isAuthenticated ? (
            <>
              <span>Welcome, {user?.name}!</span>
              <Link to="/dashboard">Dashboard</Link>
              <button
                onClick={logout}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-white text-indigo-600 px-4 py-2 rounded hover:bg-gray-100"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
```

### Example 2: Dashboard (Protected Page)

```jsx
// pages/Dashboard.jsx
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Welcome, {user?.name}! 👋</h1>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">📧 Email</h3>
            <p className="text-gray-600">{user?.email}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">📚 Books Read</h3>
            <p className="text-2xl font-bold">12</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">⭐ Rating</h3>
            <p className="text-2xl">4.5/5</p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Example 3: Using useAuth Hook

```jsx
// Any component can use authentication
import { useAuth } from '../context/AuthContext'

export default function MyComponent() {
  const { user, isAuthenticated, login, logout, register } = useAuth()

  // Use isAuthenticated to conditionally render
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Hello, {user.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <p>Please log in to continue</p>
          <Link to="/login">Go to Login</Link>
        </div>
      )}
    </div>
  )
}
```

## 📚 AuthContext API

### Properties

```javascript
const {
  // State
  user,              // Current user object { id, name, email }
  token,             // JWT token (string)
  loading,           // Initial load state (boolean)
  isAuthenticated,   // Is user logged in (boolean)

  // Methods
  login,             // (email, password) => Promise
  register,          // (name, email, password, passwordConfirm) => Promise
  logout,            // () => Promise
  getCurrentUser,    // () => Promise<User>
} = useAuth()
```

### Example Usage

```jsx
import { useAuth } from '../context/AuthContext'

export default function LoginForm() {
  const { login } = useAuth()

  const handleLogin = async (email, password) => {
    const result = await login(email, password)
    if (result.success) {
      console.log('Logged in!', result.data)
    } else {
      console.error('Login failed:', result.error)
    }
  }

  return (
    // Form JSX
  )
}
```

## 🔐 Protecting Book Routes

### Option 1: User Must Be Logged In to Create Books

**File: `backend/routes/bookRoutes.js`**

```javascript
const { protect } = require('../middleware/auth')

// Public - anyone can view books
router.get('/', getAllBooks)
router.get('/:id', getBookById)

// Protected - only authenticated users
router.post('/', protect, createBook)
router.put('/:id', protect, updateBook)
router.delete('/:id', protect, deleteBook)
```

### Option 2: Frontend - Only Show Create Button for Logged In Users

**File: `frontend/src/components/BookList.jsx`**

```jsx
import { useAuth } from '../context/AuthContext'

export default function BookList() {
  const { isAuthenticated } = useAuth()

  return (
    <div>
      {isAuthenticated && (
        <button className="bg-indigo-600 text-white px-4 py-2 rounded">
          ➕ Add New Book
        </button>
      )}

      {/* Rest of component */}
    </div>
  )
}
```

## 🛫 Making Authenticated API Calls

### Option 1: Using Fetch with Auth Header

```jsx
const { token } = useAuth()

const response = await fetch('http://localhost:5000/api/books', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // ← Add token here
  },
  body: JSON.stringify({ title: 'New Book', author: '...' })
})
```

### Option 2: Create Auth-Aware Fetch Helper

```javascript
// utils/apiFetch.js
export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`http://localhost:5000${url}`, {
    ...options,
    headers,
  })

  const data = await response.json()

  // Handle 401 - token expired
  if (response.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return data
}

// Usage
const book = await apiFetch('/api/books/create', {
  method: 'POST',
  body: JSON.stringify({ title: 'Book Title' })
})
```

### Option 3: Create Axios Instance with Auth

```javascript
// utils/apiClient.js
import axios from 'axios'

export function createAuthClient() {
  const token = localStorage.getItem('token')

  return axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  })
}

// Usage
const api = createAuthClient()
const { data } = await api.post('/api/books', { title: 'New Book' })
```

## ✅ Step-by-Step Integration Checklist

- [ ] AuthProvider wraps entire app
- [ ] LoginPage created and routed to `/login`
- [ ] ProtectedRoute component implemented
- [ ] Navbar shows login/logout buttons
- [ ] useAuth hook working in components
- [ ] Dashboard page redirects if not authenticated
- [ ] Authorization headers included in API calls
- [ ] 401 errors handled (redirect to login)
- [ ] Book creation requires authentication
- [ ] User profile shows in navbar

## 🧪 Testing Authentication Flow

### Test 1: Register New User

```
1. Navigate to http://localhost:3000/login
2. Click "Register"
3. Fill in form and submit
4. Should redirect to dashboard
5. Check localStorage has token and user
```

### Test 2: Login with Existing User

```
1. Logout from dashboard
2. Navigate to /login
3. Enter credentials
4. Should redirect to dashboard
5. Navbar should show welcome message
```

### Test 3: Protected Route Redirect

```
1. Open DevTools → Application → Storage → Clear All
2. Try to navigate to /dashboard
3. Should redirect to /login
```

### Test 4: Token Expiration (Advanced)

```
1. Wait 7 days (set JWT_EXPIRE to 5s for testing)
2. Make API request
3. Should return 401
4. Should redirect to login
```

## 🐛 Common Issues

### Issue: Token not included in requests

**Solution:** Make sure Authorization header is set before API call:

```javascript
// ✅ Correct
const response = await fetch(url, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

// ❌ Wrong - missing "Bearer "
const response = await fetch(url, {
  headers: {
    'Authorization': token
  }
})
```

### Issue: Redirect loop on login

**Solution:** Make sure ProtectedRoute checks loading state:

```jsx
// ✅ Correct - waits for loading
if (loading) return <Spinner />
if (!isAuthenticated) return <Navigate to="/login" />

// ❌ Wrong - no loading check
```

### Issue: User data not persist on refresh

**Solution:** Make sure AuthProvider initializes from localStorage:

```jsx
// ✅ Correct - restores from storage
useEffect(() => {
  const token = localStorage.getItem('token')
  if (token) setToken(token)
}, [])

// ❌ Wrong - never checked storage
```

## 📖 Full Integration Example

**File: `frontend/src/App.jsx`**

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import BookList from './components/BookList'
import LandingPage from './pages/LandingPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/books" element={<BookList />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
```

## 🎯 Next Steps

1. ✅ Implement AuthProvider and Context
2. ✅ Create LoginPage component
3. ✅ Update App.jsx with routes
4. ✅ Update Navbar with login button
5. ✅ Test entire flow
6. ⏳ Add protected book routes
7. ⏳ Create user profile page
8. ⏳ Add password reset feature
9. ⏳ Add email verification

You're all set for frontend authentication! 🎉
