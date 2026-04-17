# LearnTales Backend API Documentation

Complete API documentation for the LearnTales book management system.

## 📋 Base URL
```
http://localhost:5000
```

## 🌐 Welcome Endpoint

### Get API Info
```
GET /
```

**Response:**
```json
{
  "message": "📚 LearnTales Backend API",
  "version": "2.0",
  "description": "REST API for managing books",
  "endpoints": {
    "books": "/api/books",
    "health": "/health",
    "test": "/api/test"
  }
}
```

---

## 📚 Book Endpoints

### 1. Create a New Book
```
POST /api/books
```

**Request Body:**
```json
{
  "title": "Atomic Habits",
  "author": "James Clear",
  "description": "Transform your life with tiny changes.",
  "category": "Self-Help",
  "rating": 4.8,
  "reviews": 3204,
  "pages": 320,
  "publishedYear": 2018,
  "coverImage": "url-to-image"
}
```

**Required Fields:**
- `title` (string) - Max 100 characters
- `author` (string) - Max 50 characters
- `description` (string) - Max 1000 characters

**Optional Fields:**
- `category` (enum) - Fiction, Non-Fiction, Self-Help, Business, Technology, History, Science, Other
- `rating` (number) - 0-5
- `reviews` (number) - Default: 0
- `pages` (number) - Must be at least 1
- `publishedYear` (number) - Must be valid and not in future
- `coverImage` (string) - URL to cover image

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Atomic Habits",
    "author": "James Clear",
    "description": "Transform your life with tiny changes.",
    "category": "Self-Help",
    "rating": 4.8,
    "reviews": 3204,
    "pages": 320,
    "publishedYear": 2018,
    "coverImage": "url-to-image",
    "createdAt": "2024-04-13T10:30:00Z",
    "updatedAt": "2024-04-13T10:30:00Z",
    "__v": 0
  }
}
```

---

### 2. Get All Books
```
GET /api/books
```

**Query Parameters (Optional):**
- `category` - Filter by category (e.g., `?category=Business`)
- `sort` - Sort results: `rating`, `newest`, `title` (e.g., `?sort=rating`)

**Examples:**
```
GET /api/books
GET /api/books?category=Business
GET /api/books?sort=rating
GET /api/books?category=Business&sort=newest
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Atomic Habits",
      "author": "James Clear",
      "description": "Transform your life with tiny changes.",
      "category": "Self-Help",
      "rating": 4.8,
      "reviews": 3204,
      "pages": 320,
      "publishedYear": 2018,
      "coverImage": null,
      "createdAt": "2024-04-13T10:30:00Z",
      "updatedAt": "2024-04-13T10:30:00Z"
    }
    // ... more books
  ]
}
```

---

### 3. Get Single Book by ID
```
GET /api/books/:id
```

**URL Parameters:**
- `id` - MongoDB ObjectId of the book

**Example:**
```
GET /api/books/507f1f77bcf86cd799439011
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Atomic Habits",
    "author": "James Clear",
    "description": "Transform your life with tiny changes.",
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

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Book not found"
}
```

---

### 4. Update a Book
```
PUT /api/books/:id
```

**URL Parameters:**
- `id` - MongoDB ObjectId of the book

**Request Body (any fields to update):**
```json
{
  "title": "Atomic Habits (Updated)",
  "rating": 4.9,
  "reviews": 3500
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Atomic Habits (Updated)",
    "author": "James Clear",
    "description": "Transform your life with tiny changes.",
    "category": "Self-Help",
    "rating": 4.9,
    "reviews": 3500,
    "pages": 320,
    "publishedYear": 2018,
    "coverImage": null,
    "createdAt": "2024-04-13T10:30:00Z",
    "updatedAt": "2024-04-13T11:00:00Z"
  }
}
```

---

### 5. Delete a Book
```
DELETE /api/books/:id
```

**URL Parameters:**
- `id` - MongoDB ObjectId of the book

**Example:**
```
DELETE /api/books/507f1f77bcf86cd799439011
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Book deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Atomic Habits",
    "author": "James Clear",
    // ... book data
  }
}
```

---

### 6. Get Books by Category
```
GET /api/books/category/:category
```

**URL Parameters:**
- `category` - Book category (Fiction, Non-Fiction, Self-Help, Business, Technology, History, Science, Other)

**Example:**
```
GET /api/books/category/Business
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    // ... books in Business category
  ]
}
```

---

### 7. Search Books
```
GET /api/books/search/:query
```

**URL Parameters:**
- `query` - Search term (searches title, author, and description)

**Example:**
```
GET /api/books/search/Atomic
GET /api/books/search/James Clear
```

**Response (200 OK):**
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

### 8. Get Book Statistics
```
GET /api/books/stats/overview
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalBooks": 25,
    "averageRating": 4.6,
    "averageReviews": 2150,
    "booksByCategory": [
      {
        "_id": "Business",
        "count": 8
      },
      {
        "_id": "Self-Help",
        "count": 5
      },
      {
        "_id": "Technology",
        "count": 7
      }
      // ... more categories
    ]
  }
}
```

---

## 🏥 Health & Test Endpoints

### Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "Server is running",
  "timestamp": "2024-04-13T10:30:00Z",
  "uptime": 3600,
  "environment": "development"
}
```

