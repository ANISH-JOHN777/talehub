# 📁 Complete Project Structure

```
learn tales/
│
├── 📄 README.md                    # Full project documentation
├── 📄 QUICKSTART.md                # Quick start guide (START HERE!)
├── 📄 FOLDER_STRUCTURE.md          # This file
├── 🔧 setup.bat                    # Automated setup script (Windows)
├── 🔧 setup.sh                     # Automated setup script (macOS/Linux)
│
├── 📦 frontend/                    # React + Vite + Tailwind CSS
│   ├── 📄 README.md                # Frontend documentation
│   ├── 📄 package.json             # Frontend dependencies
│   ├── 📄 index.html               # HTML entry point
│   ├── 🔧 vite.config.js           # Vite configuration
│   ├── 🔧 tailwind.config.js       # Tailwind configuration
│   ├── 🔧 postcss.config.js        # PostCSS configuration
│   ├── 📝 .gitignore               # Git ignore rules
│   │
│   └── src/                        # Source code
│       ├── 📄 main.jsx             # React entry point
│       ├── 📄 App.jsx              # Main App component with routing
│       ├── 📄 App.css              # App styles (empty)
│       ├── 📄 index.css            # Global styles + Tailwind imports
│       │
│       ├── pages/                  # Page components
│       │   ├── 📄 Home.jsx         # Landing/home page
│       │   ├── 📄 Dashboard.jsx    # Book list page
│       │   └── 📄 BookDetails.jsx  # Individual book details page
│       │
│       └── components/             # Reusable components (for future use)
│           └── (empty for now)
│
├── 🔌 backend/                     # Express + MongoDB + Mongoose
│   ├── 📄 README.md                # Backend documentation
│   ├── 📄 server.js                # Main Express server
│   ├── 📄 package.json             # Backend dependencies
│   ├── 📄 .env.example             # Environment variables template
│   ├── 📄 .env                     # Environment variables (create from .env.example)
│   ├── 📝 .gitignore               # Git ignore rules
│   └── node_modules/               # Dependencies (created after npm install)
│
└── keys:
    📄 = File
    📁 = Folder/Directory
    🔧 = Configuration file
    📝 = Git file
    🔌 = Backend
    📦 = Frontend
```

## 📋 File Descriptions

### Root Level Files

| File | Purpose |
|------|---------|
| README.md | Complete project guide and setup instructions |
| QUICKSTART.md | Quick start guide for immediate setup |
| FOLDER_STRUCTURE.md | This file - visual project structure |
| setup.bat | Automated setup script for Windows |
| setup.sh | Automated setup script for macOS/Linux |

### Frontend Structure

| Path | File | Purpose |
|------|------|---------|
| frontend/ | package.json | Frontend dependencies list |
| frontend/ | index.html | HTML entry point |
| frontend/ | vite.config.js | Vite build tool configuration |
| frontend/ | tailwind.config.js | Tailwind CSS configuration |
| frontend/ | postcss.config.js | PostCSS processor configuration |
| frontend/README.md | - | Frontend-specific documentation |
| frontend/src/ | main.jsx | React app initialization |
| frontend/src/ | App.jsx | Main app component with React Router |
| frontend/src/ | index.css | Global styles and Tailwind imports |
| frontend/src/pages/ | Home.jsx | Landing page component |
| frontend/src/pages/ | Dashboard.jsx | Book collection page |
| frontend/src/pages/ | BookDetails.jsx | Individual book details page |

### Backend Structure

| Path | File | Purpose |
|------|------|---------|
| backend/ | package.json | Backend dependencies list |
| backend/ | server.js | Main Express server and API routes |
| backend/ | .env.example | Template for environment variables |
| backend/ | .env | Environment configuration (created manually) |
| backend/README.md | - | Backend-specific documentation |

## 🚀 How to Navigate

### For Development:

1. **Start Here:** Read `QUICKSTART.md`
2. **Frontend Code:** Edit files in `frontend/src/`
3. **Backend Code:** Edit `backend/server.js`
4. **Configuration:** Edit `backend/.env`, `frontend/vite.config.js`, etc.

### For Production:

1. **Frontend:** Run `npm run build` in `frontend/` → creates `frontend/dist/`
2. **Backend:** Use `npm start` in `backend/`

## 📝 Environment Files

### Backend .env
```
MONGO_URI=mongodb://localhost:27017/learntales
PORT=5000
NODE_ENV=development
```

### Frontend Configuration
Configured in `vite.config.js` with proxy to backend on `http://localhost:5000`

## 🔄 File Relationships

```
index.html (entry point)
    ↓
src/main.jsx (React init)
    ↓
src/App.jsx (Routes definition)
    ├→ pages/Home.jsx
    ├→ pages/Dashboard.jsx
    └→ pages/BookDetails.jsx
    
All pages fetch from → backend/server.js
                      (Running on :5000)
```

## 📊 Dependencies Tree

```
Frontend
  ├── React 18.2.0
  ├── React Router 6.20.0
  ├── Vite 5.0.8
  └── Tailwind CSS 3.3.6

Backend
  ├── Express 4.18.2
  ├── Mongoose 8.0.3
  ├── CORS 2.8.5
  └── dotenv 16.3.1
```

## 🎯 Key Configuration Points

| Item | File | Key Setting |
|------|------|-------------|
| Frontend Port | frontend/vite.config.js | `port: 3000` |
| Backend Port | backend/.env | `PORT=5000` |
| MongoDB URI | backend/.env | `MONGO_URI=...` |
| API Proxy | frontend/vite.config.js | `/api` → `localhost:5000` |
| Tailwind Content | frontend/tailwind.config.js | `"./src/**/*.{jsx}"` |

## ✅ Checklist

- [ ] Read README.md
- [ ] Read QUICKSTART.md
- [ ] Run setup script or manual npm install
- [ ] Edit backend/.env with MongoDB URI
- [ ] Start backend: `npm run dev`
- [ ] Start frontend: `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Test API connection (should show ✅ Connected)
- [ ] Navigate through all pages

## 🆘 Common Help Resources

| Issue | File | Solution |
|-------|------|----------|
| "How do I start?" | QUICKSTART.md | Follow step-by-step guide |
| Setup automation | setup.bat (Windows) or setup.sh (macOS/Linux) | Run the script |
| Frontend errors | frontend/README.md | Check frontend docs |
| Backend errors | backend/README.md | Check backend docs |
| API connection issues | README.md → Troubleshooting | Full troubleshooting guide |

---

**Pro Tip:** Keep this file open while developing for quick reference! 📚
