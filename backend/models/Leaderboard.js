const mongoose = require('mongoose')

const LeaderboardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    totalBooksRead: {
      type: Number,
      default: 0,
    },
    totalPagesRead: {
      type: Number,
      default: 0,
    },
    totalSessionsAttended: {
      type: Number,
      default: 0,
    },
    points: {
      type: Number,
      default: 0,
    },
    badges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge',
      },
    ],
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    rank: {
      type: Number,
      default: null,
    },
    category: {
      type: String,
      enum: ['all_time', 'monthly', 'weekly'],
      default: 'all_time',
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

LeaderboardSchema.index({ points: -1, lastUpdated: -1 })
LeaderboardSchema.index({ currentStreak: -1 })
LeaderboardSchema.index({ totalBooksRead: -1 })

module.exports = mongoose.model('Leaderboard', LeaderboardSchema)
