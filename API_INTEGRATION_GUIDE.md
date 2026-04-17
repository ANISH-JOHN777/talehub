# API Integration Guide

Complete guide for fetching data from backend API in React components.

## 📊 Overview

The updated BookList component now fetches book data from the backend API instead of using hardcoded dummy data.

**Features:**
- ✅ Real-time data from backend
- ✅ Loading skeleton UI
- ✅ Error handling with retry
- ✅ Search functionality
- ✅ Category filtering
- ✅ Automatic emoji assignment

---

## 🚀 Quick Start

### 1. Add Sample Books to Database

First, seed the database with sample books:

```bash
# From project root
cd backend
node seedBooks.js
```

**Expected Output:**
```
Connecting to MongoDB...
✅ Connected to MongoDB
Inserting 10 books...
✅ Successfully inserted 10 books

Inserted Books:
1. Atomic Habits by James Clear
2. The Lean Startup by Eric Ries
... (8 more books)

✅ Database connection closed
```

---

### 2. Start Servers

**Terminal 1 - MongoDB:**
```bash
mongod
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

---

### 3. Visit Books Page

Open browser and navigate to:
```
http://localhost:3000/books
```

You should see:
- ✅ Loading skeleton while fetching
- ✅ Books loaded from API
- ✅ Search bar working
- ✅ Category filters working

---

## 📝 Component Code

### BookList Component with API Integration

```javascript
import { useState, useEffect } from 'react'
import BookCard from './BookCard'

export default function BookList() {
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch books from backend API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        setError(null)

        // Call backend API
        const response = await fetch('/api/books')

        // Check if response is ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        // Check if API returned success
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch books')
        }

        // Extract books from response
        const booksData = data.data || []
        
        // Map MongoDB _id to id for consistency
        const mappedBooks = booksData.map(book => ({
          ...book,
          id: book._id,
          cover: book.cover || getEmojiForCategory(book.category),
        }))

        setBooks(mappedBooks)
        setFilteredBooks(mappedBooks)
      } catch (error) {
        console.error('Error fetching books:', error)
        setError(error.message || 'Failed to load books.')
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  // ... rest of component
}
```

---

## 🎣 Custom Hook: useBooks

For reusable API fetching, use the custom `useBooks` hook:

```javascript
import { useBooks } from '../hooks/useBooks'

export function MyComponent() {
  const { books, loading, error, refetch } = useBooks()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {books.map(book => (
        <div key={book.id}>{book.title}</div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  )
}
```

---

## 🔄 Fetch vs Axios

### Using Fetch (Built-in)
```javascript
const response = await fetch('/api/books')
const data = await response.json()
```

**Pros:** No extra dependency
**Cons:** More verbose error handling

### Using Axios (Alternative)

**Install Axios:**
```bash
npm install axios
```

**Usage:**
```javascript
import axios from 'axios'

const response = await axios.get('/api/books')
const data = response.data
```

**Pros:** Cleaner syntax, better error handling
**Cons:** Extra dependency

---

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Atomic Habits",
      "author": "James Clear",
      "description": "...",
      "category": "Self-Help",
      "rating": 4.8,
      "reviews": 3204,
      "pages": 320,
      "publishedYear": 2018,
      "createdAt": "2024-04-13T...",
      "updatedAt": "2024-04-13T..."
    }
    // ... more books
  ]
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## 🔍 Features Implemented

### 1. **Loading State**
- Skeleton UI while fetching
- 6 placeholder cards animate
- Smooth transition when data loads

### 2. **Error Handling**
- Try-catch for network errors
- API success check
- User-friendly error message
- Retry button

### 3. **Search Functionality**
- Search by title, author, or description
- Case-insensitive matching
- Real-time filtering

### 4. **Category Filtering**
- Dynamic category buttons from API data
- Filter by selected category
- "All" option to show all books

### 5. **Empty State**
- Shows when no books match filters
- Reset button to clear filters
- Helpful message

---

## 🧪 Testing the Integration

### Test 1: Check API Endpoint
```bash
curl http://localhost:5000/api/books
```

**Expected:** Array of books with success: true

### Test 2: Check Frontend Uses API
1. Open DevTools (F12)
2. Go to Network tab
3. Visit http://localhost:3000/books
4. Look for XHR request to `/api/books`
5. Check response shows book data

### Test 3: Test Each Feature
- **Loading:** Page should show skeleton briefly
- **Search:** Type in search bar, books filter
- **Category:** Click category button, books filter
- **Error:** Disconnect backend, refresh page, see error

---

## 🔧 Customization

### Add New Fields to Display

In BookList component, modify the mapping:
```javascript
const mappedBooks = booksData.map(book => ({
  ...book,
  id: book._id,
  cover: book.cover || getEmojiForCategory(book.category),
  customField: book.customField, // Add new field
}))
```

### Change API Endpoint

```javascript
// Use different endpoint
const response = await fetch('/api/books?sort=rating')
const response = await fetch('/api/books?category=Business')
const response = await fetch('/api/books/search/atomic')
```

### Change Loading Duration

The skeleton shows while fetching. To test:
```javascript
// Simulate slow network
await new Promise(resolve => setTimeout(resolve, 2000))
```

---

## ⚠️ Common Issues

### Issue: "ERR_CONNECTION_REFUSED"
**Cause:** Backend not running
**Fix:** Start backend with `npm run dev`

### Issue: "Cannot read property 'data' of undefined"
**Cause:** API response format different
**Fix:** Check API returns `{ success: true, data: [...] }`

### Issue: "Search not working"
**Cause:** Book fields missing
**Fix:** Ensure API returns `title`, `author`, `description`

### Issue: "No books showing"
**Cause:** Database empty
**Fix:** Run `node seedBooks.js` to add sample data

---

## 📈 Performance Tips

### 1. **Pagination** (for large datasets)
```javascript
const response = await fetch('/api/books?page=1&limit=10')
```

### 2. **Caching** (prevent refetch)
```javascript
if (books.length > 0) return // Skip if already loaded
```

### 3. **Debounced Search** (avoid too many requests)
```javascript
const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

const handleSearch = debounce((term) => setSearchTerm(term), 500)
```

---

## 🚀 Next Steps

1. ✅ Seed database with books
2. ✅ Start all servers
3. ✅ Test books page loads from API
4. ✅ Test search and filtering
5. ⬜ Add pagination for large datasets
6. ⬜ Add caching for performance
7. ⬜ Add create/edit/delete books functionality

---

## 📞 Troubleshooting

If books don't load:

1. **Check backend is running**
   ```bash
   curl http://localhost:5000/api/test
   ```

2. **Check database has books**
   ```bash
   node backend/seedBooks.js
   ```

3. **Check network tab in DevTools**
   - F12 → Network
   - Look for `/api/books` request
   - Check response status (200 = success)

4. **Check browser console for errors**
   - F12 → Console
   - Look for fetch errors

5. **Check backend logs**
   - Look at terminal running backend
   - Check for any error messages

---

**API Integration Complete! 🎉**

Books are now fetched in real-time from your backend database.
