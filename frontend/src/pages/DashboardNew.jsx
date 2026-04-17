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
              {enrollments.map((enrollment, i) => (
                <motion.div
                  key={enrollment._id}
                  className="bg-white rounded-xl border border-slate-gray/10 overflow-hidden hover:shadow-lg transition group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/programs/${enrollment.program._id}`)}
                >
                  {/* Header with Image */}
                  <div className="h-40 bg-gradient-to-br from-slate-gray/20 to-slate-gray/5 relative overflow-hidden">
                    <img
                      src={enrollment.program.image}
                      alt={enrollment.program.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Program'
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Title & Status */}
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-soft-black group-hover:text-slate-gray transition flex-1">
                        {enrollment.program.title}
                      </h3>
                      {getStatusBadge(enrollment.status)}
                    </div>

                    {/* Tier Badge */}
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${getTierColor(enrollment.tier)}`}>
                      {enrollment.tier} Plan
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-gray">Progress</span>
                        <span className="text-sm font-bold text-soft-black">{enrollment.progress.percentComplete}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-gray/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-slate-gray to-slate-gray/60 transition-all duration-300"
                          style={{ width: `${enrollment.progress.percentComplete}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-gray/10">
                      <div className="flex items-center gap-2 text-slate-gray">
                        <Calendar size={16} />
                        <span className="text-sm">Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-gray">
                        <Clock size={16} />
                        <span className="text-sm">{enrollment.program.duration.weeks} weeks</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {enrollment.status === 'Active' && (
                      <button className="w-full bg-slate-gray hover:bg-soft-black text-warm-cream py-2 rounded-lg transition font-semibold flex items-center justify-center gap-2">
                        <PlayCircle size={18} /> Join Next Session
                      </button>
                    )}
                    {enrollment.status === 'Completed' && enrollment.certificateIssued && (
                      <button className="w-full bg-green-100 text-green-700 hover:bg-green-200 py-2 rounded-lg transition font-semibold">
                        View Certificate
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
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
          </>
        )}
      </div>
    </div>
  )
}
