const express = require('express')
const router = express.Router()
const analyticsController = require('../controllers/analyticsController')
const { protect, authorize } = require('../middleware/auth')

// Admin only routes
router.get('/dashboard', protect, authorize('admin'), analyticsController.getAnalyticsDashboard)
router.get('/programs', protect, authorize('admin'), analyticsController.getProgramAnalytics)
router.get('/users', protect, authorize('admin'), analyticsController.getUserAnalytics)
router.post('/record', protect, authorize('admin'), analyticsController.recordDailyAnalytics)

module.exports = router