### Test API
```
GET /api/test
```

**Response:**
```json
{
  "message": "✅ Backend API is running!",
  "timestamp": "2024-04-13T10:30:00Z",
  "status": "Connected",
  "version": "2.0"
}
```

---

## 🔧 Error Handling

All errors follow a consistent format:

**Error Response:**
```json
{
  "success": false,
  "error": "Description of the error"
}
```

### Common Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad Request - Invalid data or missing required fields |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Server-side issue |

### Validation Errors
```json
{
  "success": false,
  "error": "Please provide title, author, and description"
}
```

---

## 📝 cURL Examples

### Create a Book
```bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Lean Startup",
    "author": "Eric Ries",
    "description": "Build products efficiently",
    "category": "Business",
    "rating": 4.6,
    "pages": 368,
    "publishedYear": 2011
  }'
```

### Get All Books
```bash
curl http://localhost:5000/api/books
```

### Get Books by Category
```bash
curl http://localhost:5000/api/books?category=Business&sort=rating
```

### Get Single Book
```bash
curl http://localhost:5000/api/books/507f1f77bcf86cd799439011
```

### Update a Book
```bash
curl -X PUT http://localhost:5000/api/books/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"rating": 4.9}'
```

### Delete a Book
```bash
curl -X DELETE http://localhost:5000/api/books/507f1f77bcf86cd799439011
```

### Search Books
```bash
curl http://localhost:5000/api/books/search/Atomic
```

### Get Statistics
```bash
curl http://localhost:5000/api/books/stats/overview
```

---

## 📦 Book Model Schema

```javascript
{
  title: String (required, max 100),
  author: String (required, max 50),
  description: String (required, max 1000),
  category: String (enum, default: 'Other'),
  rating: Number (0-5, default: 0),
  reviews: Number (default: 0),
  pages: Number (min: 1),
  publishedYear: Number (valid year, not future),
  coverImage: String (URL),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## 🚀 Advanced Use Cases

### 1. Get Highest Rated Books
```
GET /api/books?sort=rating
```

### 2. Get Newest Books
```
GET /api/books?sort=newest
```

### 3. Get Business Books Sorted by Rating
```
GET /api/books?category=Business&sort=rating
```

### 4. Search for Books by Author
```
GET /api/books/search/James%20Clear
```

### 5. Get Book Statistics
```
GET /api/books/stats/overview
```

---

## 🔐 Security Considerations

- ✅ Input validation on all fields
- ✅ MongoDB injection protection (Mongoose)
- ✅ CORS enabled for frontend communication
- ⚠️ Note: No authentication/authorization implemented yet (use JWT in production)
- ⚠️ Note: Rate limiting not implemented (add in production)

---

## 📞 Support

For issues or questions, check:
1. Request format matches examples above
2. All required fields are provided
3. Field values match type requirements (number, string, enum)
4. MongoDB is running and connected
5. Server is running on port 5000

---

**API Version:** 2.0  
**Last Updated:** April 13, 2026
