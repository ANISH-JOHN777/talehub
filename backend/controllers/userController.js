const User = require('../models/User')
const bcrypt = require('bcrypt')

// @route   GET /api/users/profile
// @desc    Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('enrolledPrograms', 'title category image')
      .populate('enrolledBooks', 'title author coverImage')

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.status(200).json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   PATCH /api/users/profile
// @desc    Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar, favoriteGenres, timezone, preferences } = req.body

    const updateData = {}

    if (name) updateData.name = name
    if (bio !== undefined) updateData.bio = bio
    if (avatar !== undefined) updateData.avatar = avatar
    if (favoriteGenres) updateData.favoriteGenres = favoriteGenres
    if (timezone) updateData.timezone = timezone
    if (preferences) updateData.preferences = preferences

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password')

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// @route   PATCH /api/users/change-password
// @desc    Change user password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password',
      })
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match',
      })
    }

    // Check password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      })
    }

    // Get user with password field
    const user = await User.findById(req.user.id).select('+password')

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   PATCH /api/users/preferences
// @desc    Update user preferences
exports.updatePreferences = async (req, res) => {
  try {
    const { emailNotifications, sessionReminders, communityUpdates, smsNotifications, privateProfile } = req.body

    const preferences = {}
    if (emailNotifications !== undefined) preferences.emailNotifications = emailNotifications
    if (sessionReminders !== undefined) preferences.sessionReminders = sessionReminders
    if (communityUpdates !== undefined) preferences.communityUpdates = communityUpdates
    if (smsNotifications !== undefined) preferences.smsNotifications = smsNotifications
    if (privateProfile !== undefined) preferences.privateProfile = privateProfile

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { preferences },
      { new: true }
    ).select('-password')

    res.status(200).json({
      success: true,
      message: 'Preferences updated',
      data: user,
    })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// @route   PATCH /api/users/avatar
// @desc    Update user avatar
exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body

    if (!avatar) {
      return res.status(400).json({ success: false, message: 'Please provide avatar URL' })
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar },
      { new: true }
    ).select('-password')

    res.status(200).json({
      success: true,
      message: 'Avatar updated',
      data: user,
    })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// @route   GET /api/users/:userId/public-profile
// @desc    Get user public profile
exports.getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password -preferences -email')
      .populate('enrolledPrograms', 'title category image')

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (user.preferences?.privateProfile) {
      return res.status(403).json({
        success: false,
        message: 'This profile is private',
      })
    }

    res.status(200).json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   GET /api/users/stats
// @desc    Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.status(200).json({
      success: true,
      data: {
        totalBooksRead: user.totalBooksRead,
        totalSessionsAttended: user.totalSessionsAttended,
        currentStreak: user.currentStreak,
        tier: user.tier,
        badges: user.badges?.length || 0,
        followers: user.followers?.length || 0,
        following: user.following?.length || 0,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   POST /api/users/:userId/follow
// @desc    Follow a user
exports.followUser = async (req, res) => {
  try {
    const { userId } = req.params
    const currentUserId = req.user.id

    if (userId === currentUserId) {
      return res.status(400).json({ success: false, message: 'You cannot follow yourself' })
    }

    const userToFollow = await User.findById(userId)
    const currentUser = await User.findById(currentUserId)

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // Check if already following
    if (currentUser.following?.includes(userId)) {
      return res.status(400).json({ success: false, message: 'Already following this user' })
    }

    // Add to following
    currentUser.following.push(userId)
    userToFollow.followers.push(currentUserId)

    await currentUser.save()
    await userToFollow.save()

    res.status(200).json({
      success: true,
      message: 'User followed successfully',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   POST /api/users/:userId/unfollow
// @desc    Unfollow a user
exports.unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params
    const currentUserId = req.user.id

    const currentUser = await User.findById(currentUserId)
    const userToUnfollow = await User.findById(userId)

    if (!currentUser || !userToUnfollow) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // Remove from following
    currentUser.following = currentUser.following.filter((id) => id.toString() !== userId)
    userToUnfollow.followers = userToUnfollow.followers.filter((id) => id.toString() !== currentUserId)

    await currentUser.save()
    await userToUnfollow.save()

    res.status(200).json({
      success: true,
      message: 'User unfollowed successfully',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   DELETE /api/users/profile
// @desc    Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body

    if (!password) {
      return res.status(400).json({ success: false, message: 'Please provide password to confirm' })
    }

    // Get user with password field
    const user = await User.findById(req.user.id).select('+password')

    // Verify password
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Password is incorrect',
      })
    }

    // Delete user
    await User.findByIdAndDelete(req.user.id)

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
