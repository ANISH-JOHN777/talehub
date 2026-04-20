const express = require('express')
const router = express.Router()
const programController = require('../controllers/programController')
const { protect, authorize } = require('../middleware/auth')

// Public routes
router.get('/categories', programController.getCategories)
router.get('/', programController.getAllPrograms)
router.get('/slug/:slug', programController.getProgramBySlug)
router.get('/:id', programController.getProgramById)

// Admin/Instructor routes - Create and manage programs
router.post('/', protect, authorize('instructor', 'admin'), programController.createProgram)
router.patch('/:id', protect, authorize('instructor', 'admin'), programController.updateProgram)
router.delete('/:id', protect, authorize('instructor', 'admin'), programController.deleteProgram)

// Session management
router.post('/:id/sessions', protect, authorize('instructor', 'admin'), programController.addSession)
router.patch('/:id/sessions/:sessionId', protect, authorize('instructor', 'admin'), programController.updateSession)
router.delete('/:id/sessions/:sessionId', protect, authorize('instructor', 'admin'), programController.deleteSession)

module.exports = router
