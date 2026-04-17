import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { CreditCard, Lock, CheckCircle } from 'lucide-react'

export default function PaymentPage() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    email: '',
  })

  useEffect(() => {
    fetchBooking()
  }, [bookingId])

  const fetchBooking = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) {
        setBooking(data.data)
      }
      setLoading(false)
    } catch (err) {
      console.error('Error fetching booking:', err)
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    
    if (!formData.cardName || !formData.cardNumber || !formData.expiryDate || !formData.cvv) {
      alert('Please fill in all payment details')
      return
    }

    setProcessing(true)
    
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentMethod: 'credit_card',
          cardDetails: {
            name: formData.cardName,
            number: formData.cardNumber.slice(-4),
            expiry: formData.expiryDate,
          },
        }),
      })

      const data = await response.json()
      if (data.success) {
        setPaymentSuccess(true)
        setTimeout(() => {
          navigate('/dashboard')
        }, 3000)
      } else {
        alert('Payment failed: ' + data.error)
      }
    } catch (err) {
      console.error('Error processing payment:', err)
      alert('Error processing payment')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-warm-cream flex items-center justify-center">Loading...</div>
  }

  if (!booking) {
    return <div className="min-h-screen bg-warm-cream flex items-center justify-center">Booking not found</div>
  }

  if (paymentSuccess) {
    return (
      <motion.div
        className="min-h-screen bg-warm-cream flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle size={64} className="text-green-500 mx-auto" />
          </motion.div>
          <h2 className="text-2xl font-bold text-soft-black mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Your booking has been confirmed. You will be redirected to your dashboard shortly.</p>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Payment ID</p>
            <p className="font-mono text-soft-black">{booking.paymentId}</p>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="min-h-screen bg-warm-cream py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="bg-white rounded-lg shadow-lg p-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-soft-black mb-8">Complete Payment</h1>

          {/* Booking Summary */}
          <motion.div
            className="bg-gradient-to-r from-warm-cream to-slate-gray/5 p-6 rounded-lg mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600">Book</p>
                <p className="font-semibold text-soft-black">{booking.bookId.title}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold text-soft-black">{booking.totalDays} day(s)</p>
              </div>
            </div>
            <div className="border-t border-slate-gray/20 pt-4 flex justify-between items-center">
              <p className="font-semibold text-soft-black">Total Amount</p>
              <p className="text-2xl font-bold text-slate-gray">${booking.totalPrice.toFixed(2)}</p>
            </div>
          </motion.div>

          {/* Payment Form */}
          <motion.form
            onSubmit={handlePayment}
            className="space-y-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Card Holder Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name</label>
              <input
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-gray focus:border-transparent outline-none"
              />
            </div>

            {/* Card Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg">
                <CreditCard size={20} className="text-gray-400" />
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className="flex-1 outline-none"
                />
              </div>
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-gray focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg">
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength="4"
                    className="flex-1 outline-none"
                  />
                  <Lock size={16} className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-gray focus:border-transparent outline-none"
              />
            </div>

            {/* Security Note */}
            <motion.div
              className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Lock size={20} className="text-blue-600 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                Your payment information is secure and encrypted. We never store full card details.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border-2 border-slate-gray text-slate-gray rounded-lg font-semibold hover:bg-slate-gray hover:text-warm-cream transition disabled:opacity-50"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={processing}
                className="flex-1 px-6 py-3 bg-slate-gray text-warm-cream rounded-lg font-semibold hover:bg-soft-black transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : `Pay $${booking.totalPrice.toFixed(2)}`}
              </button>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </motion.div>
  )
}
