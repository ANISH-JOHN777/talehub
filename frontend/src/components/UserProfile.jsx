import React, { useState, useEffect, Suspense, lazy } from 'react'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { Canvas3DErrorBoundary } from './3d/ErrorBoundary'

const UserAvatar3D = lazy(() => import('./3d/UserAvatar3D'))

export default function UserProfile() {
  const { user, token } = useAuth()
  const [profile, setProfile] = useState(null)
  const [badges, setBadges] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    favoriteGenres: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && token) {
      fetchUserProfile()
      fetchUserBadges()
    }
  }, [user, token])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) {
        setProfile(data.data)
        setFormData({
          name: data.data.name,
          bio: data.data.bio || '',
          favoriteGenres: data.data.favoriteGenres || [],
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserBadges = async () => {
    try {
      if (!user || !user._id) {
        console.warn('User ID not available yet')
        return
      }
      const response = await fetch(`/api/badges/user/${user._id}`)
      const data = await response.json()
      if (data.success) {
        setBadges(data.data)
      }
    } catch (error) {
      console.error('Error fetching badges:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Update profile logic here
    setEditMode(false)
  }

  if (loading) {
    return <div>Loading profile...</div>
  }

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg p-8 max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Profile Header with 3D Avatar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* 3D Avatar */}
        <motion.div
          className="lg:col-span-1 h-64 rounded-lg overflow-hidden shadow-lg border border-slate-gray/10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Canvas3DErrorBoundary>
            <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-warm-cream to-slate-gray/10" />}>
              <UserAvatar3D />
            </Suspense>
          </Canvas3DErrorBoundary>
        </motion.div>

        {/* Profile Info */}
        <motion.div
          className="lg:col-span-2 flex flex-col justify-between"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{profile?.name}</h1>
            <p className="text-gray-600 mt-2 text-lg">{profile?.email}</p>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="w-fit bg-slate-gray text-warm-cream px-6 py-2 rounded-lg hover:bg-soft-black transition font-medium"
          >
            {editMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div>
          <p className="text-2xl font-bold text-teal-600">{profile?.totalBooksRead || 0}</p>
          <p className="text-gray-600 text-sm">Books Read</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-teal-600">{profile?.totalSessionsAttended || 0}</p>
          <p className="text-gray-600 text-sm">Sessions Attended</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-teal-600">{badges.length}</p>
          <p className="text-gray-600 text-sm">Badges Earned</p>
        </div>
      </div>

      {/* Edit Form */}
      {editMode && (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition font-medium"
          >
            Save Changes
          </button>
        </form>
      )}

      {/* Bio */}
      {profile?.bio && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
          <p className="text-gray-600">{profile.bio}</p>
        </div>
      )}

      {/* Badges */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h2>
        {badges.length === 0 ? (
          <p className="text-gray-500">No badges earned yet. Keep reading!</p>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div key={badge._id} className="text-center">
                <div className="text-4xl mb-2">{badge.badge?.icon}</div>
                <p className="text-xs font-medium text-gray-700 text-center">
                  {badge.badge?.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
