import { BookOpen } from 'lucide-react'

export default function BookCard({ book, onViewDetails }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 group">
      {/* Book Image/Icon */}
      <div className="bg-gradient-to-br from-slate-gray to-soft-black h-48 flex items-center justify-center text-6xl transition-opacity duration-300">
        {book.cover ? (
          <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
        ) : (
          <BookOpen size={48} className="text-warm-cream" strokeWidth={1.5} />
        )}
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {book.title}
        </h3>

        {/* Author */}
        <p className="text-sm text-slate-gray font-light mb-3">
          by {book.author}
        </p>

        {/* Category Badge */}
        <div className="mb-4">
          <span className="inline-block bg-warm-cream text-slate-gray text-xs font-semibold px-3 py-1 rounded-full border border-slate-gray/20">
            {book.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {book.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.floor(book.rating) ? '★' : '☆'}>
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {book.rating}/5 ({book.reviews} reviews)
          </span>
        </div>

        {/* Button */}
        <button
          onClick={() => onViewDetails(book._id || book.id)}
          className="w-full bg-slate-gray text-warm-cream py-2 rounded-lg font-medium hover:bg-soft-black transition-colors duration-200"
        >
          View Details →
        </button>
      </div>
    </div>
  )
}
