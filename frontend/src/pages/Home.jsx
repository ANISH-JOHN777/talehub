import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Server, Database, CheckCircle, GitBranch, Code2 } from 'lucide-react'

export default function Home() {
  const [apiStatus, setApiStatus] = useState('Loading...')

  useEffect(() => {
    fetch('/api/test')
      .then(res => res.json())
      .then(data => setApiStatus(data.message || 'Connected'))
      .catch(err => setApiStatus('API Error: ' + err.message))
  }, [])

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-lg p-12 mb-8 border border-slate-gray/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <motion.h1
          className="text-4xl font-bold text-slate-gray mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Welcome to LearnTales
        </motion.h1>
        <p className="text-gray-600 text-lg mb-8">
          A Full-Stack Learning Application built with React, Vite, Express, and MongoDB
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-blue-600 mb-2">⚛️ React</h3>
            <p className="text-gray-600">Modern UI with Vite</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-green-600 mb-2 flex items-center gap-2">
              <Server size={24} />
              Express
            </h3>
            <p className="text-gray-600">Fast backend API</p>
          </div>
          <div className="bg-warm-cream p-6 rounded-lg border border-slate-gray/10">
            <h3 className="text-xl font-bold text-slate-gray mb-2 flex items-center gap-2">
              <Database size={24} />
              MongoDB
            </h3>
            <p className="text-gray-600">Scalable database</p>
          </div>
        </div>

        <div className="bg-warm-cream p-4 rounded-lg border border-slate-gray/20">
          <p className="text-soft-black">
            <strong>Backend Status:</strong> <span className="text-slate-gray">{apiStatus}</span>
          </p>
        </div>
        </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Features</h2>
          <ul className="text-left text-gray-600 space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle size={18} className="text-green-600" />
              React Router for navigation
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={18} className="text-green-600" />
              Tailwind CSS styling
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={18} className="text-green-600" />
              Express backend API
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={18} className="text-green-600" />
              MongoDB database
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={18} className="text-green-600" />
              Modern full-stack setup
            </li>
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Links</h2>
          <ul className="text-left space-y-2">
            <li>
              <a href="/dashboard" className="text-slate-gray hover:text-soft-black font-medium">
                Visit Dashboard
              </a>
            </li>
            <li>
              <a href="/book/1" className="text-slate-gray hover:text-soft-black font-medium">
                View Book Details
              </a>
            </li>
            <li>
              <a href="/api/test" className="text-slate-gray hover:text-soft-black font-medium">
                Test API
              </a>
            </li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  )
}
