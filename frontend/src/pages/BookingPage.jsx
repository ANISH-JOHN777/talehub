import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { BookOpen, Calendar, DollarSign, Check } from 'lucide-react'

export default function BookingPage() {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [book, setBook] = useState(null)
  const [dates, setDates] = useState([])
  const [selectedDates, setSelectedDates] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    fetchBook()
    fetchAvailableDates()
  }, [bookId])

  const fetchBook = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/books/${bookId}`)
      const data = await response.json()
      if (data.success) {
        setBook(data.data)
      }
    } catch (err) {
      console.error('Error fetching book:', err)
    }
  }

  const fetchAvailableDates = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/dates/${bookId}`)
      const data = await response.json()
      if (data.success) {
        setDates(data.data)
        setLoading(false)
      }
    } catch (err) {
      console.error('Error fetching dates:', err)
      setLoading(false)
    }
  }

  const toggleDateSelection = (date) => {
    if (selectedDates.includes(date)) {
      setSelectedDates(selectedDates.filter(d => d !== date))
    } else {
      setSelectedDates([...selectedDates, date].sort())
    }
  }

  useEffect(() => {
    if (selectedDates.length > 0) {
      const total = selectedDates.length * (book?.pricePerDay || 9.99)
      setTotalPrice(total)
    } else {
      setTotalPrice(0)
    }
  }, [selectedDates, book])

  const handleBooking = async () => {
    if (selectedDates.length === 0) {
      alert('Please select at least one date')
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId,
          selectedDates: selectedDates.map(date => ({
            date,
            price: book.pricePerDay,
            selected: true,
          })),
          totalPrice,
        }),
      })

      const data = await response.json()
      if (data.success) {
        navigate(`/payment/${data.data._id}`)
      } else {
        alert('Booking failed: ' + data.error)
      }
    } catch (err) {
      console.error('Error creating booking:', err)
      alert('Error creating booking')
    }
  }

  if (loading || !book) {
    return <div className="min-h-screen bg-warm-cream flex items-center justify-center">Loading...</div>
  }

  return (
    <motion.div
      className="min-h-screen bg-warm-cream py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="bg-white rounded-lg shadow-lg p-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Book Info */}
          <div className="flex gap-8 mb-12">
            <motion.div
              className="flex-shrink-0"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-32 h-48 bg-gradient-to-br from-slate-gray to-soft-black rounded-lg flex items-center justify-center">
                <BookOpen size={48} className="text-warm-cream" />
              </div>
            </motion.div>

            <motion.div
              className="flex-1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-3xl font-bold text-soft-black mb-2">{book.title}</h1>
              <p className="text-slate-gray text-lg mb-4">by {book.author}</p>
              <p className="text-gray-600 mb-6">{book.description}</p>
              <div className="flex gap-6">
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-semibold text-slate-gray">{book.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="font-semibold text-slate-gray">{book.rating}/5</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price Per Day</p>
                  <p className="font-semibold text-soft-black text-xl">${book.pricePerDay}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Date Selection */}
          <motion.div
            className="mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-soft-black mb-6 flex items-center gap-2">
              <Calendar size={28} className="text-slate-gray" />
              Select Dates
            </h2>

            <div className="grid grid-cols-5 md:grid-cols-7 gap-2">
              {dates.map((dateObj, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => toggleDateSelection(dateObj.date)}
                  className={`p-3 rounded-lg font-medium transition ${
                    selectedDates.includes(dateObj.date)
                      ? 'bg-slate-gray text-warm-cream shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {new Date(dateObj.date).getDate()}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Booking Summary */}
          <motion.div
            className="bg-gradient-to-r from-warm-cream to-slate-gray/5 p-6 rounded-lg mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-semibold text-soft-black">Selected Days</p>
              <p className="text-2xl font-bold text-slate-gray">{selectedDates.length}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold text-soft-black flex items-center gap-2">
                <DollarSign size={20} />
                Total Price
              </p>
              <p className="text-3xl font-bold text-soft-black">${totalPrice.toFixed(2)}</p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border-2 border-slate-gray text-slate-gray rounded-lg font-semibold hover:bg-slate-gray hover:text-warm-cream transition"
            >
              Go Back
            </button>
            <button
              onClick={handleBooking}
              disabled={selectedDates.length === 0}
              className="flex-1 px-6 py-3 bg-slate-gray text-warm-cream rounded-lg font-semibold hover:bg-soft-black transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Proceed to Payment
            </button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
