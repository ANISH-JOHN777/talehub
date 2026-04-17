const mongoose = require('mongoose')

const BadgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    icon: {
      type: String,
      default: 'Trophy',
    },
    category: {
      type: String,
      enum: ['reading', 'community', 'sessions', 'achievement'],
      default: 'achievement',
    },
    criteria: {
      type: String,
      required: true,
      enum: ['first_book', '5_books', '10_books', 'first_session', '10_sessions', 'first_review', '5_reviews', 'discussion_starter', 'helpful_comments'],
    },
    rarity: {
      type: String,
      enum: ['common', 'uncommon', 'rare', 'legendary'],
      default: 'common',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Badge', BadgeSchema)
