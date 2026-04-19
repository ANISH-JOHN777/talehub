import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Users, Clock, Check, AlertCircle, Calendar } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const API_URL = 'http://localhost:5000/api'

export default function ProgramDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [program, setProgram] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedTier, setSelectedTier] = useState('pro')
  const [enrolling, setEnrolling] = useState(false)
  const [enrolled, setEnrolled] = useState(false)

  useEffect(() => {
    fetchProgram()
  }, [id])

  const fetchProgram = async () => {
    try {
      const response = await axios.get(`${API_URL}/programs/${id}`)
      setProgram(response.data.data)
    } catch (error) {
      console.error('Error fetching program:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    // Navigate to enrollment customization page instead of direct enrollment
    navigate(`/enroll/${id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
          <p className="text-slate-gray">Loading program details...</p>
        </div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center pt-24">
        <div className="text-center">
          <AlertCircle size={48} className="text-slate-gray mx-auto mb-4" />
          <p className="text-slate-gray text-lg">Program not found</p>
        </div>
      </div>
    )
  }

  const tiers = [
    {
      id: 'basic',
      name: 'Basic',
      price: program.pricing.basic.price,
      description: 'Live sessions only',
      features: program.pricing.basic.features || ['4 live sessions', 'Q&A with instructor', 'Community access'],
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: program.pricing.pro.price,
      description: 'Live + Recordings',
      features: program.pricing.pro.features || ['4 live sessions', 'Lifetime recordings', 'Downloadable resources'],
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: program.pricing.premium.price,
      description: 'Everything + 1-on-1',
      features: program.pricing.premium.features || ['4 live sessions', 'Lifetime recordings', '2 personal coaching calls'],
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-warm-cream pt-24">
      {/* Hero Section */}
      <motion.section
        className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-gray/10 to-warm-cream"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <motion.div
            className="h-96 bg-gradient-to-br from-slate-gray/20 to-slate-gray/5 rounded-xl overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <img
              src={program.image}
              alt={program.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22500%22 height=%22400%22%3E%3Crect fill=%22%23d4a574%22 width=%22500%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%23333%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EProgram Cover%3C/text%3E%3C/svg%3E'
              }}
            />
          </motion.div>

          {/* Right: Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="text-sm font-semibold text-slate-gray uppercase mb-3 tracking-widest" style={{ letterSpacing: '0.8px' }}>{program.category}</div>
            <h1 className="text-3xl font-bold text-soft-black mb-4 tracking-tight" style={{ letterSpacing: '-0.01em', lineHeight: '1.2' }}>{program.title}</h1>
            <p className="text-base text-slate-gray mb-6" style={{ lineHeight: '1.7', letterSpacing: '0.3px' }}>{program.description}</p>

            {/* Instructor */}
            {program.instructor && (
              <div className="mb-6 pb-6 border-b border-slate-gray/20">
                <p className="text-slate-gray mb-2" style={{ letterSpacing: '0.2px' }}>
                  <span className="font-semibold">Instructor:</span> {program.instructor.name}
                </p>
                {program.instructor.expertise && (
                  <p className="text-slate-gray text-sm" style={{ letterSpacing: '0.2px' }}>
                    <span className="font-semibold">Expertise:</span> {program.instructor.expertise.join(', ')}
                  </p>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-slate-gray mb-1" style={{ letterSpacing: '0.2px' }}>
                  <Clock size={18} /> Duration
                </div>
                <p className="text-2xl font-bold text-soft-black" style={{ letterSpacing: '-0.01em' }}>{program.duration.weeks} weeks</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-slate-gray mb-1" style={{ letterSpacing: '0.2px' }}>
                  <Users size={18} /> Enrolled
                </div>
                <p className="text-2xl font-bold text-soft-black">{program.totalEnrolled}+</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-slate-gray mb-1">
                  <Star size={18} /> Rating
                </div>
                <p className="text-2xl font-bold text-soft-black">{program.ratings.average.toFixed(1)}/5</p>
              </div>
            </div>

            {/* Urgency Badge */}
            <motion.div className="bg-red-50 border-l-4 border-red-400 p-4 rounded" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <p className="text-sm font-semibold text-red-600">
                ⏰ Limited seats available • Next batch: {new Date(program.nextBatchDate).toLocaleDateString()}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-12">
            {/* What You'll Learn */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="text-2xl font-bold text-soft-black mb-6">What You'll Learn</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {program.outcomes && program.outcomes.length > 0 ? (
                  program.outcomes.map((outcome, i) => (
                    <div key={i} className="flex gap-4">
                      <Check size={24} className="text-slate-gray flex-shrink-0 mt-1" />
                      <p className="text-slate-gray text-lg">{outcome}</p>
                    </div>
                  ))
                ) : (
                  <p>No outcomes specified</p>
                )}
              </div>
            </motion.div>

            {/* Session Breakdown */}
            {program.sessions && program.sessions.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h2 className="text-2xl font-bold text-soft-black mb-6">Session Schedule</h2>
                <div className="space-y-4">
                  {program.sessions.map((session, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-slate-gray/10 hover:shadow-md transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-slate-gray font-semibold">Day {i + 1}</p>
                          <h4 className="text-xl font-bold text-soft-black mb-2">{session.title}</h4>
                          <p className="text-slate-gray">{session.description}</p>
                        </div>
                        <p className="text-sm text-slate-gray font-semibold whitespace-nowrap ml-4">{session.duration} min</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* About Section */}
            {program.longDescription && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h2 className="text-2xl font-bold text-soft-black mb-4">About This Program</h2>
                <p className="text-lg text-slate-gray leading-relaxed">{program.longDescription}</p>
              </motion.div>
            )}
          </div>

          {/* Right: Pricing & Enrollment */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="sticky top-28 space-y-6">
              {/* Tier Selection */}
              <div>
                <h3 className="text-lg font-bold text-soft-black mb-4">Choose Your Plan</h3>
                <div className="space-y-3">
                  {tiers.map((tier) => (
                    <motion.button
                      key={tier.id}
                      onClick={() => setSelectedTier(tier.id)}
                      className={`w-full p-4 rounded-lg border-2 transition text-left ${
                        selectedTier === tier.id
                          ? 'border-slate-gray bg-slate-gray/5'
                          : 'border-slate-gray/20 bg-white hover:border-slate-gray/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-soft-black">{tier.name}</p>
                        <p className="text-lg font-bold text-slate-gray">₹{tier.price}</p>
                      </div>
                      <p className="text-sm text-slate-gray">{tier.description}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-white p-6 rounded-xl border border-slate-gray/10">
                <h4 className="font-bold text-soft-black mb-4">Includes:</h4>
                <ul className="space-y-3">
                  {tiers
                    .find((t) => t.id === selectedTier)
                    ?.features.map((feature, i) => (
                      <li key={i} className="flex gap-3 text-slate-gray">
                        <Check size={20} className="text-slate-gray flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Enroll Button */}
              {enrolled ? (
                <motion.div
                  className="w-full bg-green-100 text-green-700 py-4 rounded-lg text-center font-semibold flex items-center justify-center gap-2"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                >
                  <Check size={24} /> Successfully Enrolled!
                </motion.div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full bg-slate-gray hover:bg-soft-black text-warm-cream py-4 rounded-lg transition font-bold text-lg disabled:opacity-50"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}

              {!user && (
                <p className="text-center text-sm text-slate-gray">
                  <button onClick={() => navigate('/auth')} className="text-slate-gray font-bold hover:underline">
                    Sign in
                  </button>{' '}
                  to enroll
                </p>
              )}

              {/* Money Back Guarantee */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                <p className="text-sm text-blue-900">
                  💯 <span className="font-semibold">30-day money-back guarantee</span> if not satisfied
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
