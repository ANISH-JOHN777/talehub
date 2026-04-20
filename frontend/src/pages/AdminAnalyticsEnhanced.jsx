import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  Eye,
  Download,
  Filter,
  ArrowUp,
  ArrowDown,
  PieChart,
} from 'lucide-react'
import axios from 'axios'
import { showToast } from '../utils/toast'

const API_URL = 'http://localhost:5000/api'

export default function AdminAnalyticsEnhanced() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      // Simulated analytics data
      const data = {
        overview: {
          totalRevenue: 125680,
          totalUsers: 5250,
          totalPrograms: 156,
          activeInstructors: 76,
          conversionRate: 3.2,
          avgOrderValue: 299,
        },
        revenue: {
          current: 125680,
          previous: 101230,
          growth: 24.2,
          trend: [12000, 15000, 18000, 22000, 25000, 28000, 35000],
          byProgram: [
            { name: 'React Mastery', value: 23450, percentage: 18.7 },
            { name: 'Python Data Science', value: 19200, percentage: 15.3 },
            { name: 'Web Design', value: 15800, percentage: 12.6 },
            { name: 'Mobile Dev', value: 14300, percentage: 11.4 },
            { name: 'Others', value: 53730, percentage: 42.8 },
          ],
        },
        users: {
          total: 5250,
          activeThisMonth: 3420,
          newThisMonth: 450,
          growth: 15.2,
          retention: 87.3,
          churnRate: 2.1,
          bySegment: [
            { segment: 'Active Learners', count: 2100, percentage: 40 },
            { segment: 'Inactive', count: 1800, percentage: 34.3 },
            { segment: 'New', count: 450, percentage: 8.6 },
            { segment: 'Premium', count: 900, percentage: 17.1 },
          ],
        },
        programs: {
          total: 156,
          active: 142,
          avgEnrollment: 48,
          avgCompletion: 73,
          topPerformer: 'Advanced React Mastery',
          performanceData: [
            { name: 'Excellent', count: 45, percentage: 28.8 },
            { name: 'Good', count: 67, percentage: 42.9 },
            { name: 'Average', count: 32, percentage: 20.5 },
            { name: 'Needs Work', count: 12, percentage: 7.7 },
          ],
        },
        instructors: {
          total: 89,
          active: 76,
          avgRating: 4.8,
          topInstructor: 'Dr. Sarah Johnson',
          performance: [
            { name: 'Dr. Sarah Johnson', rating: 4.9, students: 1250, revenue: 45600 },
            { name: 'Prof. Michael Chen', rating: 4.8, students: 980, revenue: 38200 },
            { name: 'Emma Wilson', rating: 4.7, students: 756, revenue: 29400 },
            { name: 'James Rodriguez', rating: 4.6, students: 642, revenue: 25100 },
          ],
        },
        engagement: {
          avgSessionDuration: 42,
          avgAssignmentScore: 87.5,
          forumPosts: 2341,
          questionsAsked: 1876,
          discussionThreads: 456,
          certificateIssued: 892,
        },
      }

      setAnalytics(data)
    } catch (error) {
      showToast.error('Failed to load analytics')
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, label, value, change, changeType = 'positive', color }) => (
    <motion.div
      className={`bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition`}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        {change && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
              changeType === 'positive' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}
          >
            {changeType === 'positive' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            <span className="text-sm font-semibold">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <p className="text-slate-gray text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-soft-black">{value}</p>
    </motion.div>
  )

  const MetricBox = ({ title, items }) => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-bold text-soft-black mb-6">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item, i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            <p className="text-sm text-slate-gray mb-1">{item.label}</p>
            <p className="text-2xl font-bold text-soft-black">{item.value}</p>
            {item.sublabel && <p className="text-xs text-slate-gray mt-1">{item.sublabel}</p>}
          </div>
        ))}
      </div>
    </div>
  )

  const PerformanceTable = ({ title, data, columns }) => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-soft-black">{title}</h3>
        <motion.button
          className="flex items-center gap-2 text-slate-gray hover:text-soft-black transition"
          whileHover={{ scale: 1.05 }}
        >
          <Download size={18} />
          Export
        </motion.button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((col) => (
                <th key={col} className="text-left py-3 px-4 font-semibold text-soft-black text-sm">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition">
                {Object.values(row).map((cell, j) => (
                  <td key={j} className="py-4 px-4 text-sm">
                    {typeof cell === 'number' && cell > 100 ? (
                      <span className="font-semibold text-soft-black">${cell.toLocaleString()}</span>
                    ) : typeof cell === 'number' ? (
                      <span className="font-semibold text-soft-black">{cell}</span>
                    ) : (
                      <span className="text-slate-gray">{cell}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-warm-cream flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <div className="h-12 w-12 border-4 border-slate-gray border-t-soft-black rounded-full"></div>
          </motion.div>
          <p className="text-slate-gray">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-warm-cream flex items-center justify-center">
        <p className="text-slate-gray">Error loading analytics</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-cream pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-soft-black mb-4">Advanced Analytics</h1>
          <p className="text-slate-gray mb-6">Comprehensive platform performance and business metrics</p>

          {/* Time Range Filter */}
          <div className="flex gap-2 flex-wrap">
            {['week', 'month', 'quarter', 'year'].map((range) => (
              <motion.button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  timeRange === range
                    ? 'bg-slate-gray text-warm-cream'
                    : 'bg-white text-slate-gray border border-gray-200 hover:border-slate-gray'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main KPI Stats */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
        >
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={`$${analytics.revenue.current.toLocaleString()}`}
            change={analytics.revenue.growth}
            color="bg-green-500"
          />
          <StatCard
            icon={Users}
            label="Active Users"
            value={analytics.users.activeThisMonth.toLocaleString()}
            change={analytics.users.growth}
            color="bg-blue-500"
          />
          <StatCard
            icon={FileText}
            label="Programs"
            value={analytics.programs.active}
            color="bg-purple-500"
          />
          <StatCard
            icon={BarChart3}
            label="Completion Rate"
            value={`${analytics.programs.avgCompletion}%`}
            color="bg-orange-500"
          />
          <StatCard
            icon={TrendingUp}
            label="Conv. Rate"
            value={`${analytics.overview.conversionRate}%`}
            color="bg-pink-500"
          />
        </motion.div>

        {/* Detailed Metrics Grid */}
        <motion.div
          className="grid lg:grid-cols-2 gap-8 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delay: 0.2 }}
        >
          <MetricBox
            title="Revenue Insights"
            items={[
              { label: 'This Month', value: `$${analytics.revenue.current.toLocaleString()}` },
              { label: 'Previous Month', value: `$${analytics.revenue.previous.toLocaleString()}` },
              { label: 'Growth', value: `${analytics.revenue.growth}%`, sublabel: 'Month over month' },
              { label: 'Avg. Order', value: `$${analytics.overview.avgOrderValue}` },
            ]}
          />

          <MetricBox
            title="User Metrics"
            items={[
              { label: 'Total Users', value: analytics.users.total.toLocaleString() },
              { label: 'Active This Month', value: analytics.users.activeThisMonth.toLocaleString() },
              { label: 'Retention Rate', value: `${analytics.users.retention}%` },
              { label: 'Churn Rate', value: `${analytics.users.churnRate}%` },
            ]}
          />
        </motion.div>

        {/* Engagement Metrics */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.08, delay: 0.3 }}
        >
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-soft-black mb-4">Learning Engagement</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-gray mb-1">Avg Session Duration</p>
                <p className="text-2xl font-bold text-soft-black">{analytics.engagement.avgSessionDuration} min</p>
              </div>
              <div>
                <p className="text-sm text-slate-gray mb-1">Avg Assignment Score</p>
                <p className="text-2xl font-bold text-soft-black">{analytics.engagement.avgAssignmentScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-soft-black mb-4">Community Activity</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-gray mb-1">Forum Posts</p>
                <p className="text-2xl font-bold text-soft-black">{analytics.engagement.forumPosts.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-gray mb-1">Discussion Threads</p>
                <p className="text-2xl font-bold text-soft-black">{analytics.engagement.discussionThreads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-soft-black mb-4">Completion</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-gray mb-1">Certificates Issued</p>
                <p className="text-2xl font-bold text-soft-black">{analytics.engagement.certificateIssued}</p>
              </div>
              <div>
                <p className="text-sm text-slate-gray mb-1">Avg Completion</p>
                <p className="text-2xl font-bold text-soft-black">{analytics.programs.avgCompletion}%</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Tables */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delay: 0.4 }}
        >
          <PerformanceTable
            title="Top Performing Programs"
            data={analytics.programs.performanceData.map((item, i) => ({
              program: ['Advanced React Mastery', 'Python Data Science', 'Web Design', 'Mobile Dev'][i] || `Program ${i}`,
              status: item.name,
              count: item.count,
              percentage: `${item.percentage}%`,
            }))}
            columns={['Program Name', 'Status', 'Count', 'Percentage']}
          />

          <PerformanceTable
            title="Top Instructors Performance"
            data={analytics.instructors.performance}
            columns={['Instructor', 'Rating', 'Students', 'Revenue']}
          />
        </motion.div>
      </div>
    </div>
  )
}
