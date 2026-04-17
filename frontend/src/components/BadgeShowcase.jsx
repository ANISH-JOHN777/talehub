import React, { useState, useEffect } from 'react'
import { Trophy, BookOpen, Users, Video } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function BadgeShowcase() {
  const { user, token } = useAuth()
  const [userBadges, setUserBadges] = useState([])
  const [allBadges, setAllBadges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && token) {
      fetchBadges()
    }
  }, [user, token])

  const fetchBadges = async () => {
    try {
      if (!user || !user._id) {
        console.warn('User ID not available')
        setLoading(false)
        return
      }
      
      const [userRes, allRes] = await Promise.all([
        fetch(`/api/badges/user/${user._id}`),
        fetch('/api/badges'),
      ])

      const userData = await userRes.json()
      const allData = await allRes.json()

      if (userData.success) {
        setUserBadges(userData.data.map((ub) => ub.badge._id))
      }
      if (allData.success) {
        setAllBadges(allData.data)
      }
    } catch (error) {
      console.error('Error fetching badges:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center">Loading badges...</div>
  }

  // Group badges by category
  const badgesByCategory = allBadges.reduce((acc, badge) => {
    if (!acc[badge.category]) {
      acc[badge.category] = []
    }
    acc[badge.category].push(badge)
    return acc
  }, {})

  const categoryEmojis = {
    reading: 'BookOpen',
    community: 'Users',
    sessions: 'Video',
    achievement: 'Trophy',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Trophy size={28} className="text-yellow-500" />
        Badges & Achievements
      </h2>

      <div className="space-y-8">
        {Object.entries(badgesByCategory).map(([category, badges]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {categoryEmojis[category]} {category.charAt(0).toUpperCase() + category.slice(1)}
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((badge) => {
                const isEarned = userBadges.includes(badge._id)
                return (
                  <div
                    key={badge._id}
                    className={`p-4 rounded-lg border-2 transition ${
                      isEarned
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300'
                        : 'bg-gray-50 border-gray-200 opacity-50'
                    }`}
                  >
                    <div className="text-4xl mb-2 text-center">{badge.icon}</div>
                    <h4 className="font-medium text-gray-900 text-center text-sm mb-1">
                      {badge.name}
                    </h4>
                    <p className="text-xs text-gray-600 text-center">
                      {badge.description}
                    </p>
                    {isEarned && (
                      <div className="mt-2 text-center">
                        <span className="inline-block bg-teal-200 text-teal-800 px-2 py-1 rounded text-xs font-semibold">
                          ✓ Earned
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="mt-8 p-4 bg-teal-50 rounded-lg border border-teal-200">
        <p className="text-teal-900 font-medium mb-2">Your Progress</p>
        <div className="w-full bg-teal-200 rounded-full h-2">
          <div
            className="bg-teal-600 h-2 rounded-full transition-all"
            style={{ width: `${(userBadges.length / allBadges.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-teal-800 mt-2">
          {userBadges.length} of {allBadges.length} badges earned
        </p>
      </div>
    </div>
  )
}
