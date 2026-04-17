const mongoose = require('mongoose')

const ReadingProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    pagesRead: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    percentComplete: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['not_started', 'reading', 'completed', 'on_hold', 'abandoned'],
      default: 'reading',
    },
    readingStreak: {
      type: Number,
      default: 1,
    },
    lastReadAt: {
      type: Date,
      default: Date.now,
    },
    sessionMinutes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

ReadingProgressSchema.index({ user: 1, book: 1 }, { unique: true })
ReadingProgressSchema.index({ user: 1, status: 1 })

module.exports = mongoose.model('ReadingProgress', ReadingProgressSchema)
