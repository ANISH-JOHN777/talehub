import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, CheckCircle, AlertCircle, PlayCircle, BarChart3, Calendar, Trophy, BookOpen } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const API_URL = 'http://localhost:5000/api'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEnrollment, setSelectedEnrollment] = useState(null)
  const [stats, setStats] = useState({
    totalEnrolled: 0,
    inProgress: 0,
    completed: 0,
    upcomingSessions: 0,
  })

  useEffect(() => {
    fetchEnrollments()
  }, [])

  const fetchEnrollments = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.get(`${API_URL}/enrollments/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = response.data.data || []
      setEnrollments(data)

      // Calculate stats
      setStats({
        totalEnrolled: data.length,
        inProgress: data.filter((e) => e.status === 'Active').length,
        completed: data.filter((e) => e.status === 'Completed').length,
        upcomingSessions: data.filter((e) => e.status === 'Active').length,
      })
    } catch (error) {
      console.error('Error fetching enrollments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    if (status === 'Active')
      return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">In Progress</span>
    if (status === 'Completed')
      return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">Completed</span>
    if (status === 'Cancelled')
      return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">Cancelled</span>
  }

  const getTierColor = (tier) => {
    if (tier === 'Premium') return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
    if (tier === 'Pro') return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
    return 'bg-gradient-to-r from-slate-400 to-slate-600 text-white'
  }

  const getUpcomingSession = (enrollment) => {
    if (!enrollment.customizedSessions || enrollment.customizedSessions.length === 0) {
      return null
    }
    const today = new Date()
    return enrollment.customizedSessions.find((session) => new Date(session.date) > today)
  }

  const generateMeetLink = (enrollmentId) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return `https://meet.google.com/${result.slice(0, 3)}-${result.slice(3, 6)}-${result.slice(6)}`
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  const formatTime = (time) => {
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-warm-cream pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold text-soft-black mb-2">Welcome back, {user?.name || 'Learner'}! 👋</h1>
          <p className="text-xl text-slate-gray">Continue your learning journey with TaleHub</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white p-6 rounded-xl border border-slate-gray/10 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-gray font-semibold">Total Enrolled</span>
              <Trophy size={24} className="text-slate-gray" />
            </div>
            <p className="text-4xl font-bold text-soft-black">{stats.totalEnrolled}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-gray/10 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-gray font-semibold">In Progress</span>
              <AlertCircle size={24} className="text-blue-500" />
            </div>
            <p className="text-4xl font-bold text-blue-600">{stats.inProgress}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-gray/10 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-gray font-semibold">Completed</span>
              <CheckCircle size={24} className="text-green-500" />
            </div>
            <p className="text-4xl font-bold text-green-600">{stats.completed}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-gray/10 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-gray font-semibold">Hours Learned</span>
              <BarChart3 size={24} className="text-slate-gray" />
            </div>
            <p className="text-4xl font-bold text-soft-black">{stats.inProgress * 5}h</p>
          </div>
        </motion.div>

        {/* Main Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
            <p className="text-slate-gray">Loading your programs...</p>
          </div>
        ) : enrollments.length === 0 ? (
          <motion.div
            className="bg-white rounded-xl border-2 border-dashed border-slate-gray/20 p-12 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-5xl mb-4"><BookOpen size={48} className="text-slate-gray" /></div>
            <h2 className="text-2xl font-bold text-soft-black mb-2">No Programs Yet</h2>
            <p className="text-lg text-slate-gray mb-6">Start your learning journey today</p>
            <button
              onClick={() => navigate('/programs')}
              className="inline-block bg-slate-gray hover:bg-soft-black text-warm-cream px-8 py-3 rounded-lg font-semibold transition"
            >
              Explore Programs →
            </button>
          </motion.div>
        ) : (
          <>
            {/* Tabs */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-soft-black mb-6">Your Programs</h2>
            </motion.div>

            {/* Programs Grid */}
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, staggerChildren: 0.1 }}
            >
              {enrollments.map((enrollment, i) => {
                const upcomingSession = getUpcomingSession(enrollment)
                return (
                  <motion.div
                    key={enrollment._id}
                    className="bg-white rounded-xl border border-slate-gray/10 overflow-hidden hover:shadow-lg transition group cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {/* Header with Image */}
                    <div className="h-40 bg-gradient-to-br from-slate-gray/20 to-slate-gray/5 relative overflow-hidden">
                      <img
                        src={enrollment.program.image}
                        alt={enrollment.program.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23d4a574%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2220%22 fill=%22%23333%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EProgram Cover%3C/text%3E%3C/svg%3E'
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Title & Status */}
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-soft-black group-hover:text-slate-gray transition flex-1">
                          {enrollment.program.title}
                        </h3>
                        {getStatusBadge(enrollment.status)}
                      </div>

                      {/* Tier Badge */}
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${getTierColor(enrollment.tier)}`}>
                        {enrollment.tier} Plan
                      </div>

                      {/* Upcoming Session */}
                      {upcomingSession && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                          <div className="text-xs font-semibold text-blue-700 mb-1">📅 Next Session</div>
                          <div className="text-sm text-blue-900">
                            <div>{formatDate(upcomingSession.date)} at {formatTime(upcomingSession.time)}</div>
                            {enrollment.sessionType && (
                              <div className="text-xs mt-1">{enrollment.sessionType === 'human' ? '👤 Human' : '🤖 AI'}</div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-slate-gray">Progress</span>
                          <span className="text-xs font-bold text-soft-black">{enrollment.progress.percentComplete}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-gray/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-slate-gray to-slate-gray/60 transition-all duration-300"
                            style={{ width: `${enrollment.progress.percentComplete}%` }}
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-2 mb-4 pb-4 border-b border-slate-gray/10 text-xs">
                        <div className="flex items-center gap-1 text-slate-gray">
                          <Calendar size={14} />
                          <span>{new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-gray">
                          <Clock size={14} />
                          <span>{enrollment.program.duration.weeks}w</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedEnrollment(enrollment)}
                          className="flex-1 bg-slate-gray hover:bg-soft-black text-warm-cream py-2 rounded-lg transition font-semibold text-sm"
                        >
                          View Details
                        </button>
                        {upcomingSession && (
                          <button
                            onClick={() => window.open(generateMeetLink(enrollment._id), '_blank')}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition font-semibold text-sm"
                          >
                            Join Meet
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Browse More Button */}
            {enrollments.length > 0 && (
              <motion.div
                className="mt-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={() => navigate('/programs')}
                  className="inline-block bg-slate-gray hover:bg-soft-black text-warm-cream px-8 py-3 rounded-lg font-semibold transition"
                >
                  Browse More Programs →
                </button>
              </motion.div>
            )}

            {/* Details Modal */}
            {selectedEnrollment && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                <motion.div
                  className="bg-white rounded-2xl max-w-3xl w-full my-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {/* Header */}
                  <div className="bg-slate-gray text-warm-cream p-6 rounded-t-2xl flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{selectedEnrollment.program.title}</h2>
                      <p className="text-warm-cream/80">{selectedEnrollment.sessionType === 'human' ? '👤 Human Expert' : '🤖 AI Expert'} Sessions</p>
                    </div>
                    <button
                      onClick={() => setSelectedEnrollment(null)}
                      className="text-warm-cream hover:text-white text-2xl"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6 max-h-96 overflow-y-auto">
                    {/* Enrollment Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b">
                      <div>
                        <p className="text-xs text-slate-gray">Status</p>
                        <p className="font-bold text-soft-black">{selectedEnrollment.status}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-gray">Plan</p>
                        <p className="font-bold text-soft-black">{selectedEnrollment.tier}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-gray">Price</p>
                        <p className="font-bold text-soft-black">₹{selectedEnrollment.price}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-gray">Enrolled</p>
                        <p className="font-bold text-soft-black">{formatDate(selectedEnrollment.enrolledAt)}</p>
                      </div>
                    </div>

                    {/* Sessions List */}
                    <div>
                      <h3 className="text-lg font-bold text-soft-black mb-4">📅 Session Schedule</h3>
                      {selectedEnrollment.customizedSessions && selectedEnrollment.customizedSessions.length > 0 ? (
                        <div className="space-y-3">
                          {selectedEnrollment.customizedSessions.map((session, idx) => (
                            <div key={idx} className="bg-warm-cream/50 rounded-lg p-4 border border-slate-gray/10">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="font-bold text-soft-black">Session {idx + 1}</p>
                                  <p className="text-sm text-slate-gray">
                                    {formatDate(session.date)} at {formatTime(session.time)}
                                  </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${new Date(session.date) > new Date() ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                  {new Date(session.date) > new Date() ? 'Upcoming' : 'Past'}
                                </span>
                              </div>
                              {new Date(session.date) > new Date() && (
                                <button
                                  onClick={() => window.open(generateMeetLink(selectedEnrollment._id), '_blank')}
                                  className="text-sm bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded transition font-semibold"
                                >
                                  Join Meet Link
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-gray">No sessions scheduled yet</p>
                      )}
                    </div>

                    {/* Progress */}
                    {selectedEnrollment.progress && (
                      <div className="mt-6 pt-6 border-t">
                        <h3 className="text-lg font-bold text-soft-black mb-4">📊 Progress</h3>
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-slate-gray">Overall Progress</span>
                            <span className="text-sm font-bold">{selectedEnrollment.progress.percentComplete}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-gray/20 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-slate-gray to-slate-gray/60"
                              style={{ width: `${selectedEnrollment.progress.percentComplete}%` }}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-gray">Sessions Attended</p>
                            <p className="font-bold text-lg text-soft-black">{selectedEnrollment.progress.sessionsAttended}</p>
                          </div>
                          <div>
                            <p className="text-slate-gray">Total Sessions</p>
                            <p className="font-bold text-lg text-soft-black">{selectedEnrollment.customizedSessions?.length || 0}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="bg-warm-cream/50 p-6 rounded-b-2xl border-t flex gap-3">
                    <button
                      onClick={() => setSelectedEnrollment(null)}
                      className="flex-1 px-4 py-2 bg-slate-gray/20 hover:bg-slate-gray/30 text-soft-black rounded-lg transition font-semibold"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => navigate(`/programs/${selectedEnrollment.program._id}`)}
                      className="flex-1 px-4 py-2 bg-slate-gray hover:bg-soft-black text-warm-cream rounded-lg transition font-semibold"
                    >
                      View Program
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
