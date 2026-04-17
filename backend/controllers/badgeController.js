const Badge = require('../models/Badge')
const UserBadge = require('../models/UserBadge')
const User = require('../models/User')

// Get all badges
exports.getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.find().sort('category')

    res.status(200).json({
      success: true,
      data: badges,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Get user badges
exports.getUserBadges = async (req, res) => {
  try {
    const { userId } = req.params

    const userBadges = await UserBadge.find({ user: userId })
      .populate('badge')
      .sort('-earnedAt')

    res.status(200).json({
      success: true,
      data: userBadges,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Award badge to user
exports.awardBadge = async (req, res) => {
  try {
    const { userId, badgeId } = req.params

    // Check if user already has badge
    const existing = await UserBadge.findOne({ user: userId, badge: badgeId })
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'User already has this badge',
      })
    }

    const badge = await Badge.findById(badgeId)
    if (!badge) {
      return res.status(404).json({ success: false, error: 'Badge not found' })
    }

    const userBadge = await UserBadge.create({
      user: userId,
      badge: badgeId,
    })

    // Add to user's badges array
    await User.findByIdAndUpdate(userId, {
      $push: { badges: userBadge._id },
    })

    await userBadge.populate('badge')

    res.status(201).json({ success: true, data: userBadge })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Check and award automatic badges
exports.checkAndAwardBadges = async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId).populate('badges')

    // Badge criteria checks
    const badgeChecks = [
      {
        criteria: 'first_book',
        condition: user.totalBooksRead === 1,
      },
      {
        criteria: '5_books',
        condition: user.totalBooksRead >= 5,
      },
      {
        criteria: '10_books',
        condition: user.totalBooksRead >= 10,
      },
      {
        criteria: 'first_session',
        condition: user.totalSessionsAttended === 1,
      },
      {
        criteria: '10_sessions',
        condition: user.totalSessionsAttended >= 10,
      },
    ]

    const earnedBadges = []

    for (const check of badgeChecks) {
      if (check.condition) {
        const badge = await Badge.findOne({ criteria: check.criteria })
        if (badge) {
          const hasUserBadge = await UserBadge.findOne({
            user: userId,
            badge: badge._id,
          })

          if (!hasUserBadge) {
            const userBadge = await UserBadge.create({
              user: userId,
              badge: badge._id,
            })
            await User.findByIdAndUpdate(userId, {
              $push: { badges: userBadge._id },
            })
            earnedBadges.push(await userBadge.populate('badge'))
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      data: {
        newBadges: earnedBadges,
        message: `Earned ${earnedBadges.length} new badge(s)`,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Initialize default badges (admin only)
exports.initializeDefaultBadges = async (req, res) => {
  try {
    const defaultBadges = [
      {
        name: 'First Step',
        description: 'Read your first book',
        icon: 'BookOpen',
        category: 'reading',
        criteria: 'first_book',
        rarity: 'common',
      },
      {
        name: 'Bookworm',
        description: 'Read 5 books',
        icon: 'Books',
        category: 'reading',
        criteria: '5_books',
        rarity: 'uncommon',
      },
      {
        name: 'Literary Master',
        description: 'Read 10 books',
        icon: 'Trophy',
        category: 'reading',
        criteria: '10_books',
        rarity: 'rare',
      },
      {
        name: 'Session Started',
        description: 'Attend your first learning session',
        icon: '👥',
        category: 'sessions',
        criteria: 'first_session',
        rarity: 'common',
      },
      {
        name: 'Social Butterfly',
        description: 'Attend 10 learning sessions',
        icon: '🦋',
        category: 'sessions',
        criteria: '10_sessions',
        rarity: 'rare',
      },
    ]

    const created = await Badge.insertMany(defaultBadges)

    res.status(201).json({
      success: true,
      data: created,
      message: `Created ${created.length} default badges`,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}
