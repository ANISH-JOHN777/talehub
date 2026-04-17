import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { BookOpen, Star, Check, Loader, Users, User } from 'lucide-react'
import BookReviews from '../components/BookReviews'
import BookDiscussions from '../components/BookDiscussions'

export default function BookDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token, isAuthenticated } = useAuth()

  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [enrolling, setEnrolling] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [sessions, setSessions] = useState([])
  const [sessionsLoading, setSessionsLoading] = useState(false)
  const [joiningSessions, setJoiningSessions] = useState({})

  // Fetch book details
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:5000/api/books/${id}`)
        const data = await response.json()

        if (data.success) {
          setBook(data.data)
        } else {
          setError(data.error || 'Failed to fetch book')
        }
      } catch (err) {
        setError(err.message || 'Failed to load book')
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [id])

  // Fetch sessions for the book
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setSessionsLoading(true)
        const response = await fetch(`http://localhost:5000/api/sessions/${id}`)
        const data = await response.json()

        if (data.success) {
          setSessions(data.data)
        } else {
          console.error('Error fetching sessions:', data.error)
        }
      } catch (err) {
        console.error('Error fetching sessions:', err)
      } finally {
        setSessionsLoading(false)
      }
    }

    if (id) {
      fetchSessions()
    }
  }, [id])

  // Check enrollment status
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!isAuthenticated || !token) return

      try {
        const response = await fetch(
          `http://localhost:5000/api/enroll/check/${id}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )

        const data = await response.json()
        if (data.success) {
          setIsEnrolled(data.data.isEnrolled)
        }
      } catch (err) {
        console.error('Error checking enrollment:', err)
      }
    }

    checkEnrollment()
  }, [id, isAuthenticated, token])

  // Handle enrollment
  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    try {
      setEnrolling(true)
      setError('')
      setSuccessMessage('')

      const response = await fetch(
        `http://localhost:5000/api/enroll/${id}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const data = await response.json()

      if (data.success) {
        setIsEnrolled(true)
        setSuccessMessage(
          `Successfully enrolled in "${book.title}"! Start reading now.`
        )

        setTimeout(() => {
          setSuccessMessage('')
        }, 5000)
      } else {
        setError(data.error || 'Failed to enroll')
      }
    } catch (err) {
      setError(err.message || 'Enrollment failed')
    } finally {
      setEnrolling(false)
    }
  }

  // Handle unenroll
  const handleUnenroll = async () => {
    try {
      setEnrolling(true)
      setError('')

      const response = await fetch(
        `http://localhost:5000/api/enroll/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const data = await response.json()

      if (data.success) {
        setIsEnrolled(false)
        setSuccessMessage('Unenrolled from book')

        setTimeout(() => {
          setSuccessMessage('')
        }, 3000)
      } else {
        setError(data.error || 'Failed to unenroll')
      }
    } catch (err) {
      setError(err.message || 'Unenrollment failed')
    } finally {
      setEnrolling(false)
    }
  }

  // Join session
  const handleJoinSession = (sessionId, meetLink) => {
    // Open meet link in new tab
    window.open(meetLink, '_blank')
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded w-3/4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-full"></div>
            <div className="h-6 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !book) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <div className="text-red-600 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-900 mb-2">Failed to Load Book</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <button
              onClick={() => navigate('/books')}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition"
            >
              Back to Books
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!book) return null

  return (
    <motion.div
      className="min-h-screen bg-gray-50 py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate('/books')}
          className="text-indigo-600 hover:text-indigo-700 mb-6 flex items-center gap-2 transition"
        >
          ← Back to Books
        </button>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-700">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Book Cover/Image */}
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
              <div className="w-full aspect-[3/4] bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-6xl mb-6">
                {book.cover ? (
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-gray to-soft-black">
                    <BookOpen size={48} className="text-warm-cream" strokeWidth={1.5} />
                  </div>
                )}
              </div>

              {/* Enrollment Button */}
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={isEnrolled ? handleUnenroll : handleEnroll}
                    disabled={enrolling}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
                      isEnrolled
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    } disabled:opacity-50`}
                  >
                    {enrolling ? (
                      <span className="flex items-center gap-2">
                        <Loader size={18} className="animate-spin" />
                        Processing...
                      </span>
                    ) : isEnrolled ? (
                      <span className="flex items-center gap-2">
                        <Check size={18} />
                        Enrolled
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <BookOpen size={18} />
                        Enroll Now
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => navigate(`/booking/${id}`)}
                    className="w-full py-3 px-4 bg-slate-gray text-warm-cream rounded-lg font-semibold hover:bg-soft-black transition"
                  >
                    Book Now
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Sign In to Enroll
                </button>
              )}

              {/* Book Stats */}
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-semibold">
                  <div className="flex items-center gap-2">
                    <Star size={20} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-lg">{book.rating?.toFixed(1) || 'N/A'}/5</span>
                  </div>
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Reviews</span>
                  <span className="font-semibold">{book.reviews || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pages</span>
                  <span className="font-semibold">{book.pages || 'N/A'}</span>
                </div>
                {book.publishedYear && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Published</span>
                    <span className="font-semibold">{book.publishedYear}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Book Information */}
          <motion.div
            className="md:col-span-2 bg-white rounded-lg shadow-lg p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>

            {/* Author */}
            <p className="text-lg text-gray-600 mb-4">
              by <span className="font-semibold">{book.author}</span>
            </p>

            {/* Category Badge */}
            {book.category && (
              <div className="mb-6">
                <span className="inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium">
                  {book.category}
                </span>
              </div>
            )}

            {/* Divider */}
            <hr className="my-6" />

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                {book.description}
              </p>
            </div>

            {/* Additional Info */}
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  RATING
                </h3>
                <div className="flex items-center gap-2">
                  <Star size={32} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold text-gray-900">
                    {book.rating?.toFixed(1) || 'N/A'}
                  </span>
                  <span className="text-gray-600">/ 5</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  CATEGORY
                </h3>
                <p className="text-xl font-medium text-gray-900">
                  {book.category || 'Unknown'}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  PAGES
                </h3>
                <p className="text-xl font-medium text-gray-900">
                  {book.pages || 'N/A'}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  PUBLISHED
                </h3>
                <p className="text-xl font-medium text-gray-900">
                  {book.publishedYear || 'N/A'}
                </p>
              </div>
            </div>

            {/* Enrollment Status */}
            {isAuthenticated && (
              <div className="mt-8 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <p className="text-indigo-900">
                  {isEnrolled
                    ? (
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <Check size={20} />
                        You are enrolled in this book. Start reading now!
                      </div>
                    )
                    : (
                      <div className="flex items-center gap-2 text-slate-gray font-semibold">
                        <BookOpen size={20} />
                        Enroll to start your reading journey!
                      </div>
                    )}
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Study Sessions Section */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Users size={28} className="text-slate-gray" strokeWidth={1.5} />
            Study Sessions
          </h2>

          {sessionsLoading ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <p className="text-gray-600">Loading sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-600">No study sessions scheduled for this book yet.</p>
              <p className="text-gray-500 text-sm mt-2">Check back later or create a session!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sessions.map(session => {
                const sessionDate = new Date(session.date)
                const isUpcoming = sessionDate > new Date()
                const dateString = sessionDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })

                return (
                  <div
                    key={session._id}
                    className={`rounded-lg shadow-lg p-6 transition ${
                      isUpcoming
                        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-indigo-600'
                        : 'bg-gray-50 border-l-4 border-gray-400'
                    }`}
                  >
                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900 flex-1">
                        {session.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          session.status === 'upcoming'
                            ? 'bg-blue-200 text-blue-800'
                            : session.status === 'ongoing'
                              ? 'bg-green-200 text-green-800'
                              : session.status === 'completed'
                                ? 'bg-gray-200 text-gray-800'
                                : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {session.status}
                      </span>
                    </div>

                    {/* Session Details */}
                    <div className="space-y-3 mb-4">
                      {/* Date/Time */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="text-lg">🕐</span>
                        <span>{dateString}</span>
                      </div>

                      {/* Created By */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="flex items-center gap-2 text-slate-gray">
                          <User size={18} />
                          {session.participants.length}
                        </div>
                        <span>Led by {session.createdBy?.name || 'Unknown'}</span>
                      </div>

                      {/* Attendees */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="flex items-center gap-2 text-slate-gray">
                          <Users size={18} />
                          {session.maxParticipants}
                        </div>
                        <span>{session.attendees?.length || 0} attendees</span>
                      </div>

                      {/* Description */}
                      {session.description && (
                        <div className="text-gray-700 text-sm mt-2 p-2 bg-white rounded">
                          {session.description}
                        </div>
                      )}
                    </div>

                    {/* Join Button */}
                    <button
                      onClick={() => handleJoinSession(session._id, session.meetLink)}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
                        isUpcoming
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-gray-400 text-white cursor-not-allowed'
                      }`}
                      disabled={!isUpcoming}
                    >
                      {isUpcoming ? '🎥 Join Session' : 'Session Ended'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <BookReviews bookId={id} />
        </motion.div>

        {/* Discussions Section */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <BookDiscussions bookId={id} />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
