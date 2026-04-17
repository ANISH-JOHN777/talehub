const mongoose = require('mongoose')

const analyticsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    metrics: {
      totalUsers: {
        type: Number,
        default: 0,
      },
      newUsersToday: {
        type: Number,
        default: 0,
      },
      totalPrograms: {
        type: Number,
        default: 0,
      },
      totalEnrollments: {
        type: Number,
        default: 0,
      },
      newEnrollmentsToday: {
        type: Number,
        default: 0,
      },
      totalRevenue: {
        type: Number,
        default: 0,
      },
      revenueToday: {
        type: Number,
        default: 0,
      },
      conversionRate: {
        type: Number,
        default: 0,
      },
    },
    byProgram: [
      {
        program: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Program',
        },
        enrollments: Number,
        revenue: Number,
        rating: Number,
      },
    ],
    byTier: {
      basic: {
        enrollments: Number,
        revenue: Number,
      },
      pro: {
        enrollments: Number,
        revenue: Number,
      },
      premium: {
        enrollments: Number,
        revenue: Number,
      },
    },
    sessionMetrics: [
      {
        sessionId: mongoose.Schema.Types.ObjectId,
        attendance: Number,
        rating: Number,
        completionRate: Number,
      },
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model('Analytics', analyticsSchema)
