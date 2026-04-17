const Analytics = require('../models/Analytics')
const User = require('../models/User')
const Program = require('../models/Program')
const Enrollment = require('../models/Enrollment')

// @route   GET /api/admin/analytics
// @desc    Get analytics dashboard data
exports.getAnalyticsDashboard = async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const totalUsers = await User.countDocuments()
    const newUsersToday = await User.countDocuments({ createdAt: { $gte: today } })

    const totalPrograms = await Program.countDocuments()
    const totalEnrollments = await Enrollment.countDocuments()
    const newEnrollmentsToday = await Enrollment.countDocuments({ enrolledAt: { $gte: today } })

    // Calculate revenue
    const enrollmentData = await Enrollment.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$price' },
          totalCount: { $sum: 1 },
        },
      },
    ])

    const totalRevenue = enrollmentData[0]?.totalRevenue || 0
    const revenueToday = await Enrollment.aggregate([
      {
        $match: { enrolledAt: { $gte: today } },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$price' },
        },
      },
    ])

    const conversionRate = totalUsers > 0 ? ((totalEnrollments / totalUsers) * 100).toFixed(2) : 0

    // Top programs
    const topPrograms = await Program.find()
      .sort({ totalEnrolled: -1 })
      .limit(5)
      .select('title totalEnrolled ratings')

    // By tier breakdown
    const byTier = await Enrollment.aggregate([
      {
        $group: {
          _id: '$tier',
          enrollments: { $sum: 1 },
          revenue: { $sum: '$price' },
        },
      },
    ])

    const analytics = {
      metrics: {
        totalUsers,
        newUsersToday,
        totalPrograms,
        totalEnrollments,
        newEnrollmentsToday,
        totalRevenue,
        revenueToday: revenueToday[0]?.revenue || 0,
        conversionRate: parseFloat(conversionRate),
      },
      topPrograms,
      byTier: byTier.reduce(
        (acc, curr) => ({
          ...acc,
          [curr._id.toLowerCase()]: {
            enrollments: curr.enrollments,
            revenue: curr.revenue,
          },
        }),
        {}
      ),
    }

    res.status(200).json({ success: true, data: analytics })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   GET /api/admin/analytics/programs
// @desc    Get per-program analytics
exports.getProgramAnalytics = async (req, res) => {
  try {
    const programs = await Program.find().select('title totalEnrolled ratings seatsAvailable')

    const programsWithEnrollments = await Promise.all(
      programs.map(async (program) => {
        const enrollmentData = await Enrollment.aggregate([
          { $match: { program: program._id } },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              revenue: { $sum: '$price' },
            },
          },
        ])

        return {
          programId: program._id,
          title: program.title,
          totalEnrolled: program.totalEnrolled,
          seatsAvailable: program.seatsAvailable,
          rating: program.ratings.average,
          ratingCount: program.ratings.count,
          revenue: enrollmentData[0]?.revenue || 0,
        }
      })
    )

    res.status(200).json({ success: true, data: programsWithEnrollments })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   GET /api/admin/analytics/users
// @desc    Get user analytics
exports.getUserAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const usersLastWeek = await User.countDocuments({ createdAt: { $gte: lastWeek } })
    const usersLastMonth = await User.countDocuments({ createdAt: { $gte: lastMonth } })

    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        usersLastWeek,
        usersLastMonth,
        growth: userGrowth,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   POST /api/admin/analytics/record
// @desc    Record daily analytics
exports.recordDailyAnalytics = async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const metrics = {
      totalUsers: await User.countDocuments(),
      newUsersToday: await User.countDocuments({ createdAt: { $gte: today } }),
      totalPrograms: await Program.countDocuments(),
      totalEnrollments: await Enrollment.countDocuments(),
      newEnrollmentsToday: await Enrollment.countDocuments({ enrolledAt: { $gte: today } }),
    }

    const analytics = new Analytics({ metrics })
    await analytics.save()

    res.status(201).json({ success: true, data: analytics })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}
