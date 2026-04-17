# Frontend - React + Vite + Tailwind CSS

Modern React frontend built with Vite and styled with Tailwind CSS.

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### Production Build
```bash
npm run build
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Home.jsx - Landing page
│   │   ├── Dashboard.jsx - Book list view
│   │   └── BookDetails.jsx - Individual book details
│   ├── components/ - Reusable components (for future use)
│   ├── App.jsx - Main app with routing
│   ├── main.jsx - Entry point
│   └── index.css - Global Tailwind styles
├── index.html - HTML entry point
├── vite.config.js - Vite configuration
├── tailwind.config.js - Tailwind configuration
├── postcss.config.js - PostCSS configuration
├── package.json - Dependencies
└── .gitignore
```

## 🎨 Styling

This project uses **Tailwind CSS** for all styling. No CSS classes or separate stylesheet needed - all styling is done with Tailwind utilities.

## 🛣️ Routing

The app uses **React Router v6** with the following routes:

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing/home page |
| `/dashboard` | Dashboard | Book collection list |
| `/book/:id` | BookDetails | Individual book details |

## 🔗 API Integration

The frontend is configured to proxy API requests to the backend at `http://localhost:5000`.

Example fetch:
```javascript
fetch('/api/test')
  .then(res => res.json())
  .then(data => console.log(data))
```

## 📦 Dependencies

- **react** - UI library
- **react-dom** - React DOM library
- **react-router-dom** - Client-side routing
- **vite** - Build tool
- **tailwindcss** - Utility-first CSS

## 🎯 Features

✅ Responsive design with Tailwind CSS
✅ Client-side routing with React Router
✅ API proxy setup for backend communication
✅ Modern component structure
✅ Fast development with Vite HMR

## 🤝 Integration Notes

- Backend API calls will be made to `/api/*` routes
- The server proxies these to `http://localhost:5000`
- Ensure backend is running for API functionality
