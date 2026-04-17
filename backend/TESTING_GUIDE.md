# Backend API Testing Guide

Complete guide for testing the LearnTales Book API with examples.

## 🛠️ Tools for Testing

### Option 1: cURL (Command Line)
```bash
# Built into most systems
curl --version
```

### Option 2: Postman
- Download: https://www.postman.com/downloads/
- Import API endpoints and create a collection

### Option 3: Thunder Client (VS Code)
- Install extension: `Thunder Client`
- Works directly in VS Code

### Option 4: Insomnia
- Download: https://insomnia.rest/download

---

## 🧪 Test Cases

### 1. Check Server Status

**Test:** Verify backend is running

```bash
curl http://localhost:5000/health
```

**Expected Response:** 200 OK
```json
{
  "status": "Server is running",
  "timestamp": "...",
  "uptime": 3600,
  "environment": "development"
}
```

---

### 2. Create a Book (POST)

**Test:** Add a new book to the database

```bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Atomic Habits",
    "author": "James Clear",
    "description": "Transform your life with tiny changes and build better habits.",
    "category": "Self-Help",
    "rating": 4.8,
    "reviews": 3204,
    "pages": 320,
    "publishedYear": 2018
  }'
```

**Expected Response:** 201 Created
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Atomic Habits",
    "author": "James Clear",
    "description": "Transform your life with tiny changes and build better habits.",
    "category": "Self-Help",
    "rating": 4.8,
    "reviews": 3204,
    "pages": 320,
    "publishedYear": 2018,
    "coverImage": null,
    "createdAt": "2024-04-13T10:30:00Z",
    "updatedAt": "2024-04-13T10:30:00Z"
  }
}
```

**Validation Tests:**
- Missing title → 400 Bad Request
- Title > 100 chars → 400 Bad Request
- Invalid category → 400 Bad Request

---

### 3. Create Multiple Books

Add sample books for testing:

**Book 1 - Business:**
```bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Lean Startup",
    "author": "Eric Ries",
    "description": "Build and measure learning.",
    "category": "Business",
    "rating": 4.6,
    "reviews": 2154,
    "pages": 368,
    "publishedYear": 2011
  }'
```

**Book 2 - Technology:**
```bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Innovators",
    "author": "Walter Isaacson",
    "description": "How Steve Jobs, Bill Gates and others shaped digital age.",
    "category": "Technology",
    "rating": 4.4,
    "reviews": 1543,
    "pages": 542,
    "publishedYear": 2014
  }'
```

**Book 3 - Productivity:**
```bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Deep Work",
    "author": "Cal Newport",
    "description": "Rules for focused success in a distracted world.",
    "category": "Productivity",
    "rating": 4.7,
    "reviews": 1876,
    "pages": 296,
    "publishedYear": 2016
  }'
```

---

### 4. Get All Books (GET)

**Test:** Retrieve all books

```bash
curl http://localhost:5000/api/books
```

**Expected Response:** 200 OK
```json
{
  "success": true,
  "count": 3,
  "data": [
    // ... array of all books
  ]
}
```

---

### 5. Get All Books with Filters

**Test:** Get books by category

```bash
# Get all Business books
curl http://localhost:5000/api/books?category=Business

# Get all books sorted by rating (highest first)
curl http://localhost:5000/api/books?sort=rating

# Get Business books sorted by rating
curl http://localhost:5000/api/books?category=Business&sort=rating

# Get newest books
curl http://localhost:5000/api/books?sort=newest

# Get books sorted alphabetically by title
curl http://localhost:5000/api/books?sort=title
```

---

### 6. Get Single Book by ID (GET)

**Test:** Retrieve a specific book

First, copy the `_id` from the previously created book.

```bash
curl http://localhost:5000/api/books/507f1f77bcf86cd799439011
```

**Expected Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Atomic Habits",
    // ... full book data
  }
}
```

**Test Invalid ID:**
```bash
curl http://localhost:5000/api/books/invalid-id
```

**Expected Response:** 500 Internal Server Error
```json
{
  "success": false,
  "error": "Invalid book ID"
}
```

---

### 7. Update a Book (PUT)

**Test:** Modify an existing book

```bash
curl -X PUT http://localhost:5000/api/books/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 4.9,
    "reviews": 5000,
    "title": "Atomic Habits (2nd Edition)"
  }'
```

**Expected Response:** 200 OK
```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Atomic Habits (2nd Edition)",
    "rating": 4.9,
    "reviews": 5000,
    // ... updated book data
  }
}
```

