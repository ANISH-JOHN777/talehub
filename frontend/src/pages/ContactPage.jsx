import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, MessageCircle, Phone, MapPin, HelpCircle } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const faqs = [
    {
      q: 'How do I reset my password?',
      a: 'Click "Forgot Password" on the login page. We\'ll send you a reset link via email.',
    },
    {
      q: 'Can I download course materials?',
      a: 'Yes! Pro & Premium plans include downloadable resources. Basic plan doesn\'t include downloads.',
    },
    {
      q: 'How long do I have access?',
      a: 'Basic: 5 days after completion. Pro & Premium: Lifetime access to all recordings.',
    },
    {
      q: 'What payment methods are accepted?',
      a: 'We accept all major credit cards, UPI, and net banking through Razorpay.',
    },
    {
      q: 'Can I get a refund?',
      a: '30-day money-back guarantee. No questions asked. Email support@talehub.com',
    },
    {
      q: 'How do I contact my instructor?',
      a: 'Premium plan members can request direct contact. Others can use the Q&A forum.',
    },
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would send the form data to a backend
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' })
      setSubmitted(false)
    }, 3000)
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
          <h1 className="text-6xl font-bold text-soft-black mb-4">Get in Touch</h1>
          <p className="text-xl text-slate-gray max-w-2xl mx-auto">
            Have questions? Our support team is here to help. Reach out to us anytime.
          </p>
        </motion.div>

        {/* Contact Options */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {[
            {
              icon: <Mail size={32} />,
              title: 'Email',
              description: 'Send us a message anytime',
              contact: 'support@talehub.com',
              link: 'mailto:support@talehub.com',
            },
            {
              icon: <MessageCircle size={32} />,
              title: 'WhatsApp',
              description: 'Chat with us on WhatsApp',
              contact: '+91 9876 543210',
              link: 'https://wa.me/919876543210',
            },
            {
              icon: <Phone size={32} />,
              title: 'Phone',
              description: 'Call our support team',
              contact: '1-800-TALEHUB (825-3482)',
              link: 'tel:1-800-825-3482',
            },
          ].map((option, i) => (
            <motion.a
              key={i}
              href={option.link}
              className="bg-white p-8 rounded-xl border border-slate-gray/10 hover:shadow-lg transition text-center group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-slate-gray mb-4 group-hover:text-soft-black transition inline-block">
                {option.icon}
              </div>
              <h3 className="text-xl font-bold text-soft-black mb-2">{option.title}</h3>
              <p className="text-slate-gray text-sm mb-4">{option.description}</p>
              <p className="font-semibold text-slate-gray group-hover:text-soft-black transition">
                {option.contact}
              </p>
            </motion.a>
          ))}
        </motion.div>

        {/* Contact Form & FAQ */}
        <motion.div
          className="grid lg:grid-cols-2 gap-12 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Form */}
          <div className="bg-white p-8 rounded-xl border border-slate-gray/10">
            <h2 className="text-2xl font-bold text-soft-black mb-6 flex items-center gap-2">
              <Send size={24} /> Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-slate-gray/20 rounded-lg focus:outline-none focus:border-slate-gray"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-slate-gray/20 rounded-lg focus:outline-none focus:border-slate-gray"
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-slate-gray/20 rounded-lg focus:outline-none focus:border-slate-gray"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-3 border-2 border-slate-gray/20 rounded-lg focus:outline-none focus:border-slate-gray resize-none"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-slate-gray hover:bg-soft-black text-warm-cream py-3 rounded-lg transition font-semibold"
              >
                {submitted ? '✓ Message Sent!' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold text-soft-black mb-6 flex items-center gap-2">
              <HelpCircle size={24} /> Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  className="bg-white p-4 rounded-lg border border-slate-gray/10 hover:shadow-md transition"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <h3 className="font-bold text-soft-black mb-2">{faq.q}</h3>
                  <p className="text-slate-gray text-sm">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Office Locations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-soft-black mb-8 text-center">Our Offices</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                city: 'Delhi',
                address: '123 Tech Park, New Delhi, India',
                email: 'delhi@talehub.com',
              },
              {
                city: 'Bangalore',
                address: '456 Innovation Hub, Bangalore, India',
                email: 'bangalore@talehub.com',
              },
              {
                city: 'San Francisco',
                address: '789 Silicon Valley, San Francisco, USA',
                email: 'sf@talehub.com',
              },
            ].map((office, i) => (
              <motion.div
                key={i}
                className="bg-white p-6 rounded-xl border border-slate-gray/10 text-center hover:shadow-lg transition"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-xl font-bold text-soft-black mb-2">{office.city}</h3>
                <p className="text-slate-gray text-sm mb-4 flex items-center gap-2">
                  <MapPin size={16} /> {office.address}
                </p>
                <a href={`mailto:${office.email}`} className="text-slate-gray hover:text-soft-black font-semibold text-sm">
                  {office.email}
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
