import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
  Calendar,
  Clock,
  Users,
  Play,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Video,
  Zap,
  BookOpen,
  Settings,
} from 'lucide-react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

export default function EnrolledCoursesPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedEnrollment, setSelectedEnrollment] = useState(null)
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(location.state?.enrollmentSuccess)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchEnrollments()
  }, [user, navigate])

  const fetchEnrollments = async () => {
    try {
      setLoading(true)
      setError('')
      const token = localStorage.getItem('authToken')
      
      if (!token) {
        setError('You are not logged in. Please login to view your enrolled courses.')
        navigate('/login')
        return
      }

      const response = await axios.get(`${API_URL}/enrollments/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setEnrollments(response.data.data || [])
      } else {
        setEnrollments([])
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error)
      if (error.response?.status === 401) {
        setError('Your session has expired. Please login again.')
        localStorage.removeItem('authToken')
        navigate('/login')
      } else if (error.response?.status === 404) {
        setError('No enrollments found. Start by exploring our programs.')
        setEnrollments([])
      } else {
        setError('Failed to load enrolled courses. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const generateMeetLink = (enrollmentId) => {
    return `https://meet.google.com/${enrollmentId.slice(0, 10)}-${Date.now().toString(36)}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getUpcomingSession = (sessions) => {
    if (!sessions || sessions.length === 0) return null
    const now = new Date()
    return sessions.find((s) => new Date(`${s.date}T${s.time}`) > now)
  }

  const handleJoinSession = (enrollment, session) => {
    const meetLink = generateMeetLink(enrollment._id)
    // In a real scenario, you would open the actual meet link
    window.open(meetLink, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
          <p className="text-slate-gray">Loading your courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-cream pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Notification */}
        <AnimatePresence>
          {enrollmentSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3"
            >
              <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-800">Enrollment Successful!</p>
                <p className="text-sm text-green-700">Your course has been added to your dashboard.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-dark-blue mb-2 tracking-tight" style={{ letterSpacing: '-0.01em' }}>
            My Enrolled Courses
          </h1>
          <p className="text-base text-slate-gray" style={{ letterSpacing: '0.3px', wordSpacing: '0.08em' }}>
            {enrollments.length > 0
              ? `You have ${enrollments.length} active course${enrollments.length !== 1 ? 's' : ''}`
              : 'No courses enrolled yet'}
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
          >
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {enrollments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <BookOpen size={64} className="text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-dark-blue mb-2">No Courses Yet</h2>
            <p className="text-slate-gray mb-8">
              Start your learning journey by enrolling in a program
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/programs')}
              className="bg-slate-gray text-warm-cream px-8 py-3 rounded-lg font-bold inline-flex items-center gap-2"
            >
              Browse Programs <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enrollments List */}
            <div className="lg:col-span-2 space-y-6">
              {enrollments.map((enrollment, index) => {
                const upcomingSession = getUpcomingSession(enrollment.customizedSessions || [])
                return (
                  <motion.div
                    key={enrollment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedEnrollment(enrollment)}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer overflow-hidden group"
                  >
                    {/* Program Image */}
                    <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden relative">
                      <img
                        src={enrollment.program?.image || 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'}
                        alt={enrollment.program?.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300" />
                    </div>
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-dark-blue mb-2">
                            {enrollment.program?.title || 'Program'}
                          </h3>
                          <div className="flex items-center gap-4 flex-wrap">
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-200 text-slate-gray rounded-full text-sm font-semibold capitalize">
                              {enrollment.sessionType === 'human' ? '👨‍🏫 Live' : '🤖 AI'}
                            </span>
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                              {enrollment.sessionCount} Sessions
                            </span>
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                              ₹{enrollment.price}
                            </span>
                          </div>
                          {/* Instructor Info */}
                          {enrollment.instructor && (
                            <div className="mt-3 flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                              {enrollment.instructor.profileImage && (
                                <img
                                  src={enrollment.instructor.profileImage}
                                  alt={enrollment.instructor.name}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              )}
                              <div className="text-sm">
                                <p className="text-xs text-slate-600">Instructor:</p>
                                <p className="font-semibold text-dark-blue text-sm">
                                  {enrollment.instructor.name}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedEnrollment(enrollment)
                          }}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <Settings size={24} />
                        </motion.button>
                      </div>

                      {/* Enrolled Date */}
                      <p className="text-sm text-slate-500 mb-6">
                        Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </p>

                      {/* Next Session */}
                      {upcomingSession && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-slate-50 rounded-lg p-4 mb-6"
                        >
                          <h4 className="font-bold text-dark-blue mb-3 flex items-center gap-2">
                            <Zap size={18} className="text-slate-gray" />
                            Next Session
                          </h4>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-slate-600 mb-1">DATE</p>
                              <p className="font-bold text-dark-blue">{formatDate(upcomingSession.date)}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-600 mb-1">TIME</p>
                              <p className="font-bold text-dark-blue">{formatTime(upcomingSession.time)}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-600 mb-1">ACTION</p>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleJoinSession(enrollment, upcomingSession)
                                }}
                                className="w-full bg-slate-gray text-warm-cream px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-opacity-90"
                              >
                                <Video size={16} />
                                Join
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Progress */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-semibold text-slate-600">Progress</p>
                          <p className="text-sm font-bold text-slate-700">
                            {enrollment.progress?.percentComplete || 0}%
                          </p>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${enrollment.progress?.percentComplete || 0}%`,
                            }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-3 bg-slate-gray rounded-full"
                          />
                        </div>
                      </div>

                      {/* Session Count Info */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <p className="text-slate-600 font-semibold mb-1">Sessions Attended</p>
                          <p className="text-2xl font-bold text-dark-blue">
                            {enrollment.progress?.sessionsAttended || 0}
                          </p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <p className="text-slate-600 font-semibold mb-1">Total Sessions</p>
                          <p className="text-2xl font-bold text-dark-blue">{enrollment.sessionCount}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-3 mt-6">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedEnrollment(enrollment)
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-dark-blue py-2 rounded-lg font-semibold transition-colors"
                        >
                          View Details
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="bg-slate-gray text-warm-cream py-2 rounded-lg font-semibold"
                        >
                          Continue Learning
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Sidebar - Quick Links */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <h3 className="text-xl font-bold text-dark-blue mb-4">Your Progress</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600 font-semibold mb-2">Active Courses</p>
                    <p className="text-4xl font-bold text-slate-gray">{enrollments.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-semibold mb-2">Total Sessions</p>
                    <p className="text-4xl font-bold text-slate-gray">
                      {enrollments.reduce((sum, e) => sum + (e.sessionCount || 0), 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-semibold mb-2">Attended</p>
                    <p className="text-4xl font-bold text-green-600">
                      {enrollments.reduce((sum, e) => sum + (e.progress?.sessionsAttended || 0), 0)}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Browse More */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-slate-gray to-dark-blue rounded-2xl p-6 text-white"
              >
                <h3 className="text-xl font-bold mb-3">Explore More</h3>
                <p className="text-slate-100 text-sm mb-6">
                  Discover more programs to expand your learning
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/programs')}
                  className="w-full bg-white text-slate-gray py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-slate-100"
                >
                  Browse Programs <ArrowRight size={18} />
                </motion.button>
              </motion.div>

              {/* Help Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-slate-100 rounded-2xl p-6 border border-slate-300"
              >
                <h3 className="text-lg font-bold text-slate-gray mb-2">Need Help?</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Check your session details and meet links here.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-slate-gray font-bold text-sm hover:text-dark-blue transition-colors"
                >
                  View FAQ →
                </motion.button>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Session Details Modal */}
      <AnimatePresence>
        {selectedEnrollment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEnrollment(null)}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 pt-24"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <h2 className="text-3xl font-bold text-dark-blue mb-6">
                {selectedEnrollment.program?.title || 'Program'} - Sessions
              </h2>

              {/* All Sessions */}
              <div className="space-y-4 mb-8">
                <h3 className="font-bold text-dark-blue text-lg">All Scheduled Sessions</h3>
                {selectedEnrollment.customizedSessions && selectedEnrollment.customizedSessions.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedEnrollment.customizedSessions.map((session, index) => {
                      const meetLink = generateMeetLink(selectedEnrollment._id)
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-slate-50 rounded-lg p-4 flex items-center justify-between"
                        >
                          <div>
                            <p className="font-bold text-dark-blue">
                              Session {index + 1}
                            </p>
                            <p className="text-sm text-slate-600">
                              {formatDate(session.date)} at {formatTime(session.time)}
                            </p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.open(meetLink, '_blank')}
                            className="bg-slate-gray hover:bg-dark-blue text-white px-4 py-2 rounded-lg font-semibold text-sm"
                          >
                            Join
                          </motion.button>
                        </motion.div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-slate-600">No sessions scheduled yet</p>
                )}
              </div>

              {/* Enrollment Info */}
              <div className="bg-slate-50 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-dark-blue mb-4">Enrollment Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600 font-semibold mb-1">Type</p>
                    <p className="text-dark-blue font-bold capitalize">
                      {selectedEnrollment.sessionType === 'human' ? 'Live with Expert' : 'AI-Powered'}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600 font-semibold mb-1">Contact</p>
                    <p className="text-dark-blue font-bold">+91 {selectedEnrollment.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 font-semibold mb-1">Enrollment Date</p>
                    <p className="text-dark-blue font-bold">
                      {new Date(selectedEnrollment.enrolledAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600 font-semibold mb-1">Total Amount Paid</p>
                    <p className="text-dark-blue font-bold">₹{selectedEnrollment.price}</p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedEnrollment(null)}
                className="w-full bg-slate-gray text-warm-cream py-3 rounded-lg font-bold"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
