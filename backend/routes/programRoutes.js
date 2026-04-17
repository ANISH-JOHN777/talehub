const express = require('express')
const router = express.Router()
const programController = require('../controllers/programController')
const { protect } = require('../middleware/auth')

// Public routes
router.get('/categories', programController.getCategories)
router.get('/', programController.getAllPrograms)
router.get('/slug/:slug', programController.getProgramBySlug)
router.get('/:id', programController.getProgramById)

// Admin routes
router.post('/', protect, programController.createProgram)
router.patch('/:id', protect, programController.updateProgram)
router.delete('/:id', protect, programController.deleteProgram)

// Session management
router.post('/:id/sessions', protect, programController.addSession)
router.patch('/:id/sessions/:sessionId', protect, programController.updateSession)
router.delete('/:id/sessions/:sessionId', protect, programController.deleteSession)

module.exports = router
