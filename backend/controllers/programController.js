const Program = require('../models/Program')
const Instructor = require('../models/Instructor')

// @route   GET /api/programs
// @desc    Get all programs with filters
exports.getAllPrograms = async (req, res) => {
  try {
    const { category, level, language, search, page = 1, limit = 10 } = req.query

    let query = { status: 'Published', isActive: true }

    if (category) query.category = category
    if (level) query.level = level
    if (language) query.language = language
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    const skip = (page - 1) * limit
    const programs = await Program.find(query)
      .populate('instructor', 'name avatar expertise')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })

    const total = await Program.countDocuments(query)

    res.status(200).json({
      success: true,
      count: programs.length,
      total,
      pages: Math.ceil(total / limit),
      data: programs,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   GET /api/programs/:id
// @desc    Get single program by ID
exports.getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id).populate(
      'instructor',
      'name avatar bio expertise rating totaStudents'
    )

    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' })
    }

    res.status(200).json({ success: true, data: program })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   GET /api/programs/slug/:slug
// @desc    Get program by slug
exports.getProgramBySlug = async (req, res) => {
  try {
    const program = await Program.findOne({ slug: req.params.slug }).populate(
      'instructor',
      'name avatar bio expertise rating totalStudents'
    )

    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' })
    }

    res.status(200).json({ success: true, data: program })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   POST /api/programs
// @desc    Create new program (Admin only)
exports.createProgram = async (req, res) => {
  try {
    const program = new Program(req.body)
    await program.save()

    // Add program to instructor's programs list
    await Instructor.findByIdAndUpdate(
      req.body.instructor,
      { $push: { programs: program._id } },
      { new: true }
    )

    res.status(201).json({ success: true, data: program })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// @route   PATCH /api/programs/:id
// @desc    Update program (Admin only)
exports.updateProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' })
    }

    res.status(200).json({ success: true, data: program })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// @route   DELETE /api/programs/:id
// @desc    Delete program (Admin only)
exports.deleteProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id)

    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' })
    }

    // Remove from instructor's programs list
    await Instructor.findByIdAndUpdate(
      program.instructor,
      { $pull: { programs: program._id } },
      { new: true }
    )

    res.status(200).json({ success: true, message: 'Program deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   GET /api/programs/categories/list
// @desc    Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = ['Self-Help', 'Business', 'Finance', 'Psychology', 'History', 'Technology', 'Personal Development']
    res.status(200).json({ success: true, data: categories })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   POST /api/programs/:id/sessions
// @desc    Add session to program
exports.addSession = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      { $push: { sessions: req.body } },
      { new: true }
    )

    res.status(201).json({ success: true, data: program })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// @route   PATCH /api/programs/:id/sessions/:sessionId
// @desc    Update session
exports.updateSession = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id)
    const session = program.sessions.id(req.params.sessionId)
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' })
    }
    Object.assign(session, req.body)
    await program.save()

    res.status(200).json({ success: true, data: program })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// @route   DELETE /api/programs/:id/sessions/:sessionId
// @desc    Delete session
exports.deleteSession = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      { $pull: { 'sessions': { _id: req.params.sessionId } } },
      { new: true }
    )

    res.status(200).json({ success: true, data: program })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
