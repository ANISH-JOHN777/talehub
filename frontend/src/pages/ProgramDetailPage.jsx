import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Users, Clock, Check, AlertCircle, Calendar, Heart, Share2, ArrowLeft, MessageSquare, BookOpen } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { showToast } from '../utils/toast'

const API_URL = 'http://localhost:5000/api'

export default function ProgramDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [program, setProgram] = useState(null)
  const [reviews, setReviews] = useState([])
  const [instructor, setInstructor] = useState(null)
  const [relatedPrograms, setRelatedPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTier, setSelectedTier] = useState('pro')
  const [enrolling, setEnrolling] = useState(false)
  const [enrolled, setEnrolled] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    fetchProgram()
  }, [id])

  const fetchProgram = async () => {
    try {
      const response = await axios.get(`${API_URL}/programs/${id}`)
      setProgram(response.data.data)

      // Fetch instructor details if available
      if (response.data.data.instructor?._id) {
        try {
          const instructorRes = await axios.get(`${API_URL}/instructors/${response.data.data.instructor._id}`)
          setInstructor(instructorRes.data.data)
        } catch (err) {
          console.error('Error fetching instructor:', err)
        }
      }

      // Fetch reviews
      try {
        const reviewsRes = await axios.get(`${API_URL}/reviews/program/${id}`)
        setReviews(reviewsRes.data.data || [])
      } catch (err) {
        console.error('Error fetching reviews:', err)
      }

      // Fetch related programs
      try {
        const relatedRes = await axios.get(`${API_URL}/programs?category=${response.data.data.category}&limit=3`)
        setRelatedPrograms(relatedRes.data.data?.filter(p => p._id !== id) || [])
      } catch (err) {
        console.error('Error fetching related programs:', err)
      }
    } catch (error) {
      showToast.error('Error fetching program details')
      console.error('Error fetching program:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    if (!user) {
      showToast.warning('Please login to enroll')
      navigate('/auth')
      return
    }

    navigate(`/enroll/${id}`)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: program?.title,
        text: program?.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      showToast.success('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center pt-24">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-4"
          >
            <div className="h-12 w-12 border-4 border-slate-gray border-t-soft-black rounded-full"></div>
          </motion.div>
          <p className="text-slate-gray text-lg">Loading program details...</p>
        </div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center pt-24">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-slate-gray text-lg mb-6">Program not found</p>
          <motion.button
            onClick={() => navigate('/programs')}
            className="bg-slate-gray text-warm-cream px-6 py-2 rounded-lg font-semibold"
            whileHover={{ scale: 1.05 }}
          >
            Back to Programs
          </motion.button>
        </div>
      </div>
    )
  }

  const tiers = [
    {
      id: 'basic',
      name: 'Basic',
      price: typeof program?.pricing?.basic === 'object' && program.pricing.basic.price ? program.pricing.basic.price : 199,
      description: 'Live sessions only',
      features: Array.isArray(program?.pricing?.basic?.features) ? program.pricing.basic.features : ['4 live sessions', 'Q&A with instructor', 'Community access'],
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: typeof program?.pricing?.pro === 'object' && program.pricing.pro.price ? program.pricing.pro.price : 399,
      description: 'Live + Recordings',
      features: Array.isArray(program?.pricing?.pro?.features) ? program.pricing.pro.features : ['4 live sessions', 'Lifetime recordings', 'Downloadable resources'],
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: typeof program?.pricing?.premium === 'object' && program.pricing.premium.price ? program.pricing.premium.price : 699,
      description: 'Everything + 1-on-1',
      features: Array.isArray(program?.pricing?.premium?.features) ? program.pricing.premium.features : ['4 live sessions', 'Lifetime recordings', '2 personal coaching calls'],
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
              src={typeof program.image === 'string' ? program.image : ''}
              alt={typeof program.title === 'string' ? program.title : 'Program'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22500%22 height=%22400%22%3E%3Crect fill=%22%23d4a574%22 width=%22500%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%23333%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EProgram Cover%3C/text%3E%3C/svg%3E'
              }}
            />
          </motion.div>

          {/* Right: Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="text-sm font-semibold text-slate-gray uppercase mb-3 tracking-widest" style={{ letterSpacing: '0.8px' }}>{typeof program.category === 'string' ? program.category : 'CATEGORY'}</div>
            <h1 className="text-3xl font-bold text-soft-black mb-4 tracking-tight" style={{ letterSpacing: '-0.01em', lineHeight: '1.2' }}>{typeof program.title === 'string' ? program.title : 'Program Title'}</h1>
            <p className="text-base text-slate-gray mb-6" style={{ lineHeight: '1.7', letterSpacing: '0.3px' }}>{typeof program.description === 'string' ? program.description : 'Program description'}</p>

            {/* Instructor */}
            {program.instructor && typeof program.instructor === 'object' && (
              <div className="mb-6 pb-6 border-b border-slate-gray/20">
                <p className="text-slate-gray mb-2" style={{ letterSpacing: '0.2px' }}>
                  <span className="font-semibold">Instructor:</span> {program.instructor.name || 'Expert Instructor'}
                </p>
                {Array.isArray(program.instructor.expertise) && program.instructor.expertise.length > 0 && (
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
                <p className="text-2xl font-bold text-soft-black" style={{ letterSpacing: '-0.01em' }}>
                  {typeof program.duration === 'object' ? `${program.duration?.weeks || 4} weeks` : program.duration || '4 weeks'}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-slate-gray mb-1" style={{ letterSpacing: '0.2px' }}>
                  <Users size={18} /> Enrolled
                </div>
                <p className="text-2xl font-bold text-soft-black">{program.totalEnrolled || 0}+</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-slate-gray mb-1">
                  <Star size={18} /> Rating
                </div>
                <p className="text-2xl font-bold text-soft-black">
                  {typeof program.ratings === 'object' ? (program.ratings?.average || 4.5).toFixed(1) : (program.ratings || 4.5).toFixed(1)}/5
                </p>
              </div>
            </div>

            {/* Urgency Badge */}
            {program.nextBatchDate && (
              <motion.div className="bg-red-50 border-l-4 border-red-400 p-4 rounded" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                <p className="text-sm font-semibold text-red-600">
                  ⏰ Limited seats available • Next batch: {new Date(program.nextBatchDate).toLocaleDateString()}
                </p>
              </motion.div>
            )}
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
                {Array.isArray(program.outcomes) && program.outcomes.length > 0 ? (
                  program.outcomes.map((outcome, i) => (
                    <div key={i} className="flex gap-4">
                      <Check size={24} className="text-slate-gray flex-shrink-0 mt-1" />
                      <p className="text-slate-gray text-lg">{typeof outcome === 'string' ? outcome : 'Learning outcome'}</p>
                    </div>
                  ))
                ) : (
                  <p>No outcomes specified</p>
                )}
              </div>
            </motion.div>

            {/* Session Breakdown */}
            {Array.isArray(program.sessions) && program.sessions.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h2 className="text-2xl font-bold text-soft-black mb-6">Session Schedule</h2>
                <div className="space-y-4">
                  {program.sessions.map((session, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-slate-gray/10 hover:shadow-md transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-slate-gray font-semibold">Day {i + 1}</p>
                          <h4 className="text-xl font-bold text-soft-black mb-2">{typeof session.title === 'string' ? session.title : 'Session'}</h4>
                          <p className="text-slate-gray">{typeof session.description === 'string' ? session.description : ''}</p>
                        </div>
                        <p className="text-sm text-slate-gray font-semibold whitespace-nowrap ml-4">{typeof session.duration === 'number' ? session.duration : 0} min</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* About Section */}
            {program.longDescription && typeof program.longDescription === 'string' && (
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
                  {Array.isArray(tiers.find((t) => t.id === selectedTier)?.features) && tiers
                    .find((t) => t.id === selectedTier)
                    ?.features.map((feature, i) => (
                      <li key={i} className="flex gap-3 text-slate-gray">
                        <Check size={20} className="text-slate-gray flex-shrink-0" />
                        <span>{typeof feature === 'string' ? feature : ''}</span>
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

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition font-semibold ${
                    isFavorite
                      ? 'border-red-500 bg-red-50 text-red-500'
                      : 'border-gray-200 text-slate-gray hover:border-slate-gray'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                  Save
                </motion.button>
                <motion.button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-200 text-slate-gray rounded-lg hover:border-slate-gray transition font-semibold"
                  whileHover={{ scale: 1.05 }}
                >
                  <Share2 size={20} />
                  Share
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Instructor Section */}
      {instructor && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-soft-black mb-8">Meet Your Instructor</h2>
            <motion.div
              className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 flex flex-col items-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-slate-gray to-soft-black rounded-full flex items-center justify-center mb-4">
                    <span className="text-5xl text-warm-cream">{instructor?.name?.charAt(0) || 'I'}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-soft-black text-center">{instructor?.name || 'Expert Instructor'}</h3>
                  <p className="text-slate-gray text-sm mt-2">{typeof instructor?.expertise === 'string' ? instructor.expertise : (Array.isArray(instructor?.expertise) ? instructor.expertise.join(', ') : 'Experienced Educator')}</p>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.floor(instructor?.rating || 4.8) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-slate-gray">{(typeof instructor?.rating === 'number' ? instructor.rating : 4.8).toFixed(1)}/5</span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <p className="text-slate-gray mb-6 leading-relaxed">{instructor?.bio || 'Expert instructor with years of experience in the field.'}</p>
                  
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-sm text-slate-gray mb-2">Total Students</p>
                      <p className="text-3xl font-bold text-soft-black">{(typeof instructor?.studentsCount === 'number' ? instructor.studentsCount : 0).toLocaleString()}+</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-gray mb-2">Programs Created</p>
                      <p className="text-3xl font-bold text-soft-black">{(typeof instructor?.programsCount === 'number' ? instructor.programsCount : 5)}+</p>
                    </div>
                  </div>

                  {Array.isArray(instructor?.achievements) && instructor.achievements.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-soft-black mb-3">Key Achievements</h4>
                      <div className="space-y-2">
                        {instructor.achievements.map((achievement, i) => (
                          <div key={i} className="flex items-center gap-2 text-slate-gray">
                            <Check size={16} className="text-green-500" />
                            {achievement}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-soft-black mb-8">Student Reviews</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.slice(0, 4).map((review, i) => (
                <motion.div
                  key={i}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-soft-black">{typeof review.userName === 'string' ? review.userName : 'Student'}</h4>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            size={14}
                            className={j < (typeof review.rating === 'number' ? review.rating : 5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-slate-gray">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recently'}</span>
                  </div>
                  <p className="text-slate-gray leading-relaxed">{typeof review.comment === 'string' ? review.comment : ''}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Programs */}
      {relatedPrograms.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-soft-black mb-8">Related Programs</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPrograms.map((prog, i) => (
                <motion.div
                  key={prog._id}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() => navigate(`/programs/${prog._id}`)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="h-40 bg-gradient-to-br from-slate-gray/20 to-slate-gray/5 flex items-center justify-center">
                    <BookOpen size={48} className="text-slate-gray/30" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-slate-gray font-semibold mb-2">{typeof prog.category === 'string' ? prog.category : 'Category'}</p>
                    <h4 className="font-semibold text-soft-black mb-2 line-clamp-2">{typeof prog.title === 'string' ? prog.title : 'Program'}</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-soft-black">
                          {typeof prog.ratings === 'object' ? (prog.ratings?.average || 4.5).toFixed(1) : (prog.ratings || 4.5).toFixed(1)}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-gray">
                        ${typeof prog.pricing === 'object' ? prog.pricing?.pro?.price || 299 : prog.pricing || 299}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
