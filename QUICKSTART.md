# 🚀 QUICK START GUIDE

## Step-by-Step Setup Instructions

### Prerequisites
- Node.js v16+ installed
- MongoDB installed or MongoDB Atlas account
- Git (optional)

---

## BACKEND SETUP (Terminal 1)

```bash
# 1. Navigate to backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file from template
cp .env.example .env

# 4. Edit .env - set your MongoDB URI
# Option A (Local MongoDB):
#   MONGO_URI=mongodb://localhost:27017/learntales
# Option B (MongoDB Atlas - Cloud):
#   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/learntales

# 5. Start backend server
npm run dev
```

**Expected Output:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📍 http://localhost:5000
```

---

## FRONTEND SETUP (Terminal 2)

```bash
# 1. Navigate to frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  press h to show help
```

---

## ✅ TEST THE APPLICATION

1. **Open Browser:** Go to `http://localhost:3000`
2. **Check API Connection:** Home page should show "✅ Connected" 
3. **Navigate Pages:**
   - Click "Home" → See landing page
   - Click "Dashboard" → See book list
   - Click "Sample Book" or "View Details" → See book details page

---

## 📝 COMMON COMMANDS

### Backend Commands:
```bash
npm install          # Install dependencies
npm run dev          # Start with auto-reload (development)
npm start            # Start server (production)
```

### Frontend Commands:
```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production (creates dist/ folder)
npm run preview      # Preview production build locally
```

---

## 🔌 TEST API ENDPOINTS

Open a new terminal and test endpoints:

```bash
# Test if backend is running
curl http://localhost:5000/api/test

# Get all books
curl http://localhost:5000/api/books

# Create a new book
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Book",
    "author": "Test Author",
    "genre": "Fiction",
    "pages": 100,
    "year": 2024,
    "description": "A test book"
  }'
```

---

## 📊 API ENDPOINTS SUMMARY

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/test | Check if backend is running |
| GET | /api/books | Get all books |
| GET | /api/books/:id | Get specific book |
| POST | /api/books | Create new book |
| PUT | /api/books/:id | Update book |
| DELETE | /api/books/:id | Delete book |
| GET | /health | Server health status |

---

## 🐛 TROUBLESHOOTING

### MongoDB Connection Error:
```
❌ MongoDB connection error
```
**Solution:**
- Make sure MongoDB is running: `mongod` (Windows Command Prompt)
- Or check your MongoDB Atlas connection string in `.env`

### Port Already in Use:
```
Error: listen EADDRINUSE :::5000
```
**Solution:**
- Change PORT in `backend/.env` to 5001 or another available port
- Or kill the process using the port

### Frontend won't connect to Backend:
```
Error: TypeError: Failed to fetch
```
**Solution:**
- Make sure backend is running (`http://localhost:5000`)
- Check CORS is enabled (it is by default)
- Verify proxy in `frontend/vite.config.js`

---

## 📁 PROJECT STRUCTURE

```
learn tales/
├── frontend/                 (React + Vite + Tailwind)
│   ├── src/
│   │   ├── pages/           (Home, Dashboard, BookDetails)
│   │   ├── App.jsx          (Main app with routing)
│   │   └── index.css        (Tailwind styles)
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── backend/                  (Express + MongoDB)
│   ├── server.js            (Main server file)
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
└── README.md               (Full guide)
```

---

## 🎯 NEXT STEPS

1. ✅ Run frontend and backend
2. ✅ Test all pages work
3. ✅ Test API endpoints
4. ⬜ Add more features and routes
5. ⬜ Add authentication (JWT)
6. ⬜ Deploy to Heroku (backend) and Vercel (frontend)

---

## 💡 TIPS

- **Keep both terminals open** while developing
- **Use React DevTools** browser extension for debugging
- **Use Postman** or **Insomnia** for easy API testing
- **Check logs** in terminal if something doesn't work
- **Restart servers** after changing `.env` files

---

**Happy Coding! 🎉**

Need help? Check the full README.md or individual README files in frontend/ and backend/
