const express = require('express')
const router = express.Router()
const {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  getBooksByCategory,
  searchBooks,
  getBookStats
} = require('../controllers/bookController')

// Main book routes
router.post('/', createBook)
router.get('/', getAllBooks)
router.get('/stats/overview', getBookStats)
router.get('/search/:query', searchBooks)
router.get('/category/:category', getBooksByCategory)
router.get('/:id', getBookById)
router.put('/:id', updateBook)
router.delete('/:id', deleteBook)

module.exports = router
