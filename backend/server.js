require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const programRoutes = require('./routes/programRoutes')
const instructorRoutes = require('./routes/instructorRoutes')
const enrollmentRoutes = require('./routes/enrollmentRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')
const bookRoutes = require('./routes/bookRoutes')
const authRoutes = require('./routes/authRoutes')
const sessionRoutes = require('./routes/sessionRoutes')
const reviewRoutes = require('./routes/reviews')
const discussionRoutes = require('./routes/discussions')
const badgeRoutes = require('./routes/badges')
const bookingRoutes = require('./routes/bookingRoutes')

const app = express()

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004', 'http://localhost:3005', 'http://localhost:5173', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/learntales'

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('[INFO] MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err))

// Routes

// Test API endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: '[OK] Backend API is running!',
    timestamp: new Date(),
    status: 'Connected',
    version: '2.0'
  })
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'Server is running',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// NEW PLATFORM ROUTES
app.use('/api/programs', programRoutes)
app.use('/api/instructors', instructorRoutes)
app.use('/api/enrollments', enrollmentRoutes)
app.use('/api/admin/analytics', analyticsRoutes)

// LEGACY ROUTES (for backward compatibility)
app.use('/api/books', bookRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/sessions', sessionRoutes)
app.use('/api/books/:bookId/reviews', reviewRoutes)
app.use('/api/books/:bookId/discussions', discussionRoutes)
app.use('/api/badges', badgeRoutes)
app.use('/api/bookings', bookingRoutes)

// Welcome/Info endpoint
app.get('/', (req, res) => {
  res.json({
    message: '[OK] LearnTales Backend API',
    version: '2.0',
    description: 'REST API for managing books and user authentication',
    endpoints: {
      auth: '/api/auth',
      books: '/api/books',
      enroll: '/api/enroll',
      sessions: '/api/sessions',
      health: '/health',
      test: '/api/test'
    }
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: 'Please check the API documentation for valid endpoints'
  })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  })
})

// Server start
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  [START] Server running on port ${PORT}      ║
║  📍 http://localhost:${PORT}              ║
║  🗄️  MongoDB: Connected               ║
╚════════════════════════════════════════╝
  `)
})
