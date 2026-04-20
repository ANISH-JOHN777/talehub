import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Users, Trophy, Zap, Clock, Award, CheckCircle, Star, TrendingUp, ArrowRight } from 'lucide-react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

export default function EnhancedDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [enrolledPrograms, setEnrolledPrograms] = useState([])
  const [stats, setStats] = useState({
    totalHours: 234,
    completedCourses: 5,
    currentStreak: 12,
    totalPoints: 1250,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API_URL}/enrollments/user/${user?.id}`)
      setEnrolledPrograms(response.data.data || [])
    } catch (error) {
      console.error('Error fetching enrollments:', error)
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-cream via-white to-warm-cream pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-soft-black mb-2">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-lg text-slate-gray">Keep learning and growing with TaleHub</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { icon: Clock, label: 'Total Hours', value: stats.totalHours, color: 'from-blue-500 to-blue-600', unit: 'hrs' },
            { icon: CheckCircle, label: 'Completed', value: stats.completedCourses, color: 'from-green-500 to-green-600', unit: 'courses' },
            { icon: Zap, label: 'Current Streak', value: stats.currentStreak, color: 'from-orange-500 to-orange-600', unit: 'days' },
            { icon: Trophy, label: 'Total Points', value: stats.totalPoints, color: 'from-purple-500 to-purple-600', unit: 'pts' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg`}
              variants={itemVariants}
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-2">{stat.label}</p>
                  <p className="text-4xl font-bold">{stat.value}</p>
                  <p className="text-xs opacity-75 mt-1">{stat.unit}</p>
                </div>
                <stat.icon size={48} opacity={0.3} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enrolled Programs */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-soft-black flex items-center gap-3">
                  <BookOpen size={28} className="text-slate-gray" />
                  Your Learning Journey
                </h2>
                <button
                  onClick={() => navigate('/programs')}
                  className="text-slate-gray hover:text-soft-black font-semibold flex items-center gap-2 transition"
                >
                  Explore More <ArrowRight size={18} />
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin">
                    <div className="h-12 w-12 border-4 border-slate-gray border-t-soft-black rounded-full"></div>
                  </div>
                </div>
              ) : enrolledPrograms.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-gray/20 rounded-xl">
                  <BookOpen size={48} className="text-slate-gray/40 mx-auto mb-3" />
                  <p className="text-slate-gray mb-4">You haven't enrolled in any programs yet</p>
                  <button
                    onClick={() => navigate('/programs')}
                    className="bg-slate-gray text-warm-cream px-6 py-2 rounded-lg font-semibold hover:bg-soft-black transition"
                  >
                    Browse Programs
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrolledPrograms.slice(0, 3).map((program, index) => (
                    <motion.div
                      key={program._id}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition"
                      variants={itemVariants}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-soft-black">{program.programId?.title || 'Program'}</h3>
                          <p className="text-sm text-slate-gray mt-1">{program.programId?.category}</p>
                        </div>
                        <span className="bg-warm-cream text-slate-gray px-3 py-1 rounded-full text-xs font-semibold">
                          {program.tier}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-semibold text-slate-gray">Progress</span>
                          <span className="text-sm font-bold text-soft-black">{program.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="bg-gradient-to-r from-slate-gray to-soft-black h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${program.progress || 0}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/programs/${program.programId?._id}`)}
                        className="text-slate-gray hover:text-soft-black font-semibold text-sm flex items-center gap-1 transition"
                      >
                        Continue Learning <ArrowRight size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Achievements & Quick Links */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-soft-black flex items-center gap-2 mb-6">
                <Award size={24} className="text-slate-gray" />
                Achievements
              </h3>
              <div className="space-y-4">
                {[
                  { icon: '🎓', label: 'Course Master', achieved: true },
                  { icon: '🔥', label: 'Week Warrior', achieved: true },
                  { icon: '⭐', label: 'Rising Star', achieved: false },
                  { icon: '🏆', label: 'Champion', achieved: false },
                ].map((achievement, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg ${achievement.achieved ? 'bg-warm-cream/50' : 'bg-gray-50'}`}
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <span className={achievement.achieved ? 'text-soft-black font-semibold' : 'text-slate-gray/50'}>
                      {achievement.label}
                    </span>
                    {achievement.achieved && <CheckCircle size={20} className="text-green-500 ml-auto" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-br from-slate-gray to-soft-black rounded-2xl shadow-lg p-6 text-warm-cream">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp size={24} />
                What's Next?
              </h3>
              <p className="text-sm mb-6 opacity-90">
                Based on your learning, we recommend exploring Advanced Finance courses
              </p>
              <button
                onClick={() => navigate('/programs?category=Finance&level=Advanced')}
                className="w-full bg-warm-cream text-slate-gray hover:bg-white px-4 py-3 rounded-lg font-semibold transition"
              >
                See Recommendations →
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
