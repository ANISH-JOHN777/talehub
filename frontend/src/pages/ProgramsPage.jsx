import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import axios from 'axios'
import EnhancedProgramCard from '../components/EnhancedProgramCard'

const API_URL = 'http://localhost:5000/api'

export default function ProgramsPage() {
  const navigate = useNavigate()
  const [programs, setPrograms] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [filters, setFilters] = useState({
    category: '',
    level: '',
  })

  const categories = ['Self-Help', 'Business', 'Finance', 'Psychology', 'History', 'Technology', 'Personal Development']
  const levels = ['Beginner', 'Intermediate', 'Advanced']
  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
  ]

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

    // Apply sorting
    if (sortBy === 'rating') {
      result = result.sort((a, b) => (b.ratings?.average || 0) - (a.ratings?.average || 0))
    } else if (sortBy === 'newest') {
      result = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sortBy === 'price-low') {
      result = result.sort((a, b) => (a.pricing?.basic?.price || 0) - (b.pricing?.basic?.price || 0))
    } else if (sortBy === 'price-high') {
      result = result.sort((a, b) => (b.pricing?.basic?.price || 0) - (a.pricing?.basic?.price || 0))
    }

    setFiltered(result)
  }, [search, filters, programs, sortBy])

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-cream to-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-soft-black mb-4 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
            Explore Expert-Led Programs
          </h1>
          <p className="text-lg text-slate-gray max-w-2xl mx-auto" style={{ letterSpacing: '0.3px', wordSpacing: '0.08em' }}>
            Discover 100+ expertly crafted learning programs taught by industry leaders. Find your next learning adventure.
          </p>
        </motion.div>

        {/* Enhanced Search Bar */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-4 text-slate-gray" size={22} />
            <input
              type="text"
              placeholder="Search by title, category, or instructor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-slate-gray/20 rounded-xl focus:outline-none focus:border-slate-gray focus:ring-4 focus:ring-slate-gray/10 text-base transition"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-4 text-slate-gray hover:text-soft-black transition"
              >
                <X size={22} />
              </button>
            )}
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
            <div className="bg-white rounded-2xl p-6 border border-slate-gray/10 sticky top-24 shadow-lg">
              <h3 className="text-lg font-bold text-soft-black mb-6 flex items-center gap-2">
                <Filter size={22} className="text-slate-gray" /> Filters
              </h3>

              {/* Category Filter */}
              <div className="mb-8">
                <label className="font-semibold text-soft-black mb-3 block text-sm uppercase tracking-wider" style={{ letterSpacing: '0.5px' }}>
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full p-3 border-2 border-slate-gray/20 rounded-lg focus:outline-none focus:border-slate-gray focus:ring-4 focus:ring-slate-gray/10 transition"
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
              <div className="mb-8">
                <label className="font-semibold text-soft-black mb-3 block text-sm uppercase tracking-wider" style={{ letterSpacing: '0.5px' }}>
                  Level
                </label>
                <select
                  value={filters.level}
                  onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                  className="w-full p-3 border-2 border-slate-gray/20 rounded-lg focus:outline-none focus:border-slate-gray focus:ring-4 focus:ring-slate-gray/10 transition"
                >
                  <option value="">All Levels</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="mb-8">
                <label className="font-semibold text-soft-black mb-3 block text-sm uppercase tracking-wider" style={{ letterSpacing: '0.5px' }}>
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-3 border-2 border-slate-gray/20 rounded-lg focus:outline-none focus:border-slate-gray focus:ring-4 focus:ring-slate-gray/10 transition"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              {(search || filters.category || filters.level || sortBy !== 'popular') && (
                <motion.button
                  onClick={() => {
                    setSearch('')
                    setFilters({ category: '', level: '' })
                    setSortBy('popular')
                  }}
                  className="w-full py-3 bg-gradient-to-r from-slate-gray/10 to-slate-gray/5 text-slate-gray hover:from-slate-gray/20 hover:to-slate-gray/10 rounded-lg transition font-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Clear All Filters
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Programs Grid */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Results Header */}
            <div className="mb-8">
              <p className="text-slate-gray">
                Showing <span className="font-bold text-soft-black">{filtered.length}</span> of{' '}
                <span className="font-bold text-soft-black">{programs.length}</span> programs
              </p>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block">
                  <div className="animate-spin">
                    <div className="h-12 w-12 border-4 border-slate-gray border-t-soft-black rounded-full"></div>
                  </div>
                </div>
                <p className="text-slate-gray mt-4 text-lg">Loading amazing programs...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-gray/20">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-slate-gray text-lg font-medium">No programs found</p>
                <p className="text-slate-gray/60 mt-2">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filtered.map((program, i) => (
                  <motion.div
                    key={program._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <EnhancedProgramCard
                      program={program}
                      onViewDetails={(id) => navigate(`/programs/${id}`)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
