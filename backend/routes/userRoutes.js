const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { protect } = require('../middleware/auth')

// Profile routes
router.get('/profile', protect, userController.getProfile)
router.patch('/profile', protect, userController.updateProfile)
router.delete('/profile', protect, userController.deleteAccount)

// Password and preferences
router.patch('/change-password', protect, userController.changePassword)
router.patch('/preferences', protect, userController.updatePreferences)
router.patch('/avatar', protect, userController.updateAvatar)

// Statistics
router.get('/stats', protect, userController.getUserStats)

// Public profile
router.get('/:userId/public-profile', userController.getPublicProfile)

// Follow/Unfollow
router.post('/:userId/follow', protect, userController.followUser)
router.post('/:userId/unfollow', protect, userController.unfollowUser)

module.exports = router
