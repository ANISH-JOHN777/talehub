const mongoose = require('mongoose')

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    sessionDates: [
      {
        date: Date,
        price: Number,
        selected: Boolean,
      },
    ],
    totalDays: {
      type: Number,
      default: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
    paymentId: String,
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    startDate: Date,
    endDate: Date,
    notes: String,
  },
  { timestamps: true }
)

module.exports = mongoose.model('Booking', BookingSchema)
