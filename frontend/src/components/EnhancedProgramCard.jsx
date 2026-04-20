import { Star, Users, Clock, BookOpen, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function EnhancedProgramCard({ program, onViewDetails }) {
  const categoryColors = {
    Business: 'from-blue-500 to-blue-600',
    Psychology: 'from-purple-500 to-purple-600',
    Finance: 'from-green-500 to-green-600',
    Technology: 'from-indigo-500 to-indigo-600',
    'Personal Development': 'from-pink-500 to-pink-600',
    History: 'from-amber-500 to-amber-600',
    'Self-Help': 'from-rose-500 to-rose-600',
  }

  const gradient = categoryColors[program.category] || 'from-slate-500 to-slate-600'

  return (
    <motion.div
      className="group h-full"
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-100">
        {/* Card Header with Gradient Background */}
        <div className={`bg-gradient-to-br ${gradient} h-48 flex items-center justify-center text-6xl overflow-hidden relative group`}>
          {program.coverImage ? (
            <img
              src={program.coverImage}
              alt={program.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="relative z-10 flex flex-col items-center gap-2">
              <BookOpen size={48} className="text-white/80" />
              <span className="text-white/60 text-xs font-semibold tracking-wider">
                {program.category}
              </span>
            </div>
          )}
          
          {/* Tier Badge */}
          {program.tier && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-gray shadow-lg">
              {program.tier}
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Title & Category */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-slate-gray transition">
              {program.title}
            </h3>
            <div className="inline-block bg-gradient-to-r from-slate-gray/10 to-slate-gray/5 text-slate-gray text-xs font-semibold px-3 py-1 rounded-full border border-slate-gray/20">
              {program.category}
            </div>
          </div>

          {/* Instructor Info */}
          {program.instructor && (
            <div className="mb-4 pb-4 border-b border-gray-100">
              <p className="text-sm text-slate-gray font-medium">
                Taught by <span className="font-semibold text-soft-black">
                  {typeof program.instructor === 'string' 
                    ? program.instructor 
                    : program.instructor?.name || 'Expert Instructor'}
                </span>
              </p>
            </div>
          )}

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
            {program.description}
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-y border-gray-100">
            <div className="flex items-center gap-2 text-sm">
              <Users size={16} className="text-slate-gray" />
              <span className="text-gray-600">{program.enrolledCount || 0} enrolled</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock size={16} className="text-slate-gray" />
              <span className="text-gray-600">
                {typeof program.duration === 'object' && program.duration?.weeks
                  ? `${program.duration.weeks}w`
                  : program.duration || '4 weeks'}
              </span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => {
                const ratingValue = typeof program.rating === 'object' ? program.rating?.average || 4.5 : program.rating || 4.5
                return (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(ratingValue) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                )
              })}
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {typeof program.rating === 'object' 
                ? (program.rating?.average || 4.5).toFixed(1)
                : (program.rating || 4.5).toFixed(1)}/5 ({program.reviews || 0})
            </span>
          </div>

          {/* Pricing */}
          {program.price || (typeof program.pricing === 'object' && program.pricing?.basic?.price) ? (
            <div className="mb-4 p-3 bg-warm-cream/50 rounded-lg">
              <span className="text-xs text-slate-gray font-semibold tracking-wider">PRICE</span>
              <p className="text-2xl font-bold text-soft-black">
                ${typeof program.price === 'object' ? program.price?.basic || program.pricing?.basic?.price : program.price}
              </p>
              {program.originalPrice && (
                <p className="text-xs text-gray-500 line-through">Was ${program.originalPrice}</p>
              )}
            </div>
          ) : null}

          {/* Button */}
          <motion.button
            onClick={() => onViewDetails(program._id || program.id)}
            className="w-full bg-gradient-to-r from-slate-gray to-soft-black text-warm-cream py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Explore Now
            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
