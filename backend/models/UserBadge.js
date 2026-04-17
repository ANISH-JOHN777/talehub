const mongoose = require('mongoose')

const UserBadgeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    badge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge',
      required: true,
    },
    earnedAt: {
      type: Date,
      default: Date.now,
    },
    progress: {
      current: {
        type: Number,
        default: 0,
      },
      required: {
        type: Number,
        default: 1,
      },
    },
  },
  { timestamps: true }
)

UserBadgeSchema.index({ user: 1, badge: 1 }, { unique: true })

module.exports = mongoose.model('UserBadge', UserBadgeSchema)
