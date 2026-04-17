const mongoose = require('mongoose')

const programSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a program title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      lowercase: true,
      sparse: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    longDescription: {
      type: String,
      maxlength: [5000, 'Long description cannot exceed 5000 characters'],
    },
    category: {
      type: String,
      enum: ['Self-Help', 'Business', 'Finance', 'Psychology', 'History', 'Technology', 'Personal Development'],
      required: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    language: {
      type: String,
      default: 'English',
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instructor',
      required: true,
    },
    duration: {
      weeks: { type: Number, default: 1 },
      hours: { type: Number, default: 5 },
    },
    sessions: [
      {
        title: String,
        description: String,
        date: Date,
        duration: Number, // in minutes
        meetLink: String,
        isRecorded: { type: Boolean, default: false },
        recordingLink: String,
      },
    ],
    image: {
      type: String,
      default: 'https://via.placeholder.com/400x300?text=Program',
    },
    thumbnail: {
      type: String,
      default: 'https://via.placeholder.com/200x150?text=Program',
    },
    outcomes: [
      {
        type: String,
      },
    ],
    pricing: {
      type: {
        basic: {
          type: {
            name: { type: String, default: 'Basic' },
            price: { type: Number, default: 199 },
            description: String,
            features: [String],
          },
          default: {},
        },
        pro: {
          type: {
            name: { type: String, default: 'Pro' },
            price: { type: Number, default: 399 },
            description: String,
            features: [String],
          },
          default: {},
        },
        premium: {
          type: {
            name: { type: String, default: 'Premium' },
            price: { type: Number, default: 699 },
            description: String,
            features: [String],
          },
          default: {},
        },
      },
      default: {
        basic: { name: 'Basic', price: 199 },
        pro: { name: 'Pro', price: 399 },
        premium: { name: 'Premium', price: 699 },
      },
    },
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    totalEnrolled: {
      type: Number,
      default: 0,
    },
    maxSeats: {
      type: Number,
      default: 100,
    },
    seatsAvailable: {
      type: Number,
      default: 100,
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Archived'],
      default: 'Published',
    },
    nextBatchDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

// Auto-generate slug from title
programSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
  next()
})

module.exports = mongoose.model('Program', programSchema)
