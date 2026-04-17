const Booking = require('../models/Booking')
const Book = require('../models/Book')
const User = require('../models/User')

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

// Process payment
exports.processPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod, cardDetails } = req.body
    const booking = await Booking.findById(bookingId)

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' })
    }

    // Simulate payment processing
    const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    booking.paymentId = paymentId
    booking.paymentStatus = 'paid'
    booking.status = 'confirmed'
    await booking.save()

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        booking,
        paymentId,
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
