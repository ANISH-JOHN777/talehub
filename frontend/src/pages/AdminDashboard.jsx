import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, BookOpen, Users, TrendingUp, Settings, Star, BarChart3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('programs')
  const [programs, setPrograms] = useState([])
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProgram, setEditingProgram] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    category: 'Development',
    level: 'Beginner',
  })

  const token = localStorage.getItem('authToken')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [programsRes, instructorsRes] = await Promise.all([
        axios.get(`${API_URL}/programs`),
        axios.get(`${API_URL}/instructors`),
      ])
      setPrograms(programsRes.data.data || [])
      setInstructors(instructorsRes.data.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProgram = async (e) => {
    e.preventDefault()
    try {
      if (editingProgram) {
        await axios.patch(
          `${API_URL}/programs/${editingProgram._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        await axios.post(`${API_URL}/programs`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }
      setShowModal(false)
      setEditingProgram(null)
      setFormData({ title: '', description: '', instructor: '', category: 'Development', level: 'Beginner' })
      fetchData()
    } catch (error) {
      console.error('Error saving program:', error)
    }
  }

  const handleEdit = (program) => {
    setEditingProgram(program)
    setFormData(program)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        await axios.delete(`${API_URL}/programs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        fetchData()
      } catch (error) {
        console.error('Error deleting program:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-soft-black pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-8 flex justify-between items-start"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-warm-cream mb-2">Admin Dashboard</h1>
            <p className="text-warm-cream/60">Manage programs, instructors, and platform settings</p>
          </div>
          <motion.button
            onClick={() => navigate('/admin/advanced-analytics')}
            className="flex items-center gap-2 bg-slate-gray hover:bg-slate-gray/80 text-warm-cream px-6 py-3 rounded-lg font-semibold transition"
            whileHover={{ scale: 1.05 }}
          >
            <BarChart3 size={20} />
            Advanced Analytics
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {[
            { label: 'Total Programs', value: programs.length, icon: BookOpen, color: 'text-blue-400' },
            { label: 'Total Users', value: '5,234', icon: Users, color: 'text-green-400' },
            { label: 'Revenue', value: '₹2.4L', icon: TrendingUp, color: 'text-yellow-400' },
            { label: 'Avg Rating', value: '4.8/5', icon: Settings, color: 'text-purple-400' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="bg-slate-gray/10 border border-slate-gray/20 p-6 rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`text-3xl mb-2 ${stat.color}`}>
                <stat.icon size={32} />
              </div>
              <p className="text-warm-cream/60 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-warm-cream">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex gap-4 mb-8 border-b border-slate-gray/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {['programs', 'instructors', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold capitalize transition ${
                activeTab === tab
                  ? 'text-warm-cream border-b-2 border-slate-gray'
                  : 'text-warm-cream/60 hover:text-warm-cream'
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Programs Tab */}
        {activeTab === 'programs' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-warm-cream">Manage Programs</h2>
              <button
                onClick={() => {
                  setEditingProgram(null)
                  setFormData({ title: '', description: '', instructor: '', category: 'Development', level: 'Beginner' })
                  setShowModal(true)
                }}
                className="bg-slate-gray hover:bg-slate-gray/80 text-warm-cream px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
              >
                <Plus size={20} /> New Program
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-warm-cream/60">Loading programs...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {programs.map((program) => (
                  <motion.div
                    key={program._id}
                    className="bg-slate-gray/10 border border-slate-gray/20 p-6 rounded-xl flex justify-between items-start hover:border-slate-gray/40 transition"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-warm-cream mb-2">{program.title}</h3>
                      <p className="text-warm-cream/60 text-sm mb-2">{program.description}</p>
                      <div className="flex gap-4 text-sm">
                        <span className="text-warm-cream/60">
                          👥 {program.enrolledCount || 0} enrolled
                        </span>
                        <span className="text-warm-cream/60">
                          <Star size={16} className="text-yellow-400" /> {program.rating?.average?.toFixed(1) || '4.5'}/5
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          program.level === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                          program.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {program.level}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(program)}
                        className="p-2 hover:bg-slate-gray/20 rounded transition text-blue-400"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(program._id)}
                        className="p-2 hover:bg-slate-gray/20 rounded transition text-red-400"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Instructors Tab */}
        {activeTab === 'instructors' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl font-bold text-warm-cream mb-6">Manage Instructors</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {instructors.map((instructor) => (
                <motion.div
                  key={instructor._id}
                  className="bg-slate-gray/10 border border-slate-gray/20 p-6 rounded-xl hover:border-slate-gray/40 transition"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <h3 className="text-lg font-bold text-warm-cream mb-2">{instructor.name}</h3>
                  <p className="text-warm-cream/60 text-sm mb-4">{instructor.bio}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded transition text-sm font-semibold">
                      Edit
                    </button>
                    <button className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition text-sm font-semibold">
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl font-bold text-warm-cream mb-6">Platform Settings</h2>
            <div className="bg-slate-gray/10 border border-slate-gray/20 p-8 rounded-xl space-y-6">
              {[
                { label: 'Commission Rate', value: '30%' },
                { label: 'Refund Period', value: '30 days' },
                { label: 'Minimum Price', value: '₹99' },
                { label: 'Maximum Discount', value: '70%' },
              ].map((setting, i) => (
                <div key={i} className="flex justify-between items-center pb-6 border-b border-slate-gray/20 last:border-0">
                  <label className="text-warm-cream font-semibold">{setting.label}</label>
                  <input
                    type="text"
                    defaultValue={setting.value}
                    className="bg-slate-gray/20 text-warm-cream px-4 py-2 rounded-lg border border-slate-gray/30 focus:outline-none focus:border-slate-gray"
                  />
                </div>
              ))}
              <button className="w-full mt-6 bg-slate-gray hover:bg-slate-gray/80 text-warm-cream py-3 rounded-lg font-semibold transition">
                💾 Save Settings
              </button>
            </div>
          </motion.div>
        )}

        {/* Modal */}
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="bg-soft-black border border-slate-gray/20 rounded-xl p-8 max-w-md w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold text-warm-cream mb-6">
                {editingProgram ? 'Edit Program' : 'Create New Program'}
              </h2>
              <form onSubmit={handleCreateProgram} className="space-y-4">
                <input
                  type="text"
                  placeholder="Program Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-gray/20 text-warm-cream placeholder-warm-cream/40 px-4 py-2 rounded-lg border border-slate-gray/30 focus:outline-none focus:border-slate-gray"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-gray/20 text-warm-cream placeholder-warm-cream/40 px-4 py-2 rounded-lg border border-slate-gray/30 focus:outline-none focus:border-slate-gray resize-none"
                  rows="3"
                />
                <select
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  className="w-full bg-slate-gray/20 text-warm-cream px-4 py-2 rounded-lg border border-slate-gray/30 focus:outline-none focus:border-slate-gray"
                >
                  <option value="">Select Instructor</option>
                  {instructors.map((inst) => (
                    <option key={inst._id} value={inst._id}>
                      {inst.name}
                    </option>
                  ))}
                </select>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full bg-slate-gray/20 text-warm-cream px-4 py-2 rounded-lg border border-slate-gray/30 focus:outline-none focus:border-slate-gray"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 bg-slate-gray/20 hover:bg-slate-gray/30 text-warm-cream rounded-lg transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-slate-gray hover:bg-slate-gray/80 text-warm-cream rounded-lg transition font-semibold"
                  >
                    {editingProgram ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
