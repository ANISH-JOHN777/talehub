import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function BookReviews({ bookId }) {
  const { user, token } = useAuth()
  const [reviews, setReviews] = useState([])
  const [avgRating, setAvgRating] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    content: '',
  })

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/books/${bookId}/reviews`)
        const data = await response.json()
        if (data.success) {
          setReviews(data.data.reviews)
          setAvgRating(data.data.avgRating)
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [bookId])

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value,
    }))
  }

  // Submit review
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`/api/books/${bookId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setReviews([data.data, ...reviews])
        setFormData({ rating: 5, title: '', content: '' })
        setShowForm(false)
        // Recalculate average
        const newAvg =
          (reviews.reduce((sum, r) => sum + r.rating, 0) + data.data.rating) /
          (reviews.length + 1)
        setAvgRating(newAvg.toFixed(1))
      }
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(`/api/books/${bookId}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        setReviews(reviews.filter((r) => r._id !== reviewId))
      }
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }

  // Mark helpful
  const handleMarkHelpful = async (reviewId) => {
    try {
      const response = await fetch(
        `/api/books/${bookId}/reviews/${reviewId}/helpful`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (data.success) {
        setReviews(
          reviews.map((r) => (r._id === reviewId ? data.data : r))
        )
      }
    } catch (error) {
      console.error('Error marking helpful:', error)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Reviews</h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={
                    i < Math.round(avgRating)
                      ? 'text-yellow-400 text-xl'
                      : 'text-gray-300 text-xl'
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-700">
              {avgRating} ({reviews.length} reviews)
            </span>
          </div>
        </div>
        {user && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
          >
            {showForm ? 'Cancel' : 'Write Review'}
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && user && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                  className={`text-3xl transition ${
                    star <= formData.rating
                      ? 'text-yellow-400'
                      : 'text-gray-300 hover:text-yellow-200'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Summarize your review..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Share your thoughts about this book..."
              rows="4"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition"
          >
            Post Review
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-800">{review.user?.name || 'Anonymous'}</h4>
                  <div className="flex gap-2 items-center">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < review.rating
                              ? 'text-yellow-400 text-sm'
                              : 'text-gray-300 text-sm'
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {user?._id === review.user?._id && (
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
              {review.title && (
                <p className="font-medium text-gray-700 mb-2">{review.title}</p>
              )}
              <p className="text-gray-600 mb-3">{review.content}</p>
              <button
                onClick={() => handleMarkHelpful(review._id)}
                className="text-sm text-teal-600 hover:text-teal-800 transition"
              >
                👍 Helpful ({review.helpfulCount})
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
