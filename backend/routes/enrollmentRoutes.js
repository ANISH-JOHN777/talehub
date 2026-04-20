const express = require('express')
const router = express.Router()
const enrollmentController = require('../controllers/enrollmentController')
const { protect, authorize } = require('../middleware/auth')

// User routes
router.post('/', protect, enrollmentController.enrollProgram)
router.get('/user', protect, enrollmentController.getUserEnrollments)
router.get('/:enrollmentId', protect, enrollmentController.getEnrollmentById)
router.patch('/:enrollmentId/progress', protect, enrollmentController.updateProgress)
router.patch('/:enrollmentId/complete', protect, enrollmentController.completeEnrollment)
router.delete('/:enrollmentId', protect, enrollmentController.cancelEnrollment)

// Certificate routes
router.get('/:enrollmentId/certificate', protect, enrollmentController.downloadCertificate)
router.post('/:enrollmentId/generate-certificate', protect, enrollmentController.generateCertificateEndpoint)

// Admin routes
router.get('/', protect, authorize('admin'), enrollmentController.getAllEnrollments)

module.exports = router
