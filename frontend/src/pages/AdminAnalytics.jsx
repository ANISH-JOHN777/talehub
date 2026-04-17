import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, LineChart, PieChart, TrendingUp, Users, DollarSign, BookOpen, Star } from 'lucide-react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('monthly')

  const token = localStorage.getItem('authToken')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/analytics/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setAnalytics(response.data.data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const mockData = {
    revenue: [
      { month: 'Jan', value: 45000 },
      { month: 'Feb', value: 52000 },
      { month: 'Mar', value: 48000 },
      { month: 'Apr', value: 61000 },
      { month: 'May', value: 55000 },
      { month: 'Jun', value: 67000 },
    ],
    users: [
      { month: 'Jan', value: 150 },
      { month: 'Feb', value: 320 },
      { month: 'Mar', value: 480 },
      { month: 'Apr', value: 710 },
      { month: 'May', value: 920 },
      { month: 'Jun', value: 1240 },
    ],
    topPrograms: [
      { name: 'Atomic Habits', enrollments: 524, revenue: 89000, rating: 4.9 },
      { name: 'Rich Dad Poor Dad', enrollments: 412, revenue: 65000, rating: 4.7 },
      { name: 'Deep Work', enrollments: 389, revenue: 52000, rating: 4.8 },
      { name: 'Thinking Fast and Slow', enrollments: 356, revenue: 48000, rating: 4.6 },
      { name: 'Sapiens', enrollments: 298, revenue: 38000, rating: 4.5 },
    ],
    pricingTierData: [
      { name: 'Basic', value: 35, color: 'bg-blue-500' },
      { name: 'Pro', value: 50, color: 'bg-purple-500' },
      { name: 'Premium', value: 15, color: 'bg-pink-500' },
    ],
  }

  const stats = [
    {
      label: 'Total Revenue',
      value: '₹24,80,000',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-400',
    },
    {
      label: 'Total Users',
      value: '5,240',
      change: '+8.2%',
      icon: Users,
      color: 'text-blue-400',
    },
    {
      label: 'Total Programs',
      value: '47',
      change: '+3 new',
      icon: BookOpen,
      color: 'text-purple-400',
    },
    {
      label: 'Avg Rating',
      value: '4.7/5',
      change: '+0.2',
      icon: TrendingUp,
      color: 'text-yellow-400',
    },
  ]

  return (
    <div className="min-h-screen bg-soft-black pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-8 flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-warm-cream mb-2">Analytics Dashboard</h1>
            <p className="text-warm-cream/60">Track platform performance and user insights</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-gray/20 text-warm-cream px-4 py-2 rounded-lg border border-slate-gray/30 focus:outline-none"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="bg-slate-gray/10 border border-slate-gray/20 p-6 rounded-xl hover:border-slate-gray/40 transition"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`text-3xl ${stat.color}`}>
                  <stat.icon size={32} />
                </div>
                <span className="text-green-400 text-sm font-semibold">{stat.change}</span>
              </div>
              <p className="text-warm-cream/60 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-warm-cream">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts */}
        <motion.div
          className="grid lg:grid-cols-2 gap-8 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Revenue Chart */}
          <div className="bg-slate-gray/10 border border-slate-gray/20 p-8 rounded-xl">
            <h2 className="text-xl font-bold text-warm-cream mb-6 flex items-center gap-2">
              <LineChart size={24} /> Revenue Trend
            </h2>
            <div className="h-64 flex items-end justify-between gap-2">
              {mockData.revenue.map((data, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-slate-gray/30 hover:bg-slate-gray rounded-t transition relative group"
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.value / 70000) * 100}%` }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-warm-cream/60 opacity-0 group-hover:opacity-100 transition">
                    ₹{data.value / 1000}K
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between mt-8 text-warm-cream/60 text-sm">
              {mockData.revenue.map((d) => (
                <span key={d.month}>{d.month}</span>
              ))}
            </div>
          </div>

          {/* User Growth Chart */}
          <div className="bg-slate-gray/10 border border-slate-gray/20 p-8 rounded-xl">
            <h2 className="text-xl font-bold text-warm-cream mb-6 flex items-center gap-2">
              <BarChart3 size={24} /> User Growth
            </h2>
            <div className="h-64 flex items-end justify-between gap-2">
              {mockData.users.map((data, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-blue-500/30 hover:bg-blue-500 rounded-t transition relative group"
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.value / 1300) * 100}%` }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-warm-cream/60 opacity-0 group-hover:opacity-100 transition">
                    {data.value}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between mt-8 text-warm-cream/60 text-sm">
              {mockData.users.map((d) => (
                <span key={d.month}>{d.month}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pricing Tiers Distribution */}
        <motion.div
          className="grid lg:grid-cols-2 gap-8 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Pricing Tiers */}
          <div className="bg-slate-gray/10 border border-slate-gray/20 p-8 rounded-xl">
            <h2 className="text-xl font-bold text-warm-cream mb-6 flex items-center gap-2">
              <PieChart size={24} /> Enrollment by Tier
            </h2>
            <div className="space-y-4">
              {mockData.pricingTierData.map((tier, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-warm-cream font-semibold">{tier.name}</span>
                    <span className="text-warm-cream/60 text-sm">{tier.value}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-gray/20 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${tier.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${tier.value}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                    ></motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Conversion Metrics */}
          <div className="bg-slate-gray/10 border border-slate-gray/20 p-8 rounded-xl">
            <h2 className="text-xl font-bold text-warm-cream mb-6">Conversion Metrics</h2>
            <div className="space-y-4">
              {[
                { label: 'Signup to Browse', value: '78%' },
                { label: 'Browse to Check Details', value: '62%' },
                { label: 'Details to Enroll', value: '34%' },
                { label: 'Enroll to Complete', value: '72%' },
              ].map((metric, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-warm-cream text-sm">{metric.label}</span>
                    <span className="text-warm-cream/60 font-semibold">{metric.value}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-gray/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: metric.value }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                    ></motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Top Programs Table */}
        <motion.div
          className="bg-slate-gray/10 border border-slate-gray/20 rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="p-8 border-b border-slate-gray/20">
            <h2 className="text-xl font-bold text-warm-cream">Top Programs</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-gray/20">
                <tr>
                  <th className="text-left p-6 text-warm-cream font-semibold">Program</th>
                  <th className="text-center p-6 text-warm-cream font-semibold">Enrollments</th>
                  <th className="text-center p-6 text-warm-cream font-semibold">Revenue</th>
                  <th className="text-center p-6 text-warm-cream font-semibold">Rating</th>
                </tr>
              </thead>
              <tbody>
                {mockData.topPrograms.map((program, i) => (
                  <motion.tr
                    key={i}
                    className="border-b border-slate-gray/20 hover:bg-slate-gray/20 transition"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                  >
                    <td className="p-6">
                      <p className="text-warm-cream font-semibold truncate">{program.name}</p>
                    </td>
                    <td className="p-6 text-center text-warm-cream/80">{program.enrollments}</td>
                    <td className="p-6 text-center text-green-400 font-semibold">₹{program.revenue / 1000}K</td>
                    <td className="p-6 text-center text-warm-cream/80 flex items-center justify-center gap-1"><Star size={16} className="text-yellow-400" /> {program.rating}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
