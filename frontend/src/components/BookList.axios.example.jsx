// Alternative BookList Component using Axios
// Install axios first: npm install axios

import { useState, useEffect } from 'react'
import axios from 'axios'
import BookCard from './BookCard'

export default function BookListWithAxios() {
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Create axios instance with base URL
  const apiClient = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 5000,
  })

  // Fetch books from backend API using Axios
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        setError(null)

        // Call backend API using Axios
        const { data } = await apiClient.get('/api/books')

        // Check if API returned success
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch books')
        }

        // Extract books from response
        const booksData = data.data || []
        
        // Map MongoDB _id to id for consistency
        const mappedBooks = booksData.map(book => ({
          ...book,
          id: book._id,
          cover: book.cover || getEmojiForCategory(book.category),
        }))

        setBooks(mappedBooks)
        setFilteredBooks(mappedBooks)
      } catch (error) {
        console.error('Error fetching books:', error)
        setError(error.response?.data?.error || error.message || 'Failed to load books.')
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  // Get emoji for category
  const getEmojiForCategory = (category) => {
    const emojiMap = {
      'Business': 'Briefcase',
      'Technology': 'Code',
      'Self-Help': 'Star',
      'Fiction': 'BookOpen',
      'History': 'Book',
      'Psychology': 'Brain',
      'Productivity': 'Zap',
      'Science': 'Beaker',
      'Other': '📕',
    }
    return emojiMap[category] || '📕'
  }

  // Filter books based on category and search term
  useEffect(() => {
    let filtered = [...books]

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(book => book.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredBooks(filtered)
  }, [books, selectedCategory, searchTerm])

  // Get unique categories from books
  const categories = ['all', ...new Set(books.map(book => book.category))]

  const handleViewDetails = (bookId) => {
    const book = filteredBooks.find(b => b.id === bookId)
    alert(`Viewing details for: ${book.title}`)
  }

  // Alternative: Fetch by category
  const fetchByCategory = async (category) => {
    try {
      setLoading(true)
      const { data } = await apiClient.get(`/api/books?category=${category}`)
      
      const booksData = data.data || []
      const mappedBooks = booksData.map(book => ({
        ...book,
        id: book._id,
        cover: book.cover || getEmojiForCategory(book.category),
      }))
      
      setBooks(mappedBooks)
    } catch (error) {
      console.error('Error fetching books:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Alternative: Search books
  const searchBooks = async (query) => {
    try {
      setLoading(true)
      const { data } = await apiClient.get(`/api/books/search/${query}`)
      
      const booksData = data.data || []
      const mappedBooks = booksData.map(book => ({
        ...book,
        id: book._id,
        cover: book.cover || getEmojiForCategory(book.category),
      }))
      
      setFilteredBooks(mappedBooks)
    } catch (error) {
      console.error('Error searching books:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Book Collection
            </h1>
            <p className="text-gray-600">Loading books...</p>
          </div>

          {/* Loading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-indigo-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <div className="text-red-600 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-900 mb-2">Failed to Load Books</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Book Collection
          </h1>
          <p className="text-lg text-gray-600">
            Discover {filteredBooks.length} of {books.length} carefully curated books
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by title, author, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filter Options */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-indigo-600'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Books Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? `No books match "${searchTerm}"`
                : 'No books available in this category'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Books Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredBooks.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {/* Footer Info */}
            <div className="text-center">
              <p className="text-gray-600">
                Showing {filteredBooks.length} of {books.length} books
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
