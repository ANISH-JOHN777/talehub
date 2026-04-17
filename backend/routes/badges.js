const express = require('express')
const { protect } = require('../middleware/auth')
const {
  getAllBadges,
  getUserBadges,
  awardBadge,
  checkAndAwardBadges,
  initializeDefaultBadges,
} = require('../controllers/badgeController')

const router = express.Router()

// Public routes
router.get('/', getAllBadges)
router.get('/user/:userId', getUserBadges)

// Protected routes
router.post('/check', protect, checkAndAwardBadges)

// Admin routes (marked but not enforced yet)
router.post('/initialize', initializeDefaultBadges)
router.post('/:badgeId/award/:userId', protect, awardBadge)

module.exports = router
