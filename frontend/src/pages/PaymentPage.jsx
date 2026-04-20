import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { CreditCard, Lock, CheckCircle, AlertCircle, X } from 'lucide-react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

export default function PaymentPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [error, setError] = useState('')

  // Get enrollment data from location state
  const enrollmentData = location.state?.enrollmentData || JSON.parse(sessionStorage.getItem('pendingEnrollment') || '{}')

  const [formData, setFormData] = useState({
    cardName: user?.name || '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    email: user?.email || '',
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
    if (!enrollmentData.programId) {
      navigate('/programs')
    }
  }, [user, enrollmentData, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    let processedValue = value

    // Format card number with spaces
    if (name === 'cardNumber') {
      processedValue = value.replace(/\s/g, '').slice(0, 16)
      processedValue = processedValue.match(/.{1,4}/g)?.join(' ') || processedValue
    }

    // Format expiry date
    if (name === 'expiryDate') {
      processedValue = value.replace(/\D/g, '').slice(0, 4)
      if (processedValue.length >= 2) {
        processedValue = processedValue.slice(0, 2) + '/' + processedValue.slice(2)
      }
    }

    // Limit CVV to 3-4 digits
    if (name === 'cvv') {
      processedValue = value.replace(/\D/g, '').slice(0, 4)
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }))
    setError('')
  }

  const validateForm = () => {
    if (!formData.cardName.trim()) {
      setError('Cardholder name is required')
      return false
    }
    if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Please enter a valid 16-digit card number')
      return false
    }
    if (!formData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
      setError('Expiry date must be in MM/YY format')
      return false
    }
    if (formData.cvv.length < 3 || formData.cvv.length > 4) {
      setError('CVV must be 3-4 digits')
      return false
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address')
      return false
    }
    return true
  }

  const handlePayment = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setProcessing(true)
    try {
      const token = localStorage.getItem('authToken')

      // Step 1: Process Payment (Simulated)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Step 2: Create Enrollment
      const enrollmentPayload = {
        programId: enrollmentData.programId,
        instructorId: enrollmentData.instructorId,
        sessionType: enrollmentData.sessionType,
        sessionCount: enrollmentData.sessionCount,
        customizedSessions: enrollmentData.customizedSessions,
        phoneNumber: enrollmentData.phoneNumber,
        price: enrollmentData.price,
        tier: enrollmentData.tier,
        paymentDetails: {
          transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          paymentMethod: 'Credit Card',
          amount: enrollmentData.price,
          cardLast4: formData.cardNumber.slice(-4),
        },
      }

      const response = await axios.post(`${API_URL}/enrollments`, enrollmentPayload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        // Clear session storage
        sessionStorage.removeItem('pendingEnrollment')

        setPaymentSuccess(true)

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard', {
            state: {
              enrollmentSuccess: true,
              enrollmentId: response.data.data._id,
            },
          })
        }, 3000)
      }
    } catch (error) {
      console.error('Payment error:', error)
      setError(
        error.response?.data?.message ||
          'Payment processing failed. Please try again or contact support.'
      )
    } finally {
      setProcessing(false)
    }
  }

  if (!enrollmentData.programId) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center pt-24">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-slate-gray text-lg">No enrollment data found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-cream pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success State */}
        {paymentSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="bg-white rounded-2xl p-12 text-center max-w-md shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                  <CheckCircle size={48} className="text-white" />
                </div>
              </motion.div>
              <h2 className="text-2xl font-bold text-dark-blue mb-2">Payment Successful!</h2>
              <p className="text-slate-600 mb-2">
                Your enrollment has been confirmed. Transaction ID:{' '}
              </p>
              <p className="font-mono text-sm bg-slate-100 p-3 rounded mb-6 text-slate-700">
                {enrollmentData.paymentDetails?.transactionId || `TXN_${Date.now()}`}
              </p>
              <p className="text-slate-600 mb-6">
                You will be redirected to your dashboard shortly...
              </p>
              <div className="w-full bg-slate-200 rounded-full h-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3 }}
                  className="h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h1 className="text-2xl font-bold text-dark-blue mb-2">Secure Payment</h1>
              <p className="text-slate-600 mb-8">Complete your enrollment by entering payment details</p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
                >
                  <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handlePayment} className="space-y-6">
                {/* Cardholder Name */}
                <div>
                  <label className="block text-sm font-semibold text-dark-blue mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-gray outline-none"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-dark-blue mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-gray outline-none"
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-sm font-semibold text-dark-blue mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3.5 text-slate-400" size={20} />
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-gray outline-none"
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-1">16-digit card number</p>
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark-blue mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-gray outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark-blue mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength="4"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-gray outline-none"
                    />
                  </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-4 rounded-lg">
                  <Lock size={16} className="text-green-600" />
                  <span>Your payment information is encrypted and secure</span>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={processing}
                  className="w-full bg-slate-gray text-warm-cream py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <span className="inline-block animate-spin">⏳</span>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock size={20} />
                      Pay ₹{enrollmentData.price}
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-32 space-y-6"
            >
              {/* Summary Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-dark-blue mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Session Type</span>
                    <span className="font-semibold text-dark-blue capitalize">
                      {enrollmentData.sessionType === 'human' ? 'Live with Expert' : 'AI-Powered'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Total Sessions</span>
                    <span className="font-semibold text-dark-blue">{enrollmentData.sessionCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Price per Session</span>
                    <span className="font-semibold text-dark-blue">
                      ₹{enrollmentData.sessionType === 'human' ? 50 : 25}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-4 flex justify-between">
                    <span className="font-bold text-dark-blue">Total Amount</span>
                    <span className="text-2xl font-bold text-slate-gray">
                      ₹{enrollmentData.price}
                    </span>
                  </div>
                </div>

                {/* Phone Number Confirmation */}
                <div className="bg-slate-50 rounded-lg p-4 mb-6">
                  <p className="text-xs font-semibold text-slate-600 mb-1">CONTACT NUMBER</p>
                  <p className="text-lg font-bold text-dark-blue">+91 {enrollmentData.phoneNumber}</p>
                  <p className="text-xs text-slate-600 mt-2">Session reminders will be sent to this number</p>
                </div>

                {/* Sessions Preview */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-slate-600 mb-3">FIRST 3 SESSIONS</p>
                  <div className="space-y-2">
                    {enrollmentData.customizedSessions?.slice(0, 3).map((session, index) => (
                      <div key={index} className="text-xs text-slate-700">
                        <p className="font-semibold">
                          Session {index + 1}: {new Date(session.date).toLocaleDateString()}
                        </p>
                        <p className="text-slate-600">{session.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Test Card Info */}
              <div className="bg-slate-100 border border-slate-300 rounded-2xl p-6">
                <p className="text-sm font-bold text-slate-gray mb-3">Test Payment Card</p>
                <div className="space-y-1 text-xs text-slate-gray font-mono">
                  <p>Number: 4111 1111 1111 1111</p>
                  <p>Expiry: 12/25</p>
                  <p>CVV: 123</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
