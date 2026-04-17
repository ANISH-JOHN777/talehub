# Backend Architecture & Structure

Complete guide to the LearnTales backend MVC architecture.

## 📁 Backend Project Structure

```
backend/
├── models/
│   └── Book.js              # Mongoose schema and model
├── controllers/
│   └── bookController.js    # Business logic for books
├── routes/
│   └── bookRoutes.js        # Express routes
├── server.js                # Main server file
├── package.json             # Dependencies
├── .env                     # Environment variables
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── API_DOCUMENTATION.md     # API docs
├── TESTING_GUIDE.md         # Testing guide
├── README.md                # Backend readme
└── node_modules/            # Dependencies (created after npm install)
```

---

## 🏗️ Architecture Pattern: MVC

The backend follows the **Model-View-Controller** pattern:

```
Request
   ↓
Routes (bookRoutes.js)
   ↓
Controllers (bookController.js)
   ↓
Models (Book.js)
   ↓
MongoDB (Database)
   ↓
Response
```

### 1️⃣ Models (`/models/Book.js`)

**Purpose:** Define data structure and validation

**Responsibilities:**
- Define MongoDB schema
- Set field validation rules
- Create database model
- Handle data types and constraints

**Key Features:**
```javascript
{
  title: String (required, max 100),
  author: String (required, max 50),
  description: String (required, max 1000),
  category: Enum (with specific values),
  rating: Number (0-5),
  reviews: Number,
  pages: Number,
  publishedYear: Number,
  coverImage: String,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

### 2️⃣ Controllers (`/controllers/bookController.js`)

**Purpose:** Handle business logic and API response

**Responsibilities:**
- Process incoming requests
- Validate data
- Interact with models
- Prepare responses
- Handle errors

**Functions:**
```javascript
exports.createBook()        // POST - create new book
exports.getAllBooks()       // GET - fetch all books (with filters)
exports.getBookById()       // GET - fetch single book
exports.updateBook()        // PUT - update a book
exports.deleteBook()        // DELETE - remove a book
exports.getBooksByCategory()// GET - filter by category
exports.searchBooks()       // GET - search functionality
exports.getBookStats()      // GET - statistics aggregation
```

**Example Controller Function:**
```javascript
exports.createBook = async (req, res) => {
  try {
    // 1. Extract data from request
    const { title, author, description } = req.body
    
    // 2. Validate data
    if (!title || !author || !description) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      })
    }
    
    // 3. Create in database
    const book = await Book.create({
      title,
      author,
      description
    })
    
    // 4. Send response
    res.status(201).json({
      success: true,
      data: book
    })
  } catch (error) {
    // 5. Handle errors
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
}
```

---

### 3️⃣ Routes (`/routes/bookRoutes.js`)

**Purpose:** Define API endpoints and connect to controllers

**Responsibilities:**
- Map HTTP methods to URLs
- Connect routes to controller functions
- Handle route parameters
- Organize API structure

**Route Definitions:**
```javascript
router.post('/', createBook)                    // POST /api/books
router.get('/', getAllBooks)                    // GET /api/books
router.get('/stats/overview', getBookStats)     // GET /api/books/stats/overview
router.get('/search/:query', searchBooks)       // GET /api/books/search/:query
router.get('/category/:category', getBooksByCategory) // GET /api/books/category/:category
router.get('/:id', getBookById)                 // GET /api/books/:id
router.put('/:id', updateBook)                  // PUT /api/books/:id
router.delete('/:id', deleteBook)               // DELETE /api/books/:id
```

**Key Points:**
- Routes are modular and reusable
- Each route calls a controller function
- Routes file only handles routing - no business logic
- Clean separation of concerns

---

### 4️⃣ Server (`server.js`)

**Purpose:** Initialize Express, connect to MongoDB, register routes

**Responsibilities:**
- Load environment variables
- Initialize Express app
- Connect middleware
- Configure MongoDB connection
- Register routes
- Handle errors and 404s

**Structure:**
```javascript
require('dotenv').config()              // Load .env
const express = require('express')      // Import Express
const mongoose = require('mongoose')    // Import MongoDB
const bookRoutes = require('./routes/bookRoutes')

const app = express()

// 1. Middleware
app.use(cors())                         // CORS support
app.use(express.json())                 // JSON parsing

// 2. MongoDB Connection
mongoose.connect(mongoURI, {...})

// 3. Routes
app.get('/', ...)                       // Welcome endpoint
app.get('/health', ...)                 // Health check
app.use('/api/books', bookRoutes)       // Book routes

// 4. Error handling
app.use(notFoundHandler)
app.use(errorHandler)

// 5. Start server
app.listen(PORT, ...)
```

---

## 🔄 Request Flow Example

**Scenario:** `POST /api/books` (Create a book)

```
1. CLIENT REQUEST
   POST /api/books
   {
     "title": "Atomic Habits",
     "author": "James Clear",
     "description": "..."
   }
   ↓

2. EXPRESS MIDDLEWARE
   - CORS check
   - Parse JSON body
   - ↓

