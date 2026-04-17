const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a session title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
      minlength: [3, 'Title must be at least 3 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide a session date'],
    },
    meetLink: {
      type: String,
      required: [true, 'Please provide a meeting link'],
      match: [
        /^(https?:\/\/)?([a-z0-9]+\.)*[a-z0-9-]+\.[a-z0-9]+/i,
        'Please provide a valid URL',
      ],
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Please provide a book ID'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide creator ID'],
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Session', sessionSchema)
