const Session = require('../models/Session')
const Book = require('../models/Book')

// @desc    Create a new session
// @route   POST /api/sessions
// @access  Private
exports.createSession = async (req, res) => {
  try {
    const { title, date, meetLink, bookId, description } = req.body
    const createdBy = req.user.id

    // Validate required fields
    if (!title || !date || !meetLink || !bookId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide title, date, meetLink, and bookId',
      })
    }

    // Check if book exists
    const book = await Book.findById(bookId)
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found',
      })
    }

    // Validate date is in future
    const sessionDate = new Date(date)
    if (sessionDate <= new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Session date must be in the future',
      })
    }

    // Create session
    const session = await Session.create({
      title,
      date: sessionDate,
      meetLink,
      bookId,
      createdBy,
      description,
      attendees: [createdBy], // Creator is first attendee
    })

    // Populate references
    await session.populate(['createdBy', 'bookId', 'attendees'])

    res.status(201).json({
      success: true,
      data: session,
    })
  } catch (error) {
    console.error('Create session error:', error)

    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        error: messages.join(', '),
      })
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Server error creating session',
    })
  }
}

// @desc    Get sessions for a specific book
// @route   GET /api/sessions/:bookId
// @access  Public
exports.getSessionsByBook = async (req, res) => {
  try {
    const { bookId } = req.params

    // Check if book exists
    const book = await Book.findById(bookId)
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found',
      })
    }

    // Get sessions for the book, ordered by date
    const sessions = await Session.find({ bookId })
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email')
      .populate('bookId', 'title author')
      .sort({ date: 1 })

    res.status(200).json({
      success: true,
      data: sessions,
      count: sessions.length,
    })
  } catch (error) {
    console.error('Get sessions error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Server error fetching sessions',
    })
  }
}

// @desc    Get all sessions
// @route   GET /api/sessions
// @access  Public
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email')
      .populate('bookId', 'title author')
      .sort({ date: 1 })

    res.status(200).json({
      success: true,
      data: sessions,
      count: sessions.length,
    })
  } catch (error) {
    console.error('Get all sessions error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Server error fetching sessions',
    })
  }
}

// @desc    Join a session
// @route   POST /api/sessions/:sessionId/join
// @access  Private
exports.joinSession = async (req, res) => {
  try {
    const { sessionId } = req.params
    const userId = req.user.id

    // Find session
    const session = await Session.findById(sessionId)
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      })
    }

    // Check if already attending
    if (session.attendees.includes(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Already attending this session',
      })
    }

    // Add user to attendees
    session.attendees.push(userId)
    await session.save()

    await session.populate(['createdBy', 'bookId', 'attendees'])

    res.status(200).json({
      success: true,
      data: {
        message: 'Successfully joined session',
        session,
        totalAttendees: session.attendees.length,
      },
    })
  } catch (error) {
    console.error('Join session error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Server error joining session',
    })
  }
}

// @desc    Leave a session
// @route   POST /api/sessions/:sessionId/leave
// @access  Private
exports.leaveSession = async (req, res) => {
  try {
    const { sessionId } = req.params
    const userId = req.user.id

    // Find session
    const session = await Session.findById(sessionId)
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      })
    }

    // Check if attending
    if (!session.attendees.includes(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Not attending this session',
      })
    }

    // Remove user from attendees
    session.attendees = session.attendees.filter(
      id => id.toString() !== userId
    )
    await session.save()

    res.status(200).json({
      success: true,
      data: {
        message: 'Successfully left session',
        totalAttendees: session.attendees.length,
      },
    })
  } catch (error) {
    console.error('Leave session error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Server error leaving session',
    })
  }
}

// @desc    Delete a session
// @route   DELETE /api/sessions/:sessionId
// @access  Private
exports.deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params
    const userId = req.user.id

    // Find session
    const session = await Session.findById(sessionId)
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      })
    }

    // Check if user is creator
    if (session.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Only session creator can delete',
      })
    }

    await Session.findByIdAndDelete(sessionId)

    res.status(200).json({
      success: true,
      data: {
        message: 'Session deleted successfully',
      },
    })
  } catch (error) {
    console.error('Delete session error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Server error deleting session',
    })
  }
}

// @desc    Update session status
// @route   PUT /api/sessions/:sessionId/status
// @access  Private
exports.updateSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params
    const { status } = req.body
    const userId = req.user.id

    // Validate status
    if (!['upcoming', 'ongoing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status',
      })
    }

    // Find session
    const session = await Session.findById(sessionId)
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      })
    }

    // Check if user is creator
    if (session.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Only session creator can update status',
      })
    }

    session.status = status
    await session.save()

    res.status(200).json({
      success: true,
      data: session,
    })
  } catch (error) {
    console.error('Update session status error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Server error updating session',
    })
  }
}
