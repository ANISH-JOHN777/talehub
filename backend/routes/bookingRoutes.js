const express = require('express')
const router = express.Router()
const bookingController = require('../controllers/bookingController')
const { protect } = require('../middleware/auth')

// Get available dates for a book
router.get('/dates/:bookId', bookingController.getAvailableDates)

// Create booking
router.post('/', protect, bookingController.createBooking)

// Get user bookings
router.get('/', protect, bookingController.getUserBookings)

// Get booking by ID
router.get('/:id', protect, bookingController.getBookingById)

// Create Razorpay payment order
router.post('/payment/create-order', protect, bookingController.createPaymentOrder)

// Verify Razorpay payment
router.post('/payment/verify', protect, bookingController.verifyPayment)

// Process payment (legacy endpoint)
router.post('/:bookingId/payment', protect, bookingController.processPayment)

// Cancel booking
router.delete('/:id', protect, bookingController.cancelBooking)

module.exports = router
