const DiscussionThread = require('../models/DiscussionThread')
const DiscussionComment = require('../models/DiscussionComment')
const Book = require('../models/Book')

// Get all threads for a book
exports.getThreads = async (req, res) => {
  try {
    const { bookId } = req.params
    const { sort = '-isPinned -lastActivityAt' } = req.query

    const threads = await DiscussionThread.find({ book: bookId, isClosed: false })
      .populate('author', 'name avatar')
      .sort(sort)
      .select('-__v')

    res.status(200).json({
      success: true,
      data: threads,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Get single thread
exports.getThread = async (req, res) => {
  try {
    const thread = await DiscussionThread.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name avatar')

    if (!thread) {
      return res.status(404).json({ success: false, error: 'Thread not found' })
    }

    const comments = await DiscussionComment.find({ thread: req.params.id })
      .populate('author', 'name avatar')
      .sort('createdAt')

    res.status(200).json({
      success: true,
      data: { thread, comments },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Create thread
exports.createThread = async (req, res) => {
  try {
    const { bookId } = req.params
    const { title, content, category } = req.body
    const userId = req.user.id

    // Check if book exists
    const book = await Book.findById(bookId)
    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' })
    }

    const thread = await DiscussionThread.create({
      book: bookId,
      author: userId,
      title,
      content,
      category,
    })

    await thread.populate('author', 'name avatar')

    res.status(201).json({ success: true, data: thread })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Create comment
exports.createComment = async (req, res) => {
  try {
    const { threadId } = req.params
    const { content } = req.body
    const userId = req.user.id

    const thread = await DiscussionThread.findById(threadId)
    if (!thread) {
      return res.status(404).json({ success: false, error: 'Thread not found' })
    }

    const comment = await DiscussionComment.create({
      thread: threadId,
      author: userId,
      content,
    })

    // Update thread reply count and last activity
    await DiscussionThread.findByIdAndUpdate(threadId, {
      $inc: { replies: 1 },
      lastActivityAt: new Date(),
    })

    await comment.populate('author', 'name avatar')

    res.status(201).json({ success: true, data: comment })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Update thread
exports.updateThread = async (req, res) => {
  try {
    const thread = await DiscussionThread.findById(req.params.id)
    if (!thread) {
      return res.status(404).json({ success: false, error: 'Thread not found' })
    }

    if (thread.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this thread',
      })
    }

    const updated = await DiscussionThread.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar')

    res.status(200).json({ success: true, data: updated })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Update comment
exports.updateComment = async (req, res) => {
  try {
    const comment = await DiscussionComment.findById(req.params.id)
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' })
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this comment',
      })
    }

    const updated = await DiscussionComment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar')

    res.status(200).json({ success: true, data: updated })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await DiscussionComment.findById(req.params.id)
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' })
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this comment',
      })
    }

    const thread = await DiscussionThread.findById(comment.thread)
    await DiscussionComment.findByIdAndDelete(req.params.id)
    await DiscussionThread.findByIdAndUpdate(thread._id, {
      $inc: { replies: -1 },
    })

    res.status(200).json({ success: true, data: {} })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Like comment
exports.likeComment = async (req, res) => {
  try {
    const comment = await DiscussionComment.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    ).populate('author', 'name avatar')

    res.status(200).json({ success: true, data: comment })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}
