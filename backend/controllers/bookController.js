const Book = require('../models/Book')

// @desc    Create a new book
// @route   POST /api/books
// @access  Public
exports.createBook = async (req, res) => {
  try {
    const { title, author, description, category, rating, reviews, pages, publishedYear, coverImage } = req.body

    // Validation
    if (!title || !author || !description) {
      return res.status(400).json({
        success: false,
        error: 'Please provide title, author, and description'
      })
    }

    // Create book
    const book = await Book.create({
      title,
      author,
      description,
      category,
      rating,
      reviews,
      pages,
      publishedYear,
      coverImage
    })

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

// @desc    Get all books
// @route   GET /api/books
// @access  Public
exports.getAllBooks = async (req, res) => {
  try {
    const { category, sort } = req.query

    // Build filter
    let filter = {}
    if (category) {
      filter.category = category
    }

    // Build sort
    let sortOptions = {}
    if (sort) {
      if (sort === 'rating') sortOptions = { rating: -1 }
      else if (sort === 'newest') sortOptions = { createdAt: -1 }
      else if (sort === 'title') sortOptions = { title: 1 }
    }

    // Fetch books
    const books = await Book.find(filter).sort(sortOptions)

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      })
    }

    res.status(200).json({
      success: true,
      data: book
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Invalid book ID'
    })
  }
}

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Public
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Public
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id)

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: book
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

// @desc    Get books by category
// @route   GET /api/books/category/:category
// @access  Public
exports.getBooksByCategory = async (req, res) => {
  try {
    const books = await Book.find({ category: req.params.category })

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

// @desc    Search books
// @route   GET /api/books/search/:query
// @access  Public
exports.searchBooks = async (req, res) => {
  try {
    const { query } = req.params

    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    })

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

// @desc    Get book statistics
// @route   GET /api/books/stats/overview
// @access  Public
exports.getBookStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments()
    const avgRating = await Book.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          averageReviews: { $avg: '$reviews' }
        }
      }
    ])

    const booksByCategory = await Book.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ])

    res.status(200).json({
      success: true,
      data: {
        totalBooks,
        averageRating: avgRating[0]?.averageRating || 0,
        averageReviews: avgRating[0]?.averageReviews || 0,
        booksByCategory
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
