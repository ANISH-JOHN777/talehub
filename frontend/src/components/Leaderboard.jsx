import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Trophy, Crown, Award, TrendingUp } from 'lucide-react'

export default function Leaderboard() {
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState([])
  const [userRank, setUserRank] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState('all_time') // all_time, monthly, weekly

  useEffect(() => {
    fetchLeaderboard()
  }, [timeFilter])

  const fetchLeaderboard = async () => {
    try {
      // Mock leaderboard data - in real app would fetch from API
      const mockData = [
        {
          _id: '1',
          user: { name: 'Sarah Chen', initials: 'SC' },
          rank: 1,
          points: 5420,
          totalBooksRead: 45,
          currentStreak: 28,
          badges: 12,
        },
        {
          _id: '2',
          user: { name: 'James Wilson', initials: 'JW' },
          rank: 2,
          points: 5100,
          totalBooksRead: 42,
          currentStreak: 21,
          badges: 11,
        },
        {
          _id: '3',
          user: { name: 'Emma Rodriguez', initials: 'ER' },
          rank: 3,
          points: 4890,
          totalBooksRead: 38,
          currentStreak: 15,
          badges: 10,
        },
        {
          _id: '4',
          user: { name: 'Alex Kumar', initials: 'AK' },
          rank: 4,
          points: 4650,
          totalBooksRead: 35,
          currentStreak: 12,
          badges: 9,
        },
        {
          _id: '5',
          user: { name: 'Your Name', initials: 'YOU' },
          rank: 5,
          points: 3980,
          totalBooksRead: 28,
          currentStreak: 8,
          badges: 6,
        },
      ]

      setLeaderboard(mockData)
      if (user) {
        setUserRank(mockData.find((u) => u._id === '5'))
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading leaderboard...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-slate-gray/10">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Trophy size={28} className="text-slate-gray" strokeWidth={1.5} />
          <h2 className="text-2xl font-semibold text-soft-black">Top Readers</h2>
        </div>
        <div className="flex gap-2">
          {['all_time', 'monthly', 'weekly'].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                timeFilter === filter
                  ? 'bg-slate-gray text-warm-cream'
                  : 'bg-warm-cream text-slate-gray hover:bg-slate-gray/10 border border-slate-gray/20'
              }`}
            >
              {filter === 'all_time' ? 'All Time' : filter === 'monthly' ? 'Month' : 'Week'}
            </button>
          ))}
        </div>
      </div>

      {/* Your Rank */}
      {userRank && (
        <div className="mb-6 p-4 bg-warm-cream rounded-lg border border-slate-gray/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-gray text-warm-cream font-bold text-lg">
                {userRank.rank}
              </div>
              <div>
                <p className="font-semibold text-soft-black">Your Rank</p>
                <p className="text-slate-gray text-sm font-light">{userRank.points} points</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-slate-gray">{userRank.totalBooksRead}</p>
              <p className="text-xs text-slate-gray font-light">Books Read</p>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-gray/10">
              <th className="text-left py-3 px-4 font-semibold text-slate-gray">Rank</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-gray">Reader</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-gray">Points</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-gray">Books</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-gray">Streak</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-gray">Badges</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, idx) => (
              <tr
                key={entry._id}
                className={`border-b border-slate-gray/5 transition ${
                  userRank?._id === entry._id
                    ? 'bg-warm-cream'
                    : idx < 3
                      ? 'bg-warm-cream/40'
                      : 'hover:bg-warm-cream/20'
                }`}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {idx === 0 ? (
                      <Crown size={20} className="text-slate-gray" strokeWidth={1.5} />
                    ) : idx === 1 ? (
                      <Award size={20} className="text-slate-gray" strokeWidth={1.5} />
                    ) : idx === 2 ? (
                      <TrendingUp size={20} className="text-slate-gray" strokeWidth={1.5} />
                    ) : (
                      <span className="text-sm font-semibold text-slate-gray">{entry.rank}</span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-gray/20 text-soft-black font-semibold text-xs">
                      {entry.user.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-soft-black">{entry.user.name}</p>
                      {userRank?._id === entry._id && (
                        <p className="text-xs text-slate-gray font-medium">Your position</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <p className="font-semibold text-soft-black text-sm">{entry.points}</p>
                </td>
                <td className="py-4 px-4 text-center">
                  <p className="font-semibold text-slate-gray text-sm">{entry.totalBooksRead}</p>
                </td>
                <td className="py-4 px-4 text-center">
                  <p className="font-semibold text-slate-gray text-sm">{entry.currentStreak}d</p>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="flex justify-center gap-1 flex-wrap">
                    <span className="text-xs font-semibold text-slate-gray">{entry.badges}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-warm-cream rounded-lg border border-slate-gray/10">
        <p className="text-sm text-slate-gray font-light">
          Keep reading and climbing the ranks. Your consistency and engagement matter.
        </p>
      </div>
    </div>
  )
}
