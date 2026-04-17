import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Heart, Zap, Users, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AboutPage() {
  const navigate = useNavigate()

  const values = [
    {
      icon: <BookOpen size={32} className="text-slate-gray" />,
      title: 'Knowledge Accessibility',
      description: 'Make world-famous books accessible to everyone, regardless of reading ability or time constraints.',
    },
    {
      icon: <Heart size={32} className="text-slate-gray" />,
      title: 'Learning Joy',
      description: 'Transform learning from a chore into an enjoyable, interactive experience with expert guidance.',
    },
    {
      icon: <Zap size={32} className="text-slate-gray" />,
      title: 'Efficiency',
      description: 'Get deep insights from books in hours, not weeks. Learn the core concepts that matter most.',
    },
    {
      icon: <Users size={32} className="text-slate-gray" />,
      title: 'Community',
      description: 'Learn alongside peers globally, engage in discussions, and grow together as a community of learners.',
    },
  ]

  return (
    <div className="min-h-screen bg-warm-cream">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-warm-cream/95 border-b border-slate-gray/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer">
              <BookOpen size={28} className="text-slate-gray" />
              <span className="text-2xl font-bold text-soft-black">TaleHub</span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-slate-gray hover:text-soft-black font-medium transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl md:text-7xl font-bold text-soft-black mb-6 leading-tight">
            About TaleHub
          </h1>
          <p className="text-2xl text-slate-gray mb-8 leading-relaxed">
            Less reading. More knowing. All live.
          </p>
          <p className="text-xl text-slate-gray max-w-3xl mx-auto leading-relaxed">
            Welcome to TaleHub — your new favorite way to experience books. We're on a mission to make world-class knowledge accessible to everyone, regardless of how much time they have or how much patience they have for reading.
          </p>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold text-soft-black mb-6">The Problem We Solve</h2>
            <p className="text-lg text-slate-gray leading-relaxed mb-4">
              Ever wanted to enjoy a great book but never had the time or patience to sit and read? That's exactly why we built TaleHub. We recognized a gap between people's desire to learn and their ability to dedicate hours to reading dense books.
            </p>
            <p className="text-lg text-slate-gray leading-relaxed">
              Traditional reading demands focus, time, and persistence. Not everyone has all three. For anyone who loves learning but hates reading, TaleHub is the answer.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold text-soft-black mb-6">Our Solution</h2>
            <p className="text-lg text-slate-gray leading-relaxed mb-4">
              We host daily live sessions where expert narrators walk you through famous books — bit by bit — in a fun, easy, and fully informative way. Just join, listen, and learn.
            </p>
            <p className="text-lg text-slate-gray leading-relaxed mb-4">
              Missed a session? No problem. Every completed session is saved as a recorded replay so you can catch up anytime. Get access to world-famous books at a fraction of the cost of buying them, through our simple and affordable subscription plans.
            </p>
            <p className="text-lg text-slate-gray leading-relaxed">
              TaleHub is for anyone who loves learning — no prior knowledge, no complicated steps, just great books explained in a way anyone can enjoy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-bold text-soft-black mb-4">Our Values</h2>
            <p className="text-xl text-slate-gray">What drives everything we do at TaleHub</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                className="bg-warm-cream p-8 rounded-xl border border-slate-gray/10 hover:shadow-lg transition"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-soft-black mb-2">{value.title}</h3>
                <p className="text-slate-gray">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-gray text-warm-cream">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-5xl font-bold mb-2">50K+</div>
              <p className="text-lg opacity-90">Active Learners</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="text-5xl font-bold mb-2">200+</div>
              <p className="text-lg opacity-90">Books Available</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-5xl font-bold mb-2">1000+</div>
              <p className="text-lg opacity-90">Expert Sessions</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-5xl font-bold mb-2">4.9★</div>
              <p className="text-lg opacity-90">Average Rating</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-bold text-soft-black mb-6">Join Our Community</h2>
          <p className="text-xl text-slate-gray mb-8">Start your learning journey today. Easy to join. Easier to enjoy.</p>
          <button
            onClick={() => navigate('/programs')}
            className="bg-slate-gray hover:bg-soft-black text-warm-cream px-8 py-3 rounded-lg font-semibold transition flex items-center gap-2 mx-auto"
          >
            Explore Programs <ArrowRight size={20} />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-soft-black text-warm-cream py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="opacity-75">&copy; 2026 TaleHub. All rights reserved. Less reading. More knowing.</p>
        </div>
      </footer>
    </div>
  )
}
