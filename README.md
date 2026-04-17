# LearnTales - Full Stack Setup Guide

A complete full-stack application with React (Vite) frontend and Node.js/Express backend with MongoDB.

## 📁 Project Structure

```
learn tales/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── BookDetails.jsx
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .gitignore
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas account)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure MongoDB in .env:**
   - For local MongoDB: `MONGO_URI=mongodb://localhost:27017/learntales`
   - For MongoDB Atlas: `MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/learntales`

5. **Start the backend:**
   - **Development mode (with auto-reload):**
     ```bash
     npm run dev
     ```
   - **Production mode:**
     ```bash
     npm start
     ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

## 📚 Features

### Frontend (React + Vite + Tailwind CSS)
- ✅ **React Router**: Navigation between pages
  - Home page
  - Dashboard page
  - Book details page
- ✅ **Tailwind CSS**: Beautiful responsive UI
- ✅ **Vite**: Ultra-fast build tool
- ✅ **Proxy Setup**: Automatically routes `/api` calls to backend

### Backend (Express + MongoDB)
- ✅ **Express Server**: Fast and minimal web framework
- ✅ **MongoDB + Mongoose**: Document database with schema validation
- ✅ **CORS**: Cross-Origin Resource Sharing enabled
- ✅ **RESTful API**: Complete CRUD operations for books
- ✅ **Error Handling**: Comprehensive error management

## 🔌 API Endpoints

### Test Endpoint
- **GET** `/api/test` - Test if backend is running

### Book Endpoints
- **GET** `/api/books` - Get all books
- **GET** `/api/books/:id` - Get a specific book
- **POST** `/api/books` - Create a new book
- **PUT** `/api/books/:id` - Update a book
- **DELETE** `/api/books/:id` - Delete a book

### Health Check
- **GET** `/health` - Server health status

## 📝 Example API Requests

### Get all books:
```bash
curl http://localhost:5000/api/books
```

### Create a new book:
```bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Fiction",
    "pages": 180,
    "year": 1925,
    "description": "A classic American novel"
  }'
```

### Get a specific book:
```bash
curl http://localhost:5000/api/books/[ID]
```

## 🧪 Testing the Setup

1. **Start MongoDB** (if using local)
2. **Start Backend:**
   ```bash
   cd backend && npm run dev
   ```
3. **Start Frontend** (in another terminal):
   ```bash
   cd frontend && npm run dev
   ```
4. **Navigate to:** `http://localhost:3000`
5. **Test API Connection:** Visit Home page - it will show "Connected" if API is working

## 🚀 Production Build

### Frontend:
```bash
cd frontend
npm run build
```
Output will be in `frontend/dist/`

### Backend:
Just use `npm start` without nodemon for production

## 📦 Dependencies

### Frontend
- `react`: ^18.2.0
- `react-dom`: ^18.2.0
- `react-router-dom`: ^6.20.0
- `vite`: ^5.0.8
- `tailwindcss`: ^3.3.6

### Backend
- `express`: ^4.18.2
- `mongoose`: ^8.0.3
- `cors`: ^2.8.5
- `dotenv`: ^16.3.1
- `nodemon`: ^3.0.2 (dev only)

## 🌐 Connecting Frontend to Backend

The frontend is already configured to proxy API calls to the backend:
- Frontend runs on: `http://localhost:3000`
- Backend runs on: `http://localhost:5000`
- API calls are automatically forwarded from `/api/*` to the backend

## 📖 Project Pages

### Home Page
- Welcome screen
- Backend status check
- Quick links to other pages

### Dashboard Page
- Displays a list of books in a table
- Links to book details pages
- Sample data included

### Book Details Page
- Detailed book information
- Dynamic routing based on book ID
- Additional book metadata

## 🐛 Troubleshooting

### Backend won't connect to MongoDB:
- Check if MongoDB is running (`mongod` on Windows)
- Verify `MONGO_URI` in `.env` is correct
- For MongoDB Atlas, ensure your IP is whitelisted

### Frontend can't connect to backend:
- Ensure backend is running on port 5000
- Check if CORS is not blocked
- Verify proxy settings in `vite.config.js`

### Port already in use:
- Frontend: Change port in `vite.config.js`
- Backend: Change `PORT` in `.env`

## 📚 Next Steps

1. Integrate frontend with backend API calls
2. Add authentication (JWT tokens)
3. Add form validation
4. Deploy to Heroku (backend) and Vercel (frontend)
5. Add more features and pages
6. Implement search and filtering

## 📝 License

ISC

---

**Happy Coding! 🎉**
