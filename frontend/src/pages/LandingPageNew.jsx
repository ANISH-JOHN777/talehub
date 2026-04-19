import React, { useState, Suspense, lazy } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { BookOpen, Users, Trophy, Zap, BarChart3, MessageSquare, Award, Check, X } from 'lucide-react'
import { Canvas3DErrorBoundary } from '../components/3d/ErrorBoundary'

const RotatingBook = lazy(() => import('../components/3d/RotatingBook'))

export default function LandingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [email, setEmail] = useState('')

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      navigate('/auth')
    }
  }

  const handleEmailSignup = (e) => {
    e.preventDefault()
    navigate('/auth')
  }

  return (
    <motion.div
      className="min-h-screen bg-warm-cream"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-warm-cream/95 border-b border-slate-gray/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <BookOpen size={28} className="text-soft-black" strokeWidth={1.5} />
              <span className="text-2xl font-semibold text-soft-black">TaleHub</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-gray hover:text-soft-black transition font-medium">Features</a>
              <a href="#pricing" className="text-slate-gray hover:text-soft-black transition font-medium">Pricing</a>
              <button
                onClick={handleGetStarted}
                className="bg-slate-gray hover:bg-soft-black text-warm-cream px-6 py-2 rounded-lg transition font-medium"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* 3D Book Display */}
          <motion.div
            className="h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-2xl"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Canvas3DErrorBoundary>
              <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-warm-cream to-slate-gray/10" />}>
                <RotatingBook />
              </Suspense>
            </Canvas3DErrorBoundary>
          </motion.div>

          {/* Text Content */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-soft-black mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Welcome to TaleHub
          </motion.h1>
          <p className="text-xl text-slate-gray mb-8 max-w-3xl mx-auto font-light leading-relaxed">
            Your new favorite way to experience books! Ever wanted to enjoy a great book but never had the time or patience to sit and read? <span className="font-semibold">That's exactly why we built TaleHub.</span>
          </p>
          <p className="text-lg text-slate-gray mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            We host <span className="font-semibold">daily live sessions</span> where expert narrators walk you through famous books — bit by bit — in a fun, easy, and fully informative way. Just join, listen, and learn. Missed a session? No problem — <span className="font-semibold">every completed session is saved</span> as a recorded replay so you can catch up anytime.
          </p>
          <p className="text-lg text-slate-gray mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Get access to <span className="font-semibold">world-famous books at a fraction of the cost</span> through our simple and affordable subscription plans — easy to join, easier to enjoy.
          </p>
          <p className="text-lg text-slate-gray mb-12 max-w-3xl mx-auto font-light leading-relaxed italic">
            TaleHub is for anyone who <span className="font-semibold">loves learning but hates reading</span> — no prior knowledge, no complicated steps, just great books explained in a way anyone can enjoy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={handleGetStarted}
              className="bg-slate-gray hover:bg-soft-black text-warm-cream px-8 py-3 rounded-lg font-semibold transition"
            >
              Start Learning
            </button>
            <button
              onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-slate-gray text-slate-gray hover:bg-slate-gray hover:text-warm-cream px-8 py-3 rounded-lg font-semibold transition"
            >
              View Plans
            </button>
          </div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-4 md:gap-8 mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white p-6 rounded-lg border border-slate-gray/10">
              <div className="text-3xl font-bold text-slate-gray">10K+</div>
              <div className="text-slate-gray text-sm mt-2 font-light">Active Members</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-gray/10">
              <div className="text-3xl font-bold text-slate-gray">5K+</div>
              <div className="text-slate-gray text-sm mt-2 font-light">Books</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-gray/10">
              <div className="text-3xl font-bold text-slate-gray">50K+</div>
              <div className="text-slate-gray text-sm mt-2 font-light">Hours</div>
            </div>
          </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-soft-black text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Why Join TaleHub?
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            viewport={{ once: true }}
          >
            {/* Feature 1 */}
            <motion.div
              className="border border-slate-gray/10 rounded-lg p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            >
              <BookOpen size={32} className="text-slate-gray mb-4" strokeWidth={1.5} />
              <h3 className="text-2xl font-semibold text-soft-black mb-3">Daily Live Sessions</h3>
              <p className="text-slate-gray font-light">
                Expert narrators walk you through famous books bit by bit in a fun, easy, and informative way. Join live or catch the replay anytime.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="border border-slate-gray/10 rounded-lg p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            >
              <Users size={32} className="text-slate-gray mb-4" strokeWidth={1.5} />
              <h3 className="text-2xl font-semibold text-soft-black mb-3">Learn with a Community</h3>
              <p className="text-slate-gray font-light">
                Connect with fellow learners worldwide. Share insights, discuss ideas, and grow together in a thoughtful, supportive community.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="border border-slate-gray/10 rounded-lg p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            >
              <Trophy size={32} className="text-slate-gray mb-4" strokeWidth={1.5} />
              <h3 className="text-2xl font-semibold text-soft-black mb-3">Affordable Access</h3>
              <p className="text-slate-gray font-light">
                Get world-famous books at a fraction of the cost. Simple and affordable subscription plans that work for everyone.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              className="border border-slate-gray/10 rounded-lg p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            >
              <BarChart3 size={32} className="text-slate-gray mb-4" strokeWidth={1.5} />
              <h3 className="text-2xl font-semibold text-soft-black mb-3">Never Miss a Session</h3>
              <p className="text-slate-gray font-light">
                Every completed session is saved as a recorded replay. Catch up anytime, anywhere. Your learning, on your schedule.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              className="border border-slate-gray/10 rounded-lg p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            >
              <MessageSquare size={32} className="text-slate-gray mb-4" strokeWidth={1.5} />
              <h3 className="text-2xl font-semibold text-soft-black mb-3">No Complications</h3>
              <p className="text-slate-gray font-light">
                For anyone who loves learning but hates reading. No prior knowledge needed, no complicated steps. Just great books explained simply.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              className="border border-slate-gray/10 rounded-lg p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            >
              <Award size={32} className="text-slate-gray mb-4" strokeWidth={1.5} />
              <h3 className="text-2xl font-semibold text-soft-black mb-3">Learn More, Read Less</h3>
              <p className="text-slate-gray font-light">
                Experience the joy of learning without the burden of traditional reading. Gain knowledge faster through expert narration and discussion.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-warm-cream">
        <motion.div className="max-w-6xl mx-auto" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <h2 className="text-4xl md:text-5xl font-bold text-soft-black text-center mb-4">
            Simple Pricing
          </h2>
          <p className="text-slate-gray text-center mb-16 text-lg font-light">
            Choose what works best for you
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white border border-slate-gray/20 rounded-lg p-8 flex flex-col">
              <h3 className="text-2xl font-semibold text-soft-black mb-2">Essential</h3>
              <div className="text-4xl font-bold text-slate-gray mb-8">$0<span className="text-base font-normal">/mo</span></div>
              <ul className="space-y-4 mb-auto text-slate-gray text-sm">
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-slate-gray flex-shrink-0" strokeWidth={2} />
                  <span>5 books monthly</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-slate-gray flex-shrink-0" strokeWidth={2} />
                  <span>Community forums</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-slate-gray flex-shrink-0" strokeWidth={2} />
                  <span>Basic badges</span>
                </li>
                <li className="flex items-center gap-3">
                  <X size={18} className="text-slate-gray/40 flex-shrink-0" strokeWidth={2} />
                  <span className="text-slate-gray/40">Smart recommendations</span>
                </li>
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full border-2 border-slate-gray text-slate-gray hover:bg-slate-gray hover:text-warm-cream px-6 py-3 rounded-lg font-semibold transition mt-8"
              >
                Get Started
              </button>
            </div>

            {/* Pro Plan - Featured */}
            <div className="bg-slate-gray rounded-lg p-8 flex flex-col text-warm-cream border-2 border-slate-gray">
              <div className="text-sm font-semibold text-warm-cream/80 mb-4">MOST POPULAR</div>
              <h3 className="text-2xl font-semibold mb-2">Professional</h3>
              <div className="text-4xl font-bold mb-8">$9.99<span className="text-base font-normal">/mo</span></div>
              <ul className="space-y-4 mb-auto text-warm-cream/90 text-sm">
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-warm-cream flex-shrink-0" strokeWidth={2} />
                  <span>Unlimited books</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-warm-cream flex-shrink-0" strokeWidth={2} />
                  <span>Smart recommendations</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-warm-cream flex-shrink-0" strokeWidth={2} />
                  <span>100+ premium books</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-warm-cream flex-shrink-0" strokeWidth={2} />
                  <span>Priority support</span>
                </li>
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full bg-warm-cream text-slate-gray hover:bg-white px-6 py-3 rounded-lg font-semibold transition mt-8"
              >
                Start Free Trial
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-white border border-slate-gray/20 rounded-lg p-8 flex flex-col">
              <h3 className="text-2xl font-semibold text-soft-black mb-2">Scholar</h3>
              <div className="text-4xl font-bold text-slate-gray mb-8">$4.99<span className="text-base font-normal">/mo</span></div>
              <ul className="space-y-4 mb-auto text-slate-gray text-sm">
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-slate-gray flex-shrink-0" strokeWidth={2} />
                  <span>All Professional features</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-slate-gray flex-shrink-0" strokeWidth={2} />
                  <span>Session recordings</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-slate-gray flex-shrink-0" strokeWidth={2} />
                  <span>Certificates</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-slate-gray flex-shrink-0" strokeWidth={2} />
                  <span>Advanced analytics</span>
                </li>
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full border-2 border-slate-gray text-slate-gray hover:bg-slate-gray hover:text-warm-cream px-6 py-3 rounded-lg font-semibold transition mt-8"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-soft-black">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-warm-cream mb-6">
            Ready to Start Reading?
          </h2>
          <p className="text-xl text-warm-cream/80 mb-12 font-light">
            Join a thoughtful community of readers building meaningful reading habits.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-slate-gray hover:bg-slate-gray/90 text-warm-cream px-8 py-4 rounded-lg font-semibold transition text-lg"
          >
            Get Started Today
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-soft-black border-t border-slate-gray/10 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-warm-cream font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-warm-cream/60 text-sm font-light">
                <li><a href="#" className="hover:text-warm-cream transition">Features</a></li>
                <li><a href="#" className="hover:text-warm-cream transition">Pricing</a></li>
                <li><a href="#" className="hover:text-warm-cream transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-warm-cream font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-warm-cream/60 text-sm font-light">
                <li><a href="#" className="hover:text-warm-cream transition">About</a></li>
                <li><a href="#" className="hover:text-warm-cream transition">Blog</a></li>
                <li><a href="#" className="hover:text-warm-cream transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-warm-cream font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-warm-cream/60 text-sm font-light">
                <li><a href="#" className="hover:text-warm-cream transition">Privacy</a></li>
                <li><a href="#" className="hover:text-warm-cream transition">Terms</a></li>
                <li><a href="#" className="hover:text-warm-cream transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-warm-cream font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-warm-cream/60 text-sm font-light">
                <li><a href="#" className="hover:text-warm-cream transition">Twitter</a></li>
                <li><a href="#" className="hover:text-warm-cream transition">LinkedIn</a></li>
                <li><a href="#" className="hover:text-warm-cream transition">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-gray/10 pt-8 text-center text-warm-cream/40 text-sm font-light">
            <p>&copy; 2026 TaleHub. Less reading. More knowing. All live.</p>
          </div>
        </motion.div>
      </footer>
    </motion.div>
  )
}
