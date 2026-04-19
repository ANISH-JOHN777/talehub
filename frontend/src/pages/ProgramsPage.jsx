import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, Star, Users, Clock } from 'lucide-react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

export default function ProgramsPage() {
  const navigate = useNavigate()
  const [programs, setPrograms] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    level: '',
  })

  const categories = ['Self-Help', 'Business', 'Finance', 'Psychology', 'History', 'Technology', 'Personal Development']
  const levels = ['Beginner', 'Intermediate', 'Advanced']

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    try {
      const response = await axios.get(`${API_URL}/programs`)
      setPrograms(response.data.data || [])
      setFiltered(response.data.data || [])
    } catch (error) {
      console.error('Error fetching programs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let result = programs

    if (search) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (filters.category) {
      result = result.filter((p) => p.category === filters.category)
    }

    if (filters.level) {
      result = result.filter((p) => p.level === filters.level)
    }

    setFiltered(result)
  }, [search, filters, programs])

  return (
    <div className="min-h-screen bg-warm-cream pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-soft-black mb-4 tracking-tight" style={{ letterSpacing: '-0.01em' }}>Explore Programs</h1>
          <p className="text-base text-slate-gray" style={{ letterSpacing: '0.3px', wordSpacing: '0.08em' }}>Choose from 100+ expertly crafted learning programs</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-4 text-slate-gray" size={20} />
            <input
              type="text"
              placeholder="Search programs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-slate-gray/20 rounded-lg focus:outline-none focus:border-slate-gray"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-xl p-6 border border-slate-gray/10 sticky top-24">
              <h3 className="text-lg font-bold text-soft-black mb-4 flex items-center gap-2">
                <Filter size={20} /> Filters
              </h3>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="font-semibold text-soft-black mb-3 block">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full p-2 border-2 border-slate-gray/20 rounded-lg focus:outline-none focus:border-slate-gray"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level Filter */}
              <div className="mb-6">
                <label className="font-semibold text-soft-black mb-3 block">Level</label>
                <select
                  value={filters.level}
                  onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                  className="w-full p-2 border-2 border-slate-gray/20 rounded-lg focus:outline-none focus:border-slate-gray"
                >
                  <option value="">All Levels</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearch('')
                  setFilters({ category: '', level: '' })
                }}
                className="w-full py-2 bg-slate-gray/10 text-slate-gray hover:bg-slate-gray/20 rounded-lg transition font-medium"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>

          {/* Programs Grid */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin">⏳</div>
                <p className="text-slate-gray mt-2">Loading programs...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-gray/10">
                <p className="text-slate-gray text-lg">No programs found matching your criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filtered.map((program, i) => (
                  <motion.div
                    key={program._id}
                    className="bg-white rounded-xl border border-slate-gray/10 overflow-hidden hover:shadow-lg transition cursor-pointer group"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => navigate(`/programs/${program._id}`)}
                  >
                    {/* Image */}
                    <div className="h-48 bg-gradient-to-br from-slate-gray/20 to-slate-gray/10 relative overflow-hidden">
                      <img
                        src={program.thumbnail || program.image}
                        alt={program.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23d4a574%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2220%22 fill=%22%23333%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EProgram Cover%3C/text%3E%3C/svg%3E'
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-warm-cream px-3 py-1 rounded-full text-sm font-semibold text-soft-black">
                        {program.level}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="text-xs font-semibold text-slate-gray uppercase mb-2">{program.category}</div>
                      <h3 className="text-xl font-bold text-soft-black mb-2 group-hover:text-slate-gray transition">
                        {program.title}
                      </h3>
                      <p className="text-slate-gray text-sm mb-4 line-clamp-2">{program.description}</p>

                      {/* Instructor */}
                      <div className="mb-4 pb-4 border-b border-slate-gray/10">
                        {program.instructor && (
                          <p className="text-sm text-slate-gray">
                            <span className="font-semibold">By:</span> {program.instructor.name}
                          </p>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                        <div>
                          <div className="flex items-center gap-1 text-slate-gray mb-1">
                            <Clock size={16} /> Duration
                          </div>
                          <div className="font-semibold text-soft-black">{program.duration.weeks}w</div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-slate-gray mb-1">
                            <Users size={16} /> Enrolled
                          </div>
                          <div className="font-semibold text-soft-black">{program.totalEnrolled}+</div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-slate-gray mb-1">
                            <Star size={16} /> Rating
                          </div>
                          <div className="font-semibold text-soft-black">{program.ratings.average.toFixed(1)}</div>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="mb-4">
                        <div className="text-sm text-slate-gray mb-2">Starting from</div>
                        <div className="text-2xl font-bold text-slate-gray">
                          ₹{program.pricing.basic.price}
                          <span className="text-sm text-slate-gray ml-2 font-normal">(Basic)</span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button className="w-full bg-slate-gray hover:bg-soft-black text-warm-cream py-2 rounded-lg transition font-semibold">
                        View Programs & Enroll
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {filtered.length > 0 && (
              <motion.div
                className="mt-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-slate-gray">
                  Showing <span className="font-bold">{filtered.length}</span> of{' '}
                  <span className="font-bold">{programs.length}</span> programs
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
