# Backend - Express + MongoDB

Express.js server with MongoDB integration using Mongoose.

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Configuration
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your MongoDB connection string:
   ```
   MONGO_URI=mongodb://localhost:27017/learntales
   PORT=5000
   ```

### Development (with auto-reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

Server runs on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── server.js - Main Express server
├── package.json - Dependencies
├── .env.example - Environment variable template
├── .gitignore
└── README.md
```

## 📊 Database Schema

### Book Model
```javascript
{
  title: String,
  author: String,
  genre: String,
  pages: Number,
  year: Number,
  description: String,
  createdAt: Date (default: now)
}
```

## 🔌 API Endpoints

### Test Endpoint
```
GET /api/test
```
Returns server status.

### Books Endpoints

**Get All Books:**
```
GET /api/books
```

**Get Single Book:**
```
GET /api/books/:id
```

**Create Book:**
```
POST /api/books
Content-Type: application/json

{
  "title": "Book Title",
  "author": "Author Name",
  "genre": "Genre",
  "pages": 200,
  "year": 2024,
  "description": "Book description"
}
```

**Update Book:**
```
PUT /api/books/:id
Content-Type: application/json

{
  "title": "Updated Title",
  ...
}
```

**Delete Book:**
```
DELETE /api/books/:id
```

### Health Check
```
GET /health
```

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB object modeling
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

## 🛠️ Development Dependencies

- **nodemon** - Auto-restart on file changes

## 📋 Environment Variables

Create a `.env` file (copy from `.env.example`):

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/learntales

# Server Port
PORT=5000

# Environment
NODE_ENV=development
```

## 🗄️ MongoDB Setup

### Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service:
   - Windows: `mongod`
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

### MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Add to `.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/learntales
   ```

## ✅ Testing Endpoints

### Using cURL

Test Backend:
```bash
curl http://localhost:5000/api/test
```

Get All Books:
```bash
curl http://localhost:5000/api/books
```

Create a Book:
```bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title":"1984",
    "author":"George Orwell",
    "genre":"Dystopian",
    "pages":328,
    "year":1949,
    "description":"A dystopian novel"
  }'
```

## 🚨 Error Handling

The API returns standard HTTP status codes:

- **200** - Success
- **201** - Created
- **400** - Bad Request
- **404** - Not Found
- **500** - Server Error

Example error response:
```json
{
  "success": false,
  "error": "Error message here"
}
```

## 🔒 CORS

CORS is enabled for all routes, allowing requests from:
- `http://localhost:3000` (frontend)
- Other origins can be configured in `server.js`

## 🎯 Features

✅ RESTful API
✅ MongoDB integration with Mongoose
✅ CORS support
✅ Error handling
✅ Environment configuration
✅ Health check endpoint
✅ Complete CRUD operations

## 📚 Next Steps

1. Add authentication (JWT)
2. Add input validation
3. Add logging
4. Deploy to Heroku
5. Add more routes and models
