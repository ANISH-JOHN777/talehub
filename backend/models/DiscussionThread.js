const mongoose = require('mongoose')

const DiscussionThreadSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      maxlength: 3000,
    },
    category: {
      type: String,
      enum: ['discussion', 'question', 'spoiler', 'recommendation'],
      default: 'discussion',
    },
    views: {
      type: Number,
      default: 0,
    },
    replies: {
      type: Number,
      default: 0,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

DiscussionThreadSchema.index({ book: 1, isPinned: -1, lastActivityAt: -1 })
DiscussionThreadSchema.index({ author: 1 })

module.exports = mongoose.model('DiscussionThread', DiscussionThreadSchema)
