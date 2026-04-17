import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Globe, Users, BookOpen, Trophy, ArrowRight } from 'lucide-react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInstructors()
  }, [])

  const fetchInstructors = async () => {
    try {
      const response = await axios.get(`${API_URL}/instructors`)
      setInstructors(response.data.data || [])
    } catch (error) {
      console.error('Error fetching instructors:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-warm-cream pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-6xl font-bold text-soft-black mb-4">Meet Our Expert Instructors</h1>
          <p className="text-xl text-slate-gray max-w-3xl mx-auto">
            Learn from bestselling authors, entrepreneurs, and thought leaders who are passionate about sharing their expertise.
          </p>
        </motion.div>

        {/* Instructors Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
            <p className="text-slate-gray">Loading instructors...</p>
          </div>
        ) : instructors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-gray text-lg">No instructors found</p>
          </div>
        ) : (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {instructors.map((instructor, i) => (
              <motion.div
                key={instructor._id}
                className="bg-white rounded-xl border border-slate-gray/10 overflow-hidden hover:shadow-xl transition group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {/* Instructor Avatar */}
                <div className="h-64 bg-gradient-to-br from-slate-gray/20 to-slate-gray/5 relative overflow-hidden">
                  <img
                    src={instructor.avatar}
                    alt={instructor.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300?text=' + instructor.name.split(' ')[0]
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Name and Title */}
                  <h3 className="text-2xl font-bold text-soft-black mb-1 group-hover:text-slate-gray transition">
                    {instructor.name}
                  </h3>

                  {/* Bio */}
                  {instructor.bio && (
                    <p className="text-slate-gray text-sm mb-4 line-clamp-2">{instructor.bio}</p>
                  )}

                  {/* Expertise Tags */}
                  {instructor.expertise && instructor.expertise.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {instructor.expertise.slice(0, 3).map((exp, j) => (
                        <span
                          key={j}
                          className="px-2 py-1 bg-slate-gray/10 text-slate-gray text-xs rounded-full font-medium"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-gray/10">
                    <div>
                      <div className="flex items-center gap-2 text-slate-gray text-sm mb-1">
                        <Users size={16} /> Students
                      </div>
                      <p className="font-bold text-soft-black">{instructor.totalStudents}+</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-slate-gray text-sm mb-1">
                        <Trophy size={16} /> Rating
                      </div>
                      <p className="font-bold text-soft-black">{instructor.rating.average.toFixed(1)}/5</p>
                    </div>
                  </div>

                  {/* Programs */}
                  {instructor.programs && instructor.programs.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-slate-gray mb-2 flex items-center gap-1">
                        <BookOpen size={16} /> {instructor.programs.length} Program{instructor.programs.length !== 1 ? 's' : ''}
                      </p>
                      <div className="space-y-1">
                        {instructor.programs.slice(0, 2).map((program, j) => (
                          <p key={j} className="text-xs text-slate-gray truncate">
                            • {program.title}
                          </p>
                        ))}
                        {instructor.programs.length > 2 && (
                          <p className="text-xs text-slate-gray font-semibold">
                            +{instructor.programs.length - 2} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Social Links */}
                  <div className="flex gap-3 pt-4 border-t border-slate-gray/10">
                    {instructor.social && (
                      <>
                        {instructor.social.twitter && (
                          <a
                            href={instructor.social.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-gray hover:text-soft-black transition"
                            title="Twitter"
                          >
                            <Twitter size={20} />
                          </a>
                        )}
                        {instructor.social.linkedin && (
                          <a
                            href={instructor.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-gray hover:text-soft-black transition text-sm font-semibold"
                            title="LinkedIn"
                          >
                            in
                          </a>
                        )}
                        {instructor.social.website && (
                          <a
                            href={instructor.social.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-gray hover:text-soft-black transition"
                            title="Website"
                          >
                            <Globe size={20} />
                          </a>
                        )}
                      </>
                    )}
                    <a
                      href={`mailto:${instructor.email}`}
                      className="text-slate-gray hover:text-soft-black transition ml-auto"
                      title="Email"
                    >
                      <Mail size={20} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          className="bg-gradient-to-r from-slate-gray to-slate-gray/90 text-warm-cream rounded-2xl p-12 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Learn from the Experts?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of students taking programs from these world-class instructors
          </p>
          <a
            href="/programs"
            className="inline-flex items-center gap-2 bg-warm-cream text-slate-gray px-8 py-4 rounded-lg font-bold text-lg hover:bg-white transition"
          >
            Browse All Programs <ArrowRight size={24} />
          </a>
        </motion.div>
      </div>
    </div>
  )
}

function Twitter({ size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7z"></path>
    </svg>
  )
}
