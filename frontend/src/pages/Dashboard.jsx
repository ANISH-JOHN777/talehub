import { useEffect, useState, Suspense, lazy } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { BookOpen, Sparkles, Star, User, Users } from 'lucide-react'
import BadgeShowcase from '../components/BadgeShowcase'
import Leaderboard from '../components/Leaderboard'
import { Canvas3DErrorBoundary } from '../components/3d/ErrorBoundary'

const BookCarousel3D = lazy(() => import('../components/3d/BookCarousel3D'))

export default function Dashboard() {
  const { user, token } = useAuth()
  const navigate = useNavigate()

  // Enrolled Books State
  const [enrolledBooks, setEnrolledBooks] = useState([])
  const [booksLoading, setBooksLoading] = useState(true)
  const [booksError, setBooksError] = useState(null)

  // Upcoming Sessions State
  const [upcomingSessions, setUpcomingSessions] = useState([])
  const [sessionsLoading, setSessionsLoading] = useState(true)
  const [sessionsError, setSessionsError] = useState(null)

  // Join Session State
  const [joiningSession, setJoiningSession] = useState(null)

  // Fetch Enrolled Books
  useEffect(() => {
    const fetchEnrolledBooks = async () => {
      try {
        setBooksLoading(true)
        setBooksError(null)

        // Get current user with enrolled books
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await response.json()

        if (data.success && data.data.enrolledBooks) {
          // Fetch full book details for each enrolled book
          const bookDetailsPromises = data.data.enrolledBooks.map(bookId =>
            fetch(`http://localhost:5000/api/books/${bookId}`).then(r => r.json())
          )

          const bookResponses = await Promise.all(bookDetailsPromises)
          const books = bookResponses
            .filter(r => r.success)
            .map(r => r.data)

          setEnrolledBooks(books)
        } else {
          setEnrolledBooks([])
        }
      } catch (err) {
        setBooksError('Failed to load enrolled books')
        console.error('Error fetching enrolled books:', err)
      } finally {
        setBooksLoading(false)
      }
    }

    if (token) {
      fetchEnrolledBooks()
    }
  }, [token])

  // Fetch Upcoming Sessions
  useEffect(() => {
    const fetchUpcomingSessions = async () => {
      try {
        setSessionsLoading(true)
        setSessionsError(null)

        const response = await fetch('http://localhost:5000/api/sessions')
        const data = await response.json()

        if (data.success) {
          // Filter for upcoming sessions only and limit to 5
          const upcoming = data.data
            .filter(session => {
              const sessionDate = new Date(session.date)
              return sessionDate > new Date() && session.status === 'upcoming'
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5)

          setUpcomingSessions(upcoming)
        } else {
          setUpcomingSessions([])
        }
      } catch (err) {
        setSessionsError('Failed to load upcoming sessions')
        console.error('Error fetching sessions:', err)
      } finally {
        setSessionsLoading(false)
      }
    }

    fetchUpcomingSessions()
  }, [])

  // Handle Join Session
  const handleJoinSession = async (sessionId, meetLink) => {
    try {
      setJoiningSession(sessionId)

      const response = await fetch(`http://localhost:5000/api/sessions/${sessionId}/join`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json()

      if (data.success) {
        // Open meet link in new tab
        window.open(meetLink, '_blank')

        // Update session attendees count
        setUpcomingSessions(prev =>
          prev.map(s =>
            s._id === sessionId
              ? { ...s, attendees: data.data.session?.attendees || s.attendees }
              : s
          )
        )
      } else {
        alert('Failed to join session: ' + (data.error || 'Unknown error'))
      }
    } catch (err) {
      alert('Error joining session')
      console.error('Error joining session:', err)
    } finally {
      setJoiningSession(null)
    }
  }

  // Navigate to book details
  const navigateToBook = (bookId) => {
    navigate(`/books/${bookId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-cream to-slate-gray/10 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
            Welcome back, {user?.name || 'Reader'}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Track your reading journey and join study sessions
          </p>
        </motion.div>

        {/* 3D Book Carousel Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-gray/10">
            <h2 className="text-2xl font-bold text-slate-gray p-6 bg-gradient-to-r from-warm-cream to-slate-gray/5">
              Featured Books in 3D
            </h2>
            <div className="h-96 w-full">
              <Canvas3DErrorBoundary>
                <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-warm-cream to-slate-gray/10 flex items-center justify-center"><span className="text-slate-gray">Loading 3D visualization...</span></div>}>
                  <BookCarousel3D />
                </Suspense>
              </Canvas3DErrorBoundary>
            </div>
          </div>
        </motion.div>

        {/* Enrolled Books Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BookOpen size={32} className="text-slate-gray" strokeWidth={1.5} />
              Your Books
            </h2>
            <button
              onClick={() => navigate('/books')}
              className="px-4 py-2 bg-slate-gray text-warm-cream rounded-lg hover:bg-soft-black transition font-medium"
            >
              Browse More Books
            </button>
          </div>

          {booksError && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              ⚠️ {booksError}
            </div>
          )}

          {booksLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
              ))}
            </div>
          ) : enrolledBooks.length === 0 ? (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-12 text-center">
              <div className="flex justify-center mb-4">
                <BookOpen size={64} className="text-slate-gray/30" strokeWidth={1} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Books Yet</h3>
              <p className="text-gray-600 mb-6">
                Start your reading journey by enrolling in books
              </p>
              <button
                onClick={() => navigate('/books')}
                className="px-6 py-3 bg-slate-gray text-warm-cream rounded-lg hover:bg-soft-black transition font-semibold"
              >
                Explore Books
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledBooks.map(book => (
                <div
                  key={book._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer group"
                  onClick={() => navigateToBook(book._id)}
                >
                  {/* Book Cover */}
                  <div className="bg-gradient-to-br from-slate-gray to-soft-black h-48 flex items-center justify-center relative overflow-hidden">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="text-white text-6xl">📕</div>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{book.author}</p>

                    {/* Book Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>📄 {book.pages} pages</span>
                      <div className="flex items-center gap-2">
                        <Star size={18} className="fill-yellow-400 text-yellow-400" />
                        <span>{book.rating || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="inline-block px-3 py-1 bg-slate-gray/20 text-slate-gray rounded-full text-xs font-semibold mb-4">
                      {book.category}
                    </div>

                    {/* View Button */}
                    <button className="w-full py-2 bg-warm-cream text-slate-gray rounded-lg hover:bg-slate-gray/10 transition font-semibold text-sm border border-slate-gray/20">
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Upcoming Sessions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">🎥 Upcoming Sessions</h2>

          {sessionsError && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              ⚠️ {sessionsError}
            </div>
          )}

          {sessionsLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-200 rounded-lg h-48 animate-pulse" />
              ))}
            </div>
          ) : upcomingSessions.length === 0 ? (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-12 text-center">
              <div className="flex justify-center mb-4">
                <Sparkles size={64} className="text-slate-gray/30" strokeWidth={1} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Sessions Yet</h3>
              <p className="text-gray-600">
                Check back soon for upcoming study sessions
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingSessions.map(session => {
                const sessionDate = new Date(session.date)
                const isUpcoming = sessionDate > new Date()

                return (
                  <div
                    key={session._id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden border-l-4 border-indigo-500"
                  >
                    {/* Session Header */}
                    <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold mb-2">{session.title}</h3>
                          <div className="flex items-center gap-2 text-sm">
                            📅{' '}
                            {sessionDate.toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}{' '}
                            at{' '}
                            {sessionDate.toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
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
                    </div>

                    {/* Session Body */}
                    <div className="p-5">
                      {/* Description */}
                      {session.description && (
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {session.description}
                        </p>
                      )}

                      {/* Session Details */}
                      <div className="space-y-3 mb-5 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <User size={18} className="text-slate-gray" />
                            Reading Solo
                          </span>
                          Led by <strong>{session.createdBy?.name || 'Unknown'}</strong>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Users size={18} className="text-slate-gray" />
                            Group Session
                          </span>
                          <strong>{session.attendees?.length || 0}</strong> attending
                        </div>
                      </div>

                      {/* Join Button */}
                      <button
                        onClick={() => handleJoinSession(session._id, session.meetLink)}
                        disabled={!isUpcoming || joiningSession === session._id}
                        className={`w-full py-3 rounded-lg font-semibold transition ${
                          isUpcoming
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
                            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        } ${joiningSession === session._id ? 'opacity-50' : ''}`}
                      >
                        {joiningSession === session._id ? (
                          <>⏳ Joining...</>
                        ) : isUpcoming ? (
                          <>🎥 Join Session</>
                        ) : (
                          <>Session Ended</>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Badges Section */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <BadgeShowcase />
        </motion.div>

        {/* Leaderboard Section */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Leaderboard />
        </motion.div>
      </motion.div>
    </div>
  )
}
