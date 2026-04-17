const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'session_reminder',
        'session_invitation',
        'new_member_joined',
        'book_recommendation',
        'friend_joined',
        'achievement_unlocked',
        'review_reply',
        'discussion_reply',
        'subscription_expiring',
        'system_announcement',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },
    relatedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    relatedBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
    },
    relatedSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
    },
    link: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    actionUrl: {
      type: String,
    },
  },
  { timestamps: true }
)

NotificationSchema.index({ user: 1, isRead: 1, createdAt: -1 })
NotificationSchema.index({ user: 1, createdAt: -1 })

module.exports = mongoose.model('Notification', NotificationSchema)
