import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, MessageCircle, Users, Clock, Volume2 } from 'lucide-react'

export default function SessionPage() {
  const { sessionId } = useParams()
  const [isMuted, setIsMuted] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, author: 'James Clear', message: 'Great question! Habit stacking is...', time: '2 min ago' },
    { id: 2, author: 'Sarah M.', message: 'How do I handle setbacks?', time: '1 min ago' },
  ])
  const [newMessage, setNewMessage] = useState('')

  const session = {
    title: 'Atomic Habits - Session 1: The Foundation',
    program: 'Atomic Habits',
    instructor: 'James Clear',
    duration: '45 min',
    liveUrl: 'https://meet.google.com/xxx-xxxx-xxx',
    viewers: 234,
    status: 'live', // 'live' or 'upcoming' or 'recorded'
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          author: 'You',
          message: newMessage,
          time: 'now',
        },
      ])
      setNewMessage('')
    }
  }

  return (
    <div className="min-h-screen bg-soft-black pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Main Video Area */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Video Player */}
            <div className="bg-black rounded-2xl overflow-hidden mb-6 relative group">
              <div className="aspect-video bg-gradient-to-br from-slate-gray/20 to-slate-gray/5 relative flex items-center justify-center">
                <img
                  src="https://via.placeholder.com/800x450?text=Live+Session"
                  alt="Session"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Play className="text-warm-cream" size={80} />
                </div>

                {/* Live Badge */}
                {session.status === 'live' && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    LIVE
                  </div>
                )}

                {/* Viewers Count */}
                <div className="absolute top-4 right-4 bg-black/60 text-warm-cream px-4 py-2 rounded-full text-sm flex items-center gap-2">
                  <Users size={16} /> {session.viewers} watching
                </div>
              </div>

              {/* Player Controls */}
              <div className="bg-soft-black p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="text-warm-cream hover:text-slate-gray transition">
                    <Play size={24} />
                  </button>
                  <div className="w-64 h-1 bg-slate-gray/30 rounded-full">
                    <div className="w-1/3 h-full bg-slate-gray rounded-full"></div>
                  </div>
                  <span className="text-warm-cream text-sm">14:32 / 45:00</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-warm-cream hover:text-slate-gray transition"
                  >
                    {isMuted ? '🔇' : <Volume2 size={24} />}
                  </button>
                  <button className="text-warm-cream hover:text-slate-gray transition text-2xl">⛶</button>
                </div>
              </div>
            </div>

            {/* Session Info */}
            <div className="bg-slate-gray/10 rounded-xl p-6 mb-6 border border-slate-gray/20">
              <h1 className="text-3xl font-bold text-warm-cream mb-4">{session.title}</h1>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <p className="text-warm-cream/60 text-sm">Program</p>
                  <p className="text-warm-cream font-semibold">{session.program}</p>
                </div>
                <div>
                  <p className="text-warm-cream/60 text-sm">Instructor</p>
                  <p className="text-warm-cream font-semibold">{session.instructor}</p>
                </div>
                <div>
                  <p className="text-warm-cream/60 text-sm">Duration</p>
                  <p className="text-warm-cream font-semibold flex items-center gap-1">
                    <Clock size={16} /> {session.duration}
                  </p>
                </div>
                <div>
                  <p className="text-warm-cream/60 text-sm">Status</p>
                  <p className="text-warm-cream font-semibold capitalize text-green-400">{session.status}</p>
                </div>
              </div>
            </div>

            {/* Session Description */}
            <div className="bg-slate-gray/10 rounded-xl p-6 border border-slate-gray/20">
              <h2 className="text-xl font-bold text-warm-cream mb-4">About This Session</h2>
              <p className="text-warm-cream/80 leading-relaxed">
                In this inaugural session, James Clear introduces the foundational concepts of Atomic Habits. Learn why small changes compound into remarkable results and discover the four laws of behavior change that underly all habit formation. This session covers the science of tiny habits and how to implement them in your daily life.
              </p>

              <div className="mt-6 pt-6 border-t border-slate-gray/20">
                <h3 className="text-lg font-bold text-warm-cream mb-4">What You'll Learn</h3>
                <ul className="space-y-2 text-warm-cream/80">
                  <li>✓ The power of 1% daily improvements</li>
                  <li>✓ The four stages of habit formation</li>
                  <li>✓ How to design your environment for success</li>
                  <li>✓ Practical habit-stacking techniques</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Chat Sidebar */}
          <motion.div
            className="lg:col-span-1 bg-slate-gray/10 rounded-xl border border-slate-gray/20 flex flex-col h-fit"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Chat Header */}
            <div className="p-6 border-b border-slate-gray/20">
              <h3 className="text-lg font-bold text-warm-cream flex items-center gap-2">
                <MessageCircle size={20} /> Live Chat
              </h3>
              <p className="text-warm-cream/60 text-sm">{messages.length} messages</p>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-96">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className="text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-warm-cream">{msg.author}</p>
                    <p className="text-warm-cream/50 text-xs">{msg.time}</p>
                  </div>
                  <p className="text-warm-cream/80 bg-slate-gray/20 p-2 rounded">{msg.message}</p>
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-slate-gray/20">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 bg-slate-gray/20 text-warm-cream placeholder-warm-cream/50 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-gray"
                />
                <button
                  type="submit"
                  className="bg-slate-gray hover:bg-slate-gray/80 text-warm-cream px-4 py-2 rounded-lg transition font-semibold"
                >
                  Send
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>

        {/* Session Controls */}
        <motion.div
          className="mt-8 bg-slate-gray/10 rounded-xl p-6 border border-slate-gray/20 flex gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button className="flex-1 bg-slate-gray hover:bg-slate-gray/80 text-warm-cream py-3 rounded-lg transition font-semibold">
            📝 Take Notes
          </button>
          <button className="flex-1 bg-slate-gray/20 hover:bg-slate-gray/30 text-warm-cream py-3 rounded-lg transition font-semibold">
            ❤️ Like Session
          </button>
          <button className="flex-1 bg-slate-gray/20 hover:bg-slate-gray/30 text-warm-cream py-3 rounded-lg transition font-semibold">
            🔖 Bookmark
          </button>
          <button className="flex-1 bg-slate-gray/20 hover:bg-slate-gray/30 text-warm-cream py-3 rounded-lg transition font-semibold">
            📤 Share
          </button>
        </motion.div>
      </div>
    </div>
  )
}
