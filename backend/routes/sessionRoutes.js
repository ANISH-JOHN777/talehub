const express = require('express')
const {
  createSession,
  getSessionsByBook,
  getAllSessions,
  joinSession,
  leaveSession,
  deleteSession,
  updateSessionStatus,
} = require('../controllers/sessionController')
const { protect } = require('../middleware/auth')

const router = express.Router()

// Public routes
router.get('/', getAllSessions)
router.get('/:bookId', getSessionsByBook)

// Protected routes
router.post('/', protect, createSession)
router.post('/:sessionId/join', protect, joinSession)
router.post('/:sessionId/leave', protect, leaveSession)
router.delete('/:sessionId', protect, deleteSession)
router.put('/:sessionId/status', protect, updateSessionStatus)

module.exports = router
