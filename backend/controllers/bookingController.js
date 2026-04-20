const Booking = require('../models/Booking')
const Book = require('../models/Book')
const User = require('../models/User')
const crypto = require('crypto')
const Razorpay = require('razorpay')

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
})


// Get available dates for a book
exports.getAvailableDates = async (req, res) => {
  try {
    const { bookId } = req.params
    const book = await Book.findById(bookId)

    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' })
    }

    // Generate 30 days of availability starting from today
    const dates = []
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      dates.push({
        date: date.toISOString().split('T')[0],
        price: book.pricePerDay || 9.99,
        available: true,
      })
    }

    res.json({ success: true, data: dates })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { bookId, selectedDates, totalPrice } = req.body
    const userId = req.user._id

    const book = await Book.findById(bookId)
    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' })
    }

    const booking = new Booking({
      userId,
      bookId,
      sessionDates: selectedDates,
      totalDays: selectedDates.length,
      totalPrice,
      startDate: selectedDates[0]?.date,
      endDate: selectedDates[selectedDates.length - 1]?.date,
    })

    await booking.save()
    await booking.populate('bookId userId')

    res.status(201).json({ success: true, data: booking })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id
    const bookings = await Booking.find({ userId })
      .populate('bookId')
      .sort({ createdAt: -1 })

    res.json({ success: true, data: bookings })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params
    const booking = await Booking.findById(id).populate('bookId userId')

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' })
    }

    res.json({ success: true, data: booking })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// Create Razorpay order
exports.createPaymentOrder = async (req, res) => {
  try {
    const { bookingId } = req.body
    const booking = await Booking.findById(bookingId)

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' })
    }

    // Check if booking already has a payment order
    if (booking.paymentId && booking.paymentStatus === 'initiated') {
      return res.json({
        success: true,
        data: {
          orderId: booking.paymentId,
          amount: booking.totalPrice,
          currency: 'INR',
        },
      })
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(booking.totalPrice * 100), // Amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `booking_${bookingId}_${Date.now()}`,
      notes: {
        bookingId: bookingId.toString(),
        userId: booking.userId.toString(),
        bookId: booking.bookId.toString(),
      },
    }

    const order = await razorpay.orders.create(options)

    // Save order ID to booking
    booking.paymentId = order.id
    booking.paymentStatus = 'initiated'
    await booking.save()

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: process.env.RAZORPAY_KEY_ID,
      },
    })
  } catch (err) {
    console.error('Payment order error:', err)
    res.status(500).json({ success: false, error: err.message })
  }
}

// Verify and process payment
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body
    const booking = await Booking.findOne({ paymentId: orderId })

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' })
    }

    // Verify signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    hmac.update(orderId + '|' + paymentId)
    const generated_signature = hmac.digest('hex')

    if (generated_signature !== signature) {
      return res.status(400).json({ success: false, error: 'Payment verification failed' })
    }

    // Update booking with payment details
    booking.paymentId = paymentId
    booking.paymentStatus = 'paid'
    booking.status = 'confirmed'
    booking.save()

    res.json({
      success: true,
      message: 'Payment verified and confirmed',
      data: booking,
    })
  } catch (err) {
    console.error('Payment verification error:', err)
    res.status(500).json({ success: false, error: err.message })
  }
}

// Process payment (legacy - kept for backward compatibility)
exports.processPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod, cardDetails } = req.body
    const booking = await Booking.findById(bookingId)

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' })
    }

    // Use Razorpay payment order endpoint
    if (!booking.paymentId) {
      return res.status(400).json({
        success: false,
        error: 'Please create payment order first',
      })
    }

    // Simulate payment processing (in production, webhook handles this)
    booking.paymentStatus = 'paid'
    booking.status = 'confirmed'
    await booking.save()

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        booking,
        paymentId: booking.paymentId,
        amount: booking.totalPrice,
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params
    const booking = await Booking.findById(id)

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' })
    }

    booking.status = 'cancelled'
    await booking.save()

    res.json({ success: true, message: 'Booking cancelled', data: booking })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}
