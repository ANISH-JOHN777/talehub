import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Clock,
  Users,
  Bot,
  AlertCircle,
  Check,
  X,
  Play,
  Phone,
  DollarSign,
  ChevronRight,
} from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import imageUrls from '../utils/imageUrls'

const API_URL = 'http://localhost:5000/api'

export default function EnrollmentCustomizationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  // State management
  const [program, setProgram] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeStep, setActiveStep] = useState(1)
  const [instructors, setInstructors] = useState([])
  const [selectedInstructor, setSelectedInstructor] = useState(null)
  const [instructorsLoading, setInstructorsLoading] = useState(false)

  // Customization states
  const [sessionType, setSessionType] = useState('human') // 'human' or 'ai'
  const [sessionCount, setSessionCount] = useState(4)
  const [sessionDates, setSessionDates] = useState([])
  const [sessionTimes, setSessionTimes] = useState([])
  const [phoneNumber, setPhoneNumber] = useState('')
  const [videoOpen, setVideoOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [currentPrice, setCurrentPrice] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  // Pricing configuration
  const pricingByType = {
    human: {
      perSession: 50,
      description: 'Live expert-led sessions with Q&A',
      color: 'from-slate-gray to-dark-blue',
    },
    oneOnOne: {
      perSession: 150,
      description: 'Private one-on-one sessions with instructor',
      color: 'from-accent-gold to-yellow-500',
    },
    ai: {
      perSession: 25,
      description: 'AI-powered personalized learning',
      color: 'from-slate-gray to-slate-700',
    },
  }

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchProgram()
    fetchInstructors()
  }, [id, user, navigate])

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeStep])

  const fetchInstructors = async () => {
    try {
      setInstructorsLoading(true)
      const response = await axios.get(`${API_URL}/instructors`)
      setInstructors(response.data.data || [])
      // Auto-select first instructor if available
      if (response.data.data && response.data.data.length > 0) {
        setSelectedInstructor(response.data.data[0]._id)
      }
    } catch (error) {
      console.error('Error fetching instructors:', error)
    } finally {
      setInstructorsLoading(false)
    }
  }

  const fetchProgram = async () => {
    try {
      const response = await axios.get(`${API_URL}/programs/${id}`)
      setProgram(response.data.data)
      // Initialize session dates with upcoming dates
      initializeSessionDates(4)
    } catch (error) {
      console.error('Error fetching program:', error)
    } finally {
      setLoading(false)
    }
  }

  const initializeSessionDates = (count) => {
    const dates = []
    const times = []
    const today = new Date()

    for (let i = 0; i < count; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + (i + 1) * 7) // Weekly sessions
      dates.push(date.toISOString().split('T')[0])
      times.push('10:00')
    }

    setSessionDates(dates)
    setSessionTimes(times)
  }

  const handleSessionCountChange = (count) => {
    setSessionCount(count)
    initializeSessionDates(count)
  }

  const handleDateChange = (index, date) => {
    const newDates = [...sessionDates]
    newDates[index] = date
    setSessionDates(newDates)
  }

  const handleTimeChange = (index, time) => {
    const newTimes = [...sessionTimes]
    newTimes[index] = time
    setSessionTimes(newTimes)
  }

  const handleSessionTypeChange = (type) => {
    setSessionType(type)
  }

  const calculatePrice = () => {
    return sessionCount * pricingByType[sessionType].perSession
  }

  useEffect(() => {
    setCurrentPrice(calculatePrice())
  }, [sessionCount, sessionType])

  const handleProceedToPayment = async () => {
    // Validate inputs
    if (!phoneNumber.trim()) {
      alert('Please enter your phone number')
      return
    }

    if (!/^\d{10}$/.test(phoneNumber.replace(/\D/g, ''))) {
      alert('Please enter a valid phone number')
      return
    }

    if (!selectedInstructor) {
      alert('Please select an instructor')
      return
    }

    // Prepare enrollment data
    const tierMap = {
      oneOnOne: 'VIP',
      human: 'Premium',
      ai: 'Pro',
    }
    const enrollmentData = {
      programId: id,
      sessionType,
      sessionCount,
      instructorId: selectedInstructor,
      customizedSessions: sessionDates.map((date, index) => ({
        date,
        time: sessionTimes[index],
        status: 'scheduled',
      })),
      phoneNumber,
      price: currentPrice,
      tier: tierMap[sessionType],
    }

    // Store enrollment data for payment page
    sessionStorage.setItem('pendingEnrollment', JSON.stringify(enrollmentData))

    // Navigate to payment
    navigate('/payment', { state: { enrollmentData } })
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
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-slate-gray text-lg">Program not found</p>
        </div>
      </div>
    )
  }

  const sampleVideos = [
    {
      id: 1,
      title: 'Book Overview & Introduction',
      thumbnail: 'https://via.placeholder.com/300x170?text=Video+1',
      duration: '12:34',
    },
    {
      id: 2,
      title: 'Key Concepts Explained',
      thumbnail: 'https://via.placeholder.com/300x170?text=Video+2',
      duration: '15:20',
    },
    {
      id: 3,
      title: 'Deep Dive into Chapter 1',
      thumbnail: 'https://via.placeholder.com/300x170?text=Video+3',
      duration: '18:45',
    },
  ]

  return (
    <div className="min-h-screen bg-warm-cream pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-soft-black mb-2">
            Customize Your Enrollment
          </h1>
          <p className="text-base text-slate-gray">
            {program.title} - Personalize your learning journey
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12 flex justify-between items-center"
        >
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => setActiveStep(step)}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold cursor-pointer transition-all ${
                  activeStep >= step
                    ? 'bg-slate-gray text-warm-cream'
                    : 'bg-slate-200 text-slate-gray'
                }`}
              >
                {step}
              </motion.div>
              {step < 6 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all ${
                    activeStep > step
                      ? 'bg-slate-gray'
                      : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Content Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Session Type Selection */}
              {activeStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-dark-blue mb-6">
                      Step 1: Choose Session Type
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Human Session */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleSessionTypeChange('human')}
                        className={`p-8 rounded-xl cursor-pointer transition-all border-2 ${
                          sessionType === 'human'
                            ? 'border-slate-gray bg-slate-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <Users size={32} className="text-slate-gray" />
                          {sessionType === 'human' && (
                            <Check size={24} className="text-slate-gray" />
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-dark-blue mb-2">
                          Live with Expert
                        </h3>
                        <p className="text-slate-gray mb-4 text-sm">
                          {pricingByType.human.description}
                        </p>
                        <p className="text-2xl font-bold text-slate-gray">
                          ₹{pricingByType.human.perSession}
                          <span className="text-sm text-slate-gray">/session</span>
                        </p>
                        <div className="mt-4 space-y-2 text-sm text-slate-600">
                          <div className="flex items-center">
                            <Check size={16} className="mr-2 text-green-500" />
                            Live interaction with expert
                          </div>
                          <div className="flex items-center">
                            <Check size={16} className="mr-2 text-green-500" />
                            Real-time Q&A sessions
                          </div>
                          <div className="flex items-center">
                            <Check size={16} className="mr-2 text-green-500" />
                            Personalized feedback
                          </div>
                        </div>
                      </motion.div>

                      {/* 1 on 1 Session */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleSessionTypeChange('oneOnOne')}
                        className={`p-8 rounded-xl cursor-pointer transition-all border-2 ${
                          sessionType === 'oneOnOne'
                            ? 'border-accent-gold bg-yellow-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <Phone size={32} className="text-accent-gold" />
                          {sessionType === 'oneOnOne' && (
                            <Check size={24} className="text-accent-gold" />
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-dark-blue mb-2">
                          1 on 1 Session
                        </h3>
                        <p className="text-slate-gray mb-4 text-sm">
                          {pricingByType.oneOnOne.description}
                        </p>
                        <p className="text-2xl font-bold text-accent-gold">
                          ₹{pricingByType.oneOnOne.perSession}
                          <span className="text-sm text-slate-gray">/session</span>
                        </p>
                        <div className="mt-4 space-y-2 text-sm text-slate-600">
                          <div className="flex items-center">
                            <Check size={16} className="mr-2 text-accent-gold" />
                            Exclusive 1-on-1 time with instructor
                          </div>
                          <div className="flex items-center">
                            <Check size={16} className="mr-2 text-accent-gold" />
                            Customized learning plan
                          </div>
                          <div className="flex items-center">
                            <Check size={16} className="mr-2 text-accent-gold" />
                            Priority support
                          </div>
                        </div>
                      </motion.div>

                      {/* AI Session */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleSessionTypeChange('ai')}
                        className={`p-8 rounded-xl cursor-pointer transition-all border-2 ${
                          sessionType === 'ai'
                            ? 'border-slate-gray bg-slate-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <Bot size={32} className="text-slate-gray" />
                          {sessionType === 'ai' && (
                            <Check size={24} className="text-slate-gray" />
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-dark-blue mb-2">
                          AI-Powered Learning
                        </h3>
                        <p className="text-slate-gray mb-4 text-sm">
                          {pricingByType.ai.description}
                        </p>
                        <p className="text-2xl font-bold text-slate-gray">
                          ₹{pricingByType.ai.perSession}
                          <span className="text-sm text-slate-gray">/session</span>
                        </p>
                        <div className="mt-4 space-y-2 text-sm text-slate-600">
                          <div className="flex items-center">
                            <Check size={16} className="mr-2 text-green-500" />
                            Self-paced learning
                          </div>
                          <div className="flex items-center">
                            <Check size={16} className="mr-2 text-green-500" />
                            24/7 AI assistance
                          </div>
                          <div className="flex items-center">
                            <Check size={16} className="mr-2 text-green-500" />
                            Affordable option
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveStep(2)}
                    className="w-full bg-slate-gray text-warm-cream py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all"
                  >
                    Next: Session Schedule <ChevronRight className="inline ml-2" size={20} />
                  </motion.button>
                </motion.div>
              )}

              {/* Step 2: Session Schedule */}
              {activeStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-dark-blue mb-6">
                      Step 2: Schedule Your Sessions
                    </h2>

                    {/* Session Count */}
                    <div className="mb-8">
                      <label className="block text-lg font-bold text-dark-blue mb-4">
                        Number of Sessions
                      </label>
                      <div className="flex gap-3 flex-wrap">
                        {[4, 8, 12, 16].map((count) => (
                          <motion.button
                            key={count}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSessionCountChange(count)}
                            className={`px-6 py-3 rounded-lg font-bold transition-all ${
                              sessionCount === count
                                ? 'bg-slate-gray text-warm-cream shadow-lg'
                                : 'bg-slate-100 text-dark-blue hover:bg-slate-200'
                            }`}
                          >
                            {count} Sessions
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Session Details */}
                    <div className="bg-slate-50 rounded-xl p-6 mb-8">
                      <h3 className="font-bold text-dark-blue mb-4">Session Details</h3>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {sessionDates.map((date, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex gap-4 items-end bg-white p-4 rounded-lg"
                          >
                            <div className="flex-1">
                              <label className="block text-sm font-semibold text-slate-600 mb-2">
                                Session {index + 1} Date
                              </label>
                              <input
                                type="date"
                                value={date}
                                onChange={(e) => handleDateChange(index, e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-gray outline-none"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-sm font-semibold text-slate-600 mb-2">
                                Time
                              </label>
                              <input
                                type="time"
                                value={sessionTimes[index]}
                                onChange={(e) => handleTimeChange(index, e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-gray outline-none"
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveStep(1)}
                      className="flex-1 bg-slate-200 text-dark-blue py-4 rounded-xl font-bold hover:bg-slate-300 transition-colors"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveStep(3)}
                      className="flex-1 bg-slate-gray text-warm-cream py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all"
                    >
                      Next: Select Instructor <ChevronRight className="inline ml-2" size={20} />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Select Instructor */}
              {activeStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-dark-blue mb-6">
                      Step 3: Choose Your Instructor
                    </h2>
                    <p className="text-slate-600 mb-6">
                      Select an instructor you'd like to work with. Your instructor will guide you throughout your learning journey.
                    </p>

                    {instructorsLoading ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
                        <p className="text-slate-gray">Loading instructors...</p>
                      </div>
                    ) : instructors.length === 0 ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
                        No instructors available
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {instructors.map((instructor) => (
                          <motion.div
                            key={instructor._id}
                            whileHover={!instructor.isFullyBooked ? { scale: 1.02 } : {}}
                            onClick={() => {
                              if (instructor.isFullyBooked) {
                                alert('This instructor is fully booked')
                                return
                              }
                              setSelectedInstructor(instructor._id)
                            }}
                            className={`p-6 rounded-xl transition-all border-2 ${
                              instructor.isFullyBooked ? 'cursor-not-allowed' : 'cursor-pointer'
                            } ${
                              selectedInstructor === instructor._id
                                ? 'border-slate-gray bg-slate-50'
                                : 'border-slate-200 hover:border-slate-300'
                            } ${instructor.isFullyBooked ? 'opacity-60' : ''}`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-dark-blue mb-1">
                                  {instructor.name}
                                </h3>
                                <p className="text-sm text-slate-gray font-semibold mb-2">
                                  {instructor.expertise}
                                </p>
                              </div>
                              {selectedInstructor === instructor._id && (
                                <Check size={24} className="text-slate-gray flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                              {instructor.bio || 'Expert instructor'}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-xs text-slate-600">
                                <Users size={14} />
                                <span>{instructor.totalStudents || 0} students</span>
                              </div>
                              {/* Availability Badge */}
                              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                instructor.isFullyBooked
                                  ? 'bg-red-100 text-red-700'
                                  : instructor.availableSlots <= 2
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {instructor.isFullyBooked ? '❌ Fully Booked' : `✓ ${instructor.availableSlots} slots`}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveStep(2)}
                      className="flex-1 bg-slate-200 text-dark-blue py-4 rounded-xl font-bold hover:bg-slate-300 transition-colors"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (!selectedInstructor) {
                          alert('Please select an instructor')
                          return
                        }
                        const selectedInstructorData = instructors.find(i => i._id === selectedInstructor)
                        if (selectedInstructorData?.isFullyBooked) {
                          alert('This instructor is fully booked. Please select another instructor.')
                          return
                        }
                        setActiveStep(4)
                      }}
                      className="flex-1 bg-slate-gray text-warm-cream py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all disabled:opacity-50"
                      disabled={!selectedInstructor}
                    >
                      Next: Video Library <ChevronRight className="inline ml-2" size={20} />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Recorded Videos (was Step 3) */}
              {activeStep === 4 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-dark-blue mb-6">
                      Step 4: Book Explanation Videos
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {sampleVideos.map((video) => (
                        <motion.div
                          key={video.id}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => {
                            setSelectedVideo(video)
                            setVideoOpen(true)
                          }}
                          className="group cursor-pointer rounded-xl overflow-hidden bg-slate-100"
                        >
                          <div className="relative overflow-hidden h-40">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all flex items-center justify-center">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="bg-white text-slate-gray p-4 rounded-full"
                              >
                                <Play size={24} fill="currentColor" />
                              </motion.div>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-dark-blue mb-2">{video.title}</h3>
                            <div className="flex items-center justify-between text-sm text-slate-600">
                              <Clock size={16} />
                              <span>{video.duration}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {videoOpen && selectedVideo && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-6 p-6 bg-slate-900 rounded-xl"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-white font-bold">{selectedVideo.title}</h3>
                          <button
                            onClick={() => setVideoOpen(false)}
                            className="text-white hover:text-slate-300"
                          >
                            <X size={24} />
                          </button>
                        </div>
                        <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                          <play className="text-white text-6xl opacity-30">
                            Video Player
                          </play>
                        </div>
                      </motion.div>
                    )}

                    <p className="text-slate-600 text-sm">
                      These videos are part of your learning material. Access them anytime during your
                      enrollment period.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveStep(3)}
                      className="flex-1 bg-slate-200 text-dark-blue py-4 rounded-xl font-bold hover:bg-slate-300 transition-colors"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveStep(5)}
                      className="flex-1 bg-slate-gray text-warm-cream py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all"
                    >
                      Next: Contact Info <ChevronRight className="inline ml-2" size={20} />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Contact Information */}
              {activeStep === 5 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-dark-blue mb-6">
                      Step 5: Contact Information
                    </h2>

                    <div className="space-y-6">
                      {/* Email */}
                      <div>
                        <label className="block text-lg font-bold text-dark-blue mb-3">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-100 text-slate-600"
                        />
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-lg font-bold text-dark-blue mb-3">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center">
                          <span className="px-4 py-3 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg text-slate-600 font-semibold">
                            +91
                          </span>
                          <input
                            type="tel"
                            placeholder="10-digit mobile number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            className="flex-1 px-4 py-3 border border-slate-300 rounded-r-lg focus:ring-2 focus:ring-slate-gray outline-none"
                          />
                        </div>
                        <p className="text-sm text-slate-600 mt-2">
                          We'll use this to send session reminders and updates.
                        </p>
                      </div>

                      {/* Name */}
                      <div>
                        <label className="block text-lg font-bold text-dark-blue mb-3">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={user?.name || user?.email?.split('@')[0] || ''}
                          disabled
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-100 text-slate-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveStep(4)}
                      className="flex-1 bg-slate-200 text-dark-blue py-4 rounded-xl font-bold hover:bg-slate-300 transition-colors"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveStep(6)}
                      className="flex-1 bg-slate-gray text-warm-cream py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all"
                    >
                      Next: Review & Pay <ChevronRight className="inline ml-2" size={20} />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 6: Review & Payment */}
              {activeStep === 6 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-dark-blue mb-6">
                      Step 6: Review & Complete Payment
                    </h2>

                    <div className="space-y-6">
                      {/* Order Summary */}
                      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6">
                        <h3 className="font-bold text-dark-blue mb-4">Order Summary</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Program</span>
                            <span className="font-semibold text-dark-blue">{program.title}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Session Type</span>
                            <span className="font-semibold text-dark-blue capitalize">
                              {sessionType === 'human' ? 'Live with Expert' : 'AI-Powered'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Total Sessions</span>
                            <span className="font-semibold text-dark-blue">{sessionCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Price per Session</span>
                            <span className="font-semibold text-dark-blue">
                              ₹{pricingByType[sessionType].perSession}
                            </span>
                          </div>
                          <div className="border-t border-slate-300 pt-3 flex justify-between">
                            <span className="font-bold text-dark-blue">Total Amount</span>
                            <span className="text-2xl font-bold text-slate-gray">
                              ₹{currentPrice}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Confirmation Checkboxes */}
                      <div className="space-y-3">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="mt-1 w-5 h-5 rounded border-slate-300"
                          />
                          <span className="text-sm text-slate-600">
                            I agree to the{' '}
                            <a href="#" className="text-slate-gray font-semibold hover:underline">
                              Terms of Service
                            </a>
                          </span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="mt-1 w-5 h-5 rounded border-slate-300"
                          />
                          <span className="text-sm text-slate-600">
                            I want to receive session reminders on my phone
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveStep(5)}
                      className="flex-1 bg-slate-200 text-dark-blue py-4 rounded-xl font-bold hover:bg-slate-300 transition-colors"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleProceedToPayment}
                      disabled={isProcessing || !phoneNumber}
                      className="flex-1 bg-slate-gray text-warm-cream py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <span className="inline-block animate-spin mr-2">⏳</span>
                          Processing...
                        </>
                      ) : (
                        <>
                          Proceed to Payment <ChevronRight className="inline ml-2" size={20} />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar - Price Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-32 space-y-6"
            >
              {/* Price Card */}
              <div
                className={`bg-gradient-to-br ${pricingByType[sessionType].color} text-white rounded-2xl p-6 shadow-xl`}
              >
                <h3 className="font-bold text-lg mb-4">Enrollment Summary</h3>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="opacity-90">Session Type</span>
                    <span className="font-semibold capitalize">
                      {sessionType === 'human' ? 'Live' : 'AI'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-90">Sessions</span>
                    <span className="font-semibold">{sessionCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-90">Per Session</span>
                    <span className="font-semibold">
                      ₹{pricingByType[sessionType].perSession}
                    </span>
                  </div>

                  <div className="border-t border-white/20 pt-4 flex justify-between items-baseline">
                    <span className="opacity-90">Total</span>
                    <span className="text-2xl font-bold">₹{currentPrice}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-green-300" />
                    <span>Lifetime access to videos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-green-300" />
                    <span>Session recordings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-green-300" />
                    <span>Flexible schedule</span>
                  </div>
                  {sessionType === 'human' && (
                    <>
                      <div className="flex items-center gap-2">
                        <Check size={16} className="text-green-300" />
                        <span>Live Q&A sessions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check size={16} className="text-green-300" />
                        <span>Expert feedback</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Program Info Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="font-bold text-dark-blue mb-4">Program Details</h3>
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23d4a574%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2220%22 fill=%22%23333%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EProgram Cover%3C/text%3E%3C/svg%3E'
                  }}
                />
                <p className="text-sm text-slate-600 mb-4">{program.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <Clock size={16} className="text-slate-gray flex-shrink-0" />
                    <span className="text-slate-600">
                      {program.duration.weeks} weeks, {program.duration.hours} hours
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Users size={16} className="text-slate-gray flex-shrink-0" />
                    <span className="text-slate-600">{program.level} Level</span>
                  </div>
                </div>
              </div>

              {/* FAQ Card */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="font-bold text-dark-blue mb-4">FAQ</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-slate-700 mb-1">Can I change my schedule?</p>
                    <p className="text-slate-600 text-xs">
                      Yes, you can reschedule sessions up to 24 hours before.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 mb-1">Is there a refund policy?</p>
                    <p className="text-slate-600 text-xs">
                      30-day money-back guarantee if not satisfied.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
