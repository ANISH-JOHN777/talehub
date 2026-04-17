const express = require('express')
const { protect } = require('../middleware/auth')
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
} = require('../controllers/reviewController')

const router = express.Router({ mergeParams: true })

// Public routes
router.get('/', getReviews)
router.get('/:id', getReview)

// Protected routes
router.post('/', protect, createReview)
router.put('/:id', protect, updateReview)
router.delete('/:id', protect, deleteReview)
router.post('/:id/helpful', protect, markHelpful)

module.exports = router
