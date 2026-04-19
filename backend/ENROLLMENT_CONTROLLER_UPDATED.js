/**
 * UPDATED ENROLLMENT CONTROLLER
 * Add this to backend/controllers/enrollmentController.js
 * 
 * This file contains the updated controllers to handle the new
 * enrollment customization system with sessions, phone numbers,
 * and session type selection (human vs AI).
 */

const Enrollment = require('../models/Enrollment')
const Program = require('../models/Program')

// Helper function to generate unique Google Meet-like codes
function generateMeetCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let code = ''
  for (let i = 0; i < 10; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

/**
 * Create a new enrollment with customized sessions
 * POST /api/enrollments
 * 
 * Request body:
 * {
 *   programId: string,
 *   sessionType: 'human' | 'ai',
 *   sessionCount: number,
 *   customizedSessions: [
 *     {
 *       date: 'YYYY-MM-DD',
 *       time: 'HH:MM',
 *       status: 'scheduled'
 *     }
 *   ],
 *   phoneNumber: string,
 *   price: number,
 *   tier: string,
 *   paymentDetails: {
 *     transactionId: string,
 *     paymentMethod: string,
 *     amount: number,
 *     cardLast4: string
 *   }
 * }
 */
exports.createEnrollment = async (req, res) => {
  try {
    const {
      programId,
      sessionType,
      sessionCount,
      customizedSessions,
      phoneNumber,
      price,
      tier,
      paymentDetails,
    } = req.body

    // Validate required fields
    if (!programId || !sessionType || !sessionCount || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: programId, sessionType, sessionCount, phoneNumber',
      })
    }

    // Validate session type
    if (!['human', 'ai'].includes(sessionType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sessionType. Must be "human" or "ai"',
      })
    }

    // Validate phone number (basic validation)
    const cleanPhone = phoneNumber.replace(/\D/g, '')
    if (cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number',
      })
    }

    // Check if program exists
    const program = await Program.findById(programId)
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found',
      })
    }

    // Check if user is already enrolled in this program
    const existingEnrollment = await Enrollment.findOne({
      user: req.user._id,
      program: programId,
    })

    if (existingEnrollment && existingEnrollment.status === 'Active') {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this program',
      })
    }

    // Generate meet links for each session
    const sessionsWithLinks = customizedSessions.map((session, index) => ({
      date: session.date,
      time: session.time,
      status: session.status || 'scheduled',
      meetLink: `https://meet.google.com/${generateMeetCode()}`,
      recordingLink: null,
      attendees: [],
      notes: [],
    }))

    // Create enrollment
    const enrollment = new Enrollment({
      user: req.user._id,
      program: programId,
      tier: tier || 'Pro',
      price: price,
      sessionType, // NEW: Store session type
      sessionCount, // NEW: Store session count
      customizedSessions: sessionsWithLinks, // NEW: Store customized sessions
      phoneNumber: cleanPhone, // NEW: Store phone number
      status: 'Active',
      paymentDetails: {
        ...paymentDetails,
        paidAt: new Date(),
      },
    })

    await enrollment.save()

    // Populate program details
    await enrollment.populate('program')

    res.status(201).json({
      success: true,
      message: 'Enrollment created successfully',
      data: enrollment,
    })
  } catch (error) {
    console.error('Error creating enrollment:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating enrollment',
    })
  }
}

/**
 * Get all enrollments for the current user
 * GET /api/enrollments/user
 */
