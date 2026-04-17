const express = require('express')
const router = express.Router()
const instructorController = require('../controllers/instructorController')
const { protect } = require('../middleware/auth')

// Public routes
router.get('/', instructorController.getAllInstructors)
router.get('/:id', instructorController.getInstructorById)

// Admin routes
router.post('/', protect, instructorController.createInstructor)
router.patch('/:id', protect, instructorController.updateInstructor)
router.delete('/:id', protect, instructorController.deleteInstructor)

module.exports = router
