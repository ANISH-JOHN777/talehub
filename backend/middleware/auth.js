const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Middleware to verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token

    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route',
      })
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Attach user to request object
      req.user = decoded

      // Optionally fetch full user data
      req.userDetails = await User.findById(decoded.id)

      next()
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Token expired. Please log in again.',
        })
      }

      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route',
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error during authentication',
    })
  }
}

// Middleware to check if user is admin (optional - for future use)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userDetails.role)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this route',
      })
    }
    next()
  }
}