exports.getUserEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate('program', 'title description image category level duration')
      .sort({ enrolledAt: -1 })

    res.json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    })
  } catch (error) {
    console.error('Error fetching user enrollments:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

/**
 * Get a specific enrollment
 * GET /api/enrollments/:id
 */
exports.getEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id).populate('program')

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      })
    }

    // Check authorization
    if (enrollment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this enrollment',
      })
    }

    res.json({
      success: true,
      data: enrollment,
    })
  } catch (error) {
    console.error('Error fetching enrollment:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

/**
 * Update enrollment (e.g., mark session as completed)
 * PUT /api/enrollments/:id
 * 
 * Can update:
 * - progress fields
 * - session status
 * - notes and resources
 */
exports.updateEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      })
    }

    // Check authorization
    if (enrollment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this enrollment',
      })
    }

    const { progress, status, customizedSessions } = req.body

    if (progress) {
      enrollment.progress = { ...enrollment.progress, ...progress }
    }

    if (status) {
      enrollment.status = status
    }

    if (customizedSessions) {
      enrollment.customizedSessions = customizedSessions
    }

    await enrollment.save()

    res.json({
      success: true,
      message: 'Enrollment updated successfully',
      data: enrollment,
    })
  } catch (error) {
    console.error('Error updating enrollment:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

/**
 * Mark a session as completed and update attendance
 * PUT /api/enrollments/:enrollmentId/sessions/:sessionIndex/complete
 */
exports.completeSession = async (req, res) => {
  try {
    const { enrollmentId, sessionIndex } = req.params
    const { recordingLink } = req.body

    const enrollment = await Enrollment.findById(enrollmentId)

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      })
    }

    // Check authorization
    if (enrollment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      })
    }

    if (sessionIndex >= enrollment.customizedSessions.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid session index',
      })
    }

    // Update session status
    enrollment.customizedSessions[sessionIndex].status = 'completed'
    if (recordingLink) {
      enrollment.customizedSessions[sessionIndex].recordingLink = recordingLink
    }

    // Add user to attendees if not already there
    if (!enrollment.customizedSessions[sessionIndex].attendees.includes(req.user._id)) {
      enrollment.customizedSessions[sessionIndex].attendees.push(req.user._id)
    }

    // Update progress
    const completedSessions = enrollment.customizedSessions.filter(s => s.status === 'completed').length
    enrollment.progress.sessionsCompleted = completedSessions
    enrollment.progress.sessionsAttended = completedSessions
    enrollment.progress.percentComplete = Math.round((completedSessions / enrollment.sessionCount) * 100)

    await enrollment.save()

    res.json({
      success: true,
      message: 'Session marked as completed',
      data: enrollment,
    })
  } catch (error) {
    console.error('Error completing session:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

/**
 * Add notes to a session
 * POST /api/enrollments/:enrollmentId/sessions/:sessionIndex/notes
 */
exports.addSessionNote = async (req, res) => {
  try {
    const { enrollmentId, sessionIndex } = req.params
    const { content } = req.body

    const enrollment = await Enrollment.findById(enrollmentId)

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      })
    }

    if (sessionIndex >= enrollment.customizedSessions.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid session index',
      })
    }

    if (!enrollment.customizedSessions[sessionIndex].notes) {
      enrollment.customizedSessions[sessionIndex].notes = []
    }

    enrollment.customizedSessions[sessionIndex].notes.push({
      content,
      createdBy: req.user._id,
      createdAt: new Date(),
    })

    await enrollment.save()

    res.json({
      success: true,
      message: 'Note added successfully',
      data: enrollment,
    })
  } catch (error) {
    console.error('Error adding note:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

/**
 * Cancel enrollment
 * PUT /api/enrollments/:id/cancel
 */
exports.cancelEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      })
    }

    // Check authorization
    if (enrollment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      })
    }

    enrollment.status = 'Cancelled'

    await enrollment.save()

    res.json({
      success: true,
      message: 'Enrollment cancelled successfully',
      data: enrollment,
    })
  } catch (error) {
    console.error('Error cancelling enrollment:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

/**
 * Get all enrollments (Admin only)
 * GET /api/enrollments
 */
exports.getAllEnrollments = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view all enrollments',
      })
    }

    const enrollments = await Enrollment.find()
      .populate('user', 'name email')
      .populate('program', 'title category')
      .sort({ enrolledAt: -1 })

    res.json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    })
  } catch (error) {
    console.error('Error fetching enrollments:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = {
  createEnrollment,
  getUserEnrollments,
  getEnrollment,
  updateEnrollment,
  completeSession,
  addSessionNote,
  cancelEnrollment,
  getAllEnrollments,
}
