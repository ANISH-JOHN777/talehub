const Instructor = require('../models/Instructor')

// @route   GET /api/instructors
// @desc    Get all instructors
exports.getAllInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find({ isActive: true }).populate('programs', 'title category')

    res.status(200).json({
      success: true,
      count: instructors.length,
      data: instructors,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   GET /api/instructors/:id
// @desc    Get single instructor
exports.getInstructorById = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id).populate('programs', 'title category image')

    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Instructor not found' })
    }

    res.status(200).json({ success: true, data: instructor })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   POST /api/instructors
// @desc    Create new instructor (Admin only)
exports.createInstructor = async (req, res) => {
  try {
    const instructor = new Instructor(req.body)
    await instructor.save()

    res.status(201).json({ success: true, data: instructor })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// @route   PATCH /api/instructors/:id
// @desc    Update instructor (Admin only)
exports.updateInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Instructor not found' })
    }

    res.status(200).json({ success: true, data: instructor })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// @route   DELETE /api/instructors/:id
// @desc    Delete instructor (Admin only)
exports.deleteInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndDelete(req.params.id)

    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Instructor not found' })
    }

    res.status(200).json({ success: true, message: 'Instructor deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