**Validation Tests:**
- Rating > 5 → 400 Bad Request
- Invalid category → 400 Bad Request
- Non-existent ID → 404 Not Found

---

### 8. Delete a Book (DELETE)

**Test:** Remove a book from database

```bash
curl -X DELETE http://localhost:5000/api/books/507f1f77bcf86cd799439011
```

**Expected Response:** 200 OK
```json
{
  "success": true,
  "message": "Book deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    // ... deleted book data
  }
}
```

**Verify Deletion:**
```bash
curl http://localhost:5000/api/books/507f1f77bcf86cd799439011
```

**Expected Response:** 404 Not Found

---

### 9. Get Books by Category

**Test:** Filter books by specific category

```bash
# All available categories test
curl http://localhost:5000/api/books/category/Business
curl http://localhost:5000/api/books/category/Self-Help
curl http://localhost:5000/api/books/category/Technology
curl http://localhost:5000/api/books/category/Fiction
curl http://localhost:5000/api/books/category/History
```

**Expected Response:** 200 OK
```json
{
  "success": true,
  "count": 2,
  "data": [
    // ... books in that category
  ]
}
```

---

### 10. Search Books

**Test:** Search across title, author, and description

```bash
# Search by title
curl http://localhost:5000/api/books/search/Atomic

# Search by author
curl http://localhost:5000/api/books/search/James%20Clear

# Search by partial word
curl http://localhost:5000/api/books/search/habits

# Case-insensitive search
curl http://localhost:5000/api/books/search/atomic
```

**Expected Response:** 200 OK
```json
{
  "success": true,
  "count": 2,
  "data": [
    // ... matching books
  ]
}
```

---

### 11. Get Statistics

**Test:** Retrieve book collection statistics

```bash
curl http://localhost:5000/api/books/stats/overview
```

**Expected Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "totalBooks": 3,
    "averageRating": 4.7,
    "averageReviews": 2544.33,
    "booksByCategory": [
      { "_id": "Business", "count": 1 },
      { "_id": "Self-Help", "count": 1 },
      { "_id": "Technology", "count": 1 }
    ]
  }
}
```

---

## ✅ Postman Collection

If using Postman, here's a quick import format:

```json
{
  "info": {
    "name": "LearnTales API",
    "version": "2.0"
  },
  "item": [
    {
      "name": "Create Book",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/books",
        "body": "raw"
      }
    },
    {
      "name": "Get All Books",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/books"
      }
    }
  ]
}
```

---

## 🔍 Debugging Tips

### Check MongoDB Connection
```bash
# In your backend terminal, look for:
✅ MongoDB connected successfully
```

### Check Server Status
```bash
curl http://localhost:5000/health
```

### Test with Invalid Data
Test validation by sending:
- Empty title: `"title": ""`
- Very long title: `"title": "A".repeat(101)`
- Invalid category: `"category": "InvalidCat"`
- Invalid rating: `"rating": 10`

### View MongoDB Data
Use MongoDB Compass or CLI:
```bash
use learntales
db.books.find()
```

---

## 📊 Test Coverage Checklist

- [ ] Server is running (GET /health)
- [ ] Create book (POST /api/books)
- [ ] Get all books (GET /api/books)
- [ ] Get single book (GET /api/books/:id)
- [ ] Update book (PUT /api/books/:id)
- [ ] Delete book (DELETE /api/books/:id)
- [ ] Filter by category (GET /api/books/category/:category)
- [ ] Search books (GET /api/books/search/:query)
- [ ] Get statistics (GET /api/books/stats/overview)
- [ ] Error handling (invalid ID, missing fields, etc.)
- [ ] Query parameters work (sort, category)
- [ ] Validation errors return correct status codes

---

## 🚨 Common Test Issues

### Issue: "Cannot POST /api/books"
**Solution:** Check server is running with `npm run dev`

### Issue: "MongoDB connection error"
**Solution:** Ensure MongoDB is running and URI is correct in .env

### Issue: "Invalid book ID"
**Solution:** Use actual MongoDB ObjectId format

### Issue: CORS errors from frontend
**Solution:** CORS is already enabled in server.js

### Issue: Request timeout
**Solution:** MongoDB might be slow - check connection

---

## 🎯 Next Steps

Once all tests pass:
1. Integrate with frontend (React)
2. Add authentication (JWT)
3. Add rate limiting
4. Add request logging
5. Deploy to production

---

**Happy Testing! 🧪**
