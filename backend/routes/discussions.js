const express = require('express')
const { protect } = require('../middleware/auth')
const {
  getThreads,
  getThread,
  createThread,
  createComment,
  updateThread,
  updateComment,
  deleteComment,
  likeComment,
} = require('../controllers/discussionController')

const router = express.Router({ mergeParams: true })

// Thread routes
router.get('/', getThreads)
router.get('/:id', getThread)
router.post('/', protect, createThread)
router.put('/:id', protect, updateThread)

// Comment routes
router.post('/:id/comments', protect, createComment)
router.put('/comments/:id', protect, updateComment)
router.delete('/comments/:id', protect, deleteComment)
router.post('/comments/:id/like', protect, likeComment)

module.exports = router
