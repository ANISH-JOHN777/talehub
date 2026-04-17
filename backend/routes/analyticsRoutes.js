const express = require('express')
const router = express.Router()
const analyticsController = require('../controllers/analyticsController')
const { protect } = require('../middleware/auth')

// Admin only routes
router.get('/dashboard', protect, analyticsController.getAnalyticsDashboard)
router.get('/programs', protect, analyticsController.getProgramAnalytics)
router.get('/users', protect, analyticsController.getUserAnalytics)
router.post('/record', protect, analyticsController.recordDailyAnalytics)

module.exports = router
