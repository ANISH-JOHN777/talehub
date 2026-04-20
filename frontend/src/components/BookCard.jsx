import { BookOpen, Star } from 'lucide-react'
import { motion } from 'framer-motion'

export default function BookCard({ book, onViewDetails }) {
  return (
    <motion.div
      className="group h-full"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group h-full flex flex-col">
        {/* Book Image/Icon with Gradient */}
        <div className="bg-gradient-to-br from-slate-gray via-slate-gray to-soft-black h-56 flex items-center justify-center relative overflow-hidden">
          {book.cover ? (
            <motion.img
              src={book.cover}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              whileHover={{ scale: 1.1 }}
            />
          ) : (
            <div className="text-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <BookOpen size={64} className="text-warm-cream mx-auto mb-3" strokeWidth={1.5} />
              </motion.div>
              <p className="text-warm-cream/60 text-sm font-semibold">{book.category}</p>
            </div>
          )}
          
          {/* Rating Badge */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg flex items-center gap-1">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-gray-900">
              {typeof book.rating === 'object' ? (book.rating?.average || 4.5).toFixed(1) : book.rating || 4.5}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-slate-gray transition">
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-sm text-slate-gray font-semibold mb-4">
            by {book.author}
          </p>

          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block bg-gradient-to-r from-slate-gray/10 to-slate-gray/5 text-slate-gray text-xs font-semibold px-3 py-1 rounded-full border border-slate-gray/20 hover:border-slate-gray/40 transition">
              {book.category}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
            {book.description}
          </p>

          {/* Stats */}
          <div className="mb-4 pb-4 border-b border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-600">{book.pages} pages</span>
            <span className="text-gray-600">{book.publishedYear}</span>
          </div>

          {/* Review Count */}
          <div className="text-xs text-gray-500 mb-4">
            {book.reviews} reviews
          </div>

          {/* Button */}
          <motion.button
            onClick={() => onViewDetails(book._id || book.id)}
            className="w-full bg-gradient-to-r from-slate-gray to-soft-black text-warm-cream py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View Details
            <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
