const mongoose = require('mongoose')

const DiscussionCommentSchema = new mongoose.Schema(
  {
    thread: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DiscussionThread',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    likes: {
      type: Number,
      default: 0,
    },
    isMarkedAnswer: {
      type: Boolean,
      default: false,
    },
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
)

DiscussionCommentSchema.index({ thread: 1, createdAt: 1 })
DiscussionCommentSchema.index({ author: 1 })

module.exports = mongoose.model('DiscussionComment', DiscussionCommentSchema)
