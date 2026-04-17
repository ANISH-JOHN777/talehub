const Enrollment = require('../models/Enrollment')
const Program = require('../models/Program')
const User = require('../models/User')

// @route   POST /api/enrollments
// @desc    Create new enrollment (Join program)
exports.enrollProgram = async (req, res) => {
  try {
    const { programId, tier } = req.body
    const userId = req.user.id

    // Check if already enrolled
    const existing = await Enrollment.findOne({ user: userId, program: programId })
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this program' })
    }

    // Get program and price
    const program = await Program.findById(programId)
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' })
    }

    const price = program.pricing[tier.toLowerCase()].price

    const enrollment = new Enrollment({
      user: userId,
      program: programId,
      tier,
      price,
      status: 'Active',
    })

    await enrollment.save()

    // Update program seat count
    await Program.findByIdAndUpdate(programId, {
      $inc: { totalEnrolled: 1, seatsAvailable: -1 },
    })

    // Add to user's enrolled programs
    await User.findByIdAndUpdate(userId, { $push: { enrolledPrograms: programId } })

    res.status(201).json({ success: true, data: enrollment })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// @route   GET /api/enrollments/user
// @desc    Get user's enrollments
exports.getUserEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id })
      .populate('program', 'title category image instructor')
      .sort({ enrolledAt: -1 })

    res.status(200).json({ success: true, count: enrollments.length, data: enrollments })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   GET /api/enrollments/:enrollmentId
// @desc    Get single enrollment
exports.getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId).populate('program user')

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' })
    }

    res.status(200).json({ success: true, data: enrollment })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   PATCH /api/enrollments/:enrollmentId/progress
// @desc    Update enrollment progress
exports.updateProgress = async (req, res) => {
  try {
    const { sessionsAttended, percentComplete, notes } = req.body

    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.enrollmentId,
      {
        'progress.sessionsAttended': sessionsAttended,
        'progress.percentComplete': percentComplete,
        ...(notes && { $push: { 'progress.notes': notes } }),
      },
      { new: true }
    )

    res.status(200).json({ success: true, data: enrollment })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// @route   PATCH /api/enrollments/:enrollmentId/complete
// @desc    Mark enrollment as completed
exports.completeEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.enrollmentId,
      {
        status: 'Completed',
        completedAt: Date.now(),
        certificateIssued: true,
        certificateUrl: `https://talehub.com/certificates/${req.params.enrollmentId}`,
      },
      { new: true }
    )

    res.status(200).json({ success: true, data: enrollment })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// @route   GET /api/enrollments (Admin)
// @desc    Get all enrollments
exports.getAllEnrollments = async (req, res) => {
  try {
    const { programId, userId, status } = req.query
    let query = {}

    if (programId) query.program = programId
    if (userId) query.user = userId
    if (status) query.status = status

    const enrollments = await Enrollment.find(query).populate('user program')

    res.status(200).json({ success: true, count: enrollments.length, data: enrollments })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   DELETE /api/enrollments/:enrollmentId
// @desc    Cancel enrollment
exports.cancelEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.enrollmentId,
      { status: 'Cancelled' },
      { new: true }
    )

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' })
    }

    // Update program seat count
    await Program.findByIdAndUpdate(enrollment.program, {
      $inc: { totalEnrolled: -1, seatsAvailable: 1 },
    })

    res.status(200).json({ success: true, message: 'Enrollment cancelled', data: enrollment })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