3. ROUTES (routes/bookRoutes.js)
   - Matches POST /api/books
   - Routes to bookController.createBook()
   - ↓

4. CONTROLLER (controllers/bookController.js)
   - Validates input data
   - Calls Book.create()
   - ↓

5. MODEL (models/Book.js)
   - Validates against schema
   - Assigns validation rules
   - Interacts with MongoDB
   - ↓

6. DATABASE (MongoDB)
   - Saves document
   - Returns saved object
   - ↓

7. RESPONSE
   {
     "success": true,
     "message": "Book created successfully",
     "data": {
       "_id": "507f...",
       "title": "Atomic Habits",
       ...
     }
   }
```

---

## 🔑 Key Concepts

### Async/Await
All database operations are asynchronous:
```javascript
const book = await Book.create(data)
const books = await Book.find()
const book = await Book.findById(id)
```

### Error Handling
Try-catch blocks for each operation:
```javascript
try {
  const book = await Book.create(data)
  res.json({ success: true, data: book })
} catch (error) {
  res.status(400).json({ success: false, error: error.message })
}
```

### Validation
- Mongoose schema validation
- Controller input validation
- Error responses with messages

### Middleware
- CORS for cross-origin requests
- JSON body parsing
- Custom error handling

---

## 🚀 File Responsibilities

### models/Book.js
- ✅ Define schema structure
- ✅ Set validation rules
- ✅ Create Mongoose model
- ❌ Handle HTTP logic
- ❌ Business logic

### controllers/bookController.js
- ✅ Handle HTTP requests
- ✅ Business logic
- ✅ Validation
- ✅ Response formatting
- ❌ Define routes
- ❌ Database schema

### routes/bookRoutes.js
- ✅ Map URLs to controllers
- ✅ Define endpoints
- ✅ Route parameters
- ❌ Business logic
- ❌ Database operations
- ❌ HTTP responses

### server.js
- ✅ Initialize app
- ✅ Connect database
- ✅ Register middleware
- ✅ Mount routes
- ❌ Business logic
- ❌ Route definitions

---

## 📝 Adding a New Feature

### Example: Add "ISBN" field to Book

**Step 1: Update Model**
```javascript
// models/Book.js
const bookSchema = new mongoose.Schema({
  // ... existing fields
  isbn: {
    type: String,
    unique: true,
    sparse: true
  }
})
```

**Step 2: Update Controller**
```javascript
// controllers/bookController.js
exports.createBook = async (req, res) => {
  try {
    const { title, author, description, isbn } = req.body
    const book = await Book.create({
      title,
      author,
      description,
      isbn  // Add new field
    })
    res.status(201).json({ success: true, data: book })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
}
```

**Step 3: Routes** (No change needed!)

**Step 4: API Documentation** (Update API_DOCUMENTATION.md)

---

## 🐛 Common Issues & Solutions

### Issue: Routes not found (404)
**Solution:** Check route is registered in server.js
```javascript
app.use('/api/books', bookRoutes)
```

### Issue: Validation errors
**Solution:** Check Mongoose schema constraints and controller validation

### Issue: Database not saving
**Solution:** Ensure MongoDB is running and connected
```bash
✅ MongoDB connected successfully  // Check for this in logs
```

### Issue: Async/await errors
**Solution:** All database operations must use await and be in async functions

### Issue: CORS errors
**Solution:** CORS middleware is already configured:
```javascript
app.use(cors())
```

---

## 🔐 Security Best Practices

### Currently Implemented:
- ✅ Input validation
- ✅ CORS support
- ✅ Error handling
- ✅ Mongoose injection protection

### Should Add (Future):
- ⚠️ JWT Authentication
- ⚠️ Rate limiting
- ⚠️ Request logging
- ⚠️ HTTPS
- ⚠️ Input sanitization
- ⚠️ Request body size limit

---

## 📚 Quick Reference

| File | Purpose | Key Exports |
|------|---------|-------------|
| models/Book.js | Schema definition | Book model |
| controllers/bookController.js | Business logic | Controller functions |
| routes/bookRoutes.js | Route mapping | Router object |
| server.js | App initialization | Express app |

---

## 🧪 Testing Architecture

```
Unit Tests
├── Model tests (validation)
└── Controller tests (logic)

Integration Tests
├── Route tests
└── Database tests

E2E Tests
└── Full API workflow
```

---

## 🔗 Integration with Frontend

Frontend will call APIs:
```javascript
// React component
fetch('/api/books')
  .then(res => res.json())
  .then(data => setBooks(data.data))
```

Backend provides:
```javascript
{
  "success": true,
  "count": 5,
  "data": [...]  // Books array
}
```

---

## 📖 Further Reading

- Mongoose Documentation: https://mongoosejs.com/
- Express.js Guide: https://expressjs.com/
- REST API Best Practices: https://restfulapi.net/
- Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices

---

**Backend Development Complete! 🚀**

Next steps:
1. Test all endpoints (see TESTING_GUIDE.md)
2. Integrate with frontend
3. Add authentication
4. Deploy to production
