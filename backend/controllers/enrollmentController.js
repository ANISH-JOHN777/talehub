const Enrollment = require('../models/Enrollment')
const Program = require('../models/Program')
const User = require('../models/User')
const { sendEnrollmentConfirmation, sendCompletionNotification } = require('../utils/emailService')
const { generateCertificate, getCertificateFile } = require('../utils/certificateService')

// @route   POST /api/enrollments
// @desc    Create new enrollment (Join program)
exports.enrollProgram = async (req, res) => {
  try {
    const { programId, tier, instructorId } = req.body
    const userId = req.user.id

    // Validate required fields
    if (!instructorId) {
      return res.status(400).json({ success: false, message: 'Please select an instructor' })
    }

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

    // Verify instructor exists and is associated with program
    const instructor = await require('../models/Instructor').findById(instructorId)
    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Instructor not found' })
    }

    const price = program.pricing[tier.toLowerCase()].price

    const enrollment = new Enrollment({
      user: userId,
      program: programId,
      instructor: instructorId,
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
    const user = await User.findByIdAndUpdate(userId, { $push: { enrolledPrograms: programId } }, { new: true })

    // Send enrollment confirmation email
    await sendEnrollmentConfirmation(user, program, tier)

    // Populate and return enrollment with instructor details
    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate('user', 'name email')
      .populate('program', 'title category')
      .populate('instructor', 'name expertise email bio profileImage')

    res.status(201).json({ success: true, data: populatedEnrollment })
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
      .populate('instructor', 'name expertise email bio profileImage')
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
    const enrollment = await Enrollment.findById(req.params.enrollmentId)
      .populate('program user')
      .populate('instructor', 'name expertise email bio profileImage')

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
      .populate('user program')
      .populate('instructor', 'name expertise email bio profileImage')

    // Send completion notification email
    await sendCompletionNotification(enrollment.user, enrollment.program)

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

    const enrollments = await Enrollment.find(query)
      .populate('user program')
      .populate('instructor', 'name expertise email bio profileImage')

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

// @route   GET /api/enrollments/:enrollmentId/certificate
// @desc    Download certificate
exports.downloadCertificate = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId)
      .populate('user program')

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' })
    }

    if (enrollment.status !== 'Completed' || !enrollment.certificateIssued) {
      return res.status(400).json({
        success: false,
        message: 'Certificate not available for this enrollment',
      })
    }

    // Generate certificate if not already generated
    let certificateFile = null
    if (enrollment.certificateUrl) {
      const fileName = enrollment.certificateUrl.split('/').pop()
      certificateFile = getCertificateFile(fileName)
    }

    if (!certificateFile) {
      // Generate new certificate
      const certResult = await generateCertificate(enrollment)
      if (!certResult.success) {
        throw new Error('Failed to generate certificate')
      }
      certificateFile = certResult.filePath
      // Update enrollment with certificate URL
      enrollment.certificateUrl = certResult.url
      await enrollment.save()
    }

    // Send file as download
    const fileName = `${enrollment.user.name}_${enrollment.program.title}_Certificate.pdf`
    res.download(certificateFile, fileName)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   POST /api/enrollments/:enrollmentId/generate-certificate
// @desc    Generate and issue certificate
exports.generateCertificateEndpoint = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId)
      .populate('user program')

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' })
    }

    if (enrollment.status !== 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Enrollment must be completed to generate certificate',
      })
    }

    // Generate certificate
    const certResult = await generateCertificate(enrollment)
    if (!certResult.success) {
      throw new Error('Failed to generate certificate')
    }

    // Update enrollment
    enrollment.certificateIssued = true
    enrollment.certificateUrl = certResult.url
    await enrollment.save()

    res.status(200).json({
      success: true,
      message: 'Certificate generated successfully',
      data: {
        certificateUrl: certResult.url,
        fileName: certResult.fileName,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
