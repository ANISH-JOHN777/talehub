const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  })
}

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body

    // Validate input
    if (!name || !email || !password || !passwordConfirm) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields (name, email, password, passwordConfirm)',
      })
    }

    // Check if passwords match
    if (password !== passwordConfirm) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match',
      })
    }

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered',
      })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    })

    // Generate token
    const token = generateToken(user._id)

    // Return success response
    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        token,
      },
    })
  } catch (error) {
    console.error('Register error:', error)

    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        error: messages.join(', '),
      })
    }

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered',
      })
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Server error during registration',
    })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      })
    }

    // Find user and select password field (it's normally hidden)
    const user = await User.findOne({ email }).select('+password')

    // Check if user exists
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid credentials',
      })
    }

    // Check if password is correct
    const isPasswordCorrect = await user.matchPassword(password)
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        error: 'Invalid credentials',
      })
    }

    // Generate token
    const token = generateToken(user._id)

    // Return success response
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        token,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Server error during login',
    })
  }
}

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Server error fetching user',
    })
  }
}

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Logged out successfully',
    },
  })
}
