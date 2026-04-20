const mongoose = require('mongoose')

const enrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instructor',
      required: true,
    },
    tier: {
      type: String,
      enum: ['Basic', 'Pro', 'Premium'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Cancelled'],
      default: 'Active',
    },
    progress: {
      sessionsAttended: {
        type: Number,
        default: 0,
      },
      sessionsCompleted: {
        type: Number,
        default: 0,
      },
      percentComplete: {
        type: Number,
        default: 0,
      },
      notes: [
        {
          sessionId: mongoose.Schema.Types.ObjectId,
          content: String,
          createdAt: { type: Date, default: Date.now },
        },
      ],
      savedResources: [
        {
          title: String,
          url: String,
          savedAt: { type: Date, default: Date.now },
        },
      ],
    },
    paymentDetails: {
      transactionId: String,
      paymentMethod: String,
      paidAt: Date,
      amount: Number,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
    certificateIssued: {
      type: Boolean,
      default: false,
    },
    certificateUrl: String,
  },
  { timestamps: true }
)

// Unique constraint: user can only enroll once per program (at a time)
enrollmentSchema.index({ user: 1, program: 1 }, { unique: true, sparse: true })

module.exports = mongoose.model('Enrollment', enrollmentSchema)
