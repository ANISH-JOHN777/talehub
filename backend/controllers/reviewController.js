const Review = require('../models/Review')
const Book = require('../models/Book')

// Get all reviews for a book
exports.getReviews = async (req, res) => {
  try {
    const { bookId } = req.params
    const { sort = '-helpful' } = req.query

    const reviews = await Review.find({ book: bookId })
      .populate('user', 'name avatar')
      .sort(sort)
      .select('-__v')

    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0

    res.status(200).json({
      success: true,
      data: {
        reviews,
        count: reviews.length,
        avgRating,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Get single review
exports.getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('user', 'name avatar')

    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' })
    }

    res.status(200).json({ success: true, data: review })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Create review
exports.createReview = async (req, res) => {
  try {
    const { bookId } = req.params
    const { rating, title, content } = req.body
    const userId = req.user.id

    // Check if book exists
    const book = await Book.findById(bookId)
    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' })
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({ book: bookId, user: userId })
    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this book',
      })
    }

    const review = await Review.create({
      book: bookId,
      user: userId,
      rating,
      title,
      content,
    })

    await review.populate('user', 'name avatar')

    res.status(201).json({ success: true, data: review })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Update review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params
    const { rating, title, content } = req.body
    const userId = req.user.id

    let review = await Review.findById(id)
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' })
    }

    // Check authorization
    if (review.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this review',
      })
    }

    review = await Review.findByIdAndUpdate(
      id,
      { rating, title, content },
      { new: true, runValidators: true }
    ).populate('user', 'name avatar')

    res.status(200).json({ success: true, data: review })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' })
    }

    // Check authorization
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this review',
      })
    }

    await Review.findByIdAndDelete(req.params.id)

    res.status(200).json({ success: true, data: {} })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Mark helpful
exports.markHelpful = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    ).populate('user', 'name avatar')

    res.status(200).json({ success: true, data: review })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}
