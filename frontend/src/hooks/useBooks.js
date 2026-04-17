// Custom hook for fetching books
// Usage: const { books, loading, error, refetch } = useBooks()

import { useState, useEffect } from 'react'

export function useBooks(category = null) {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBooks = async () => {
    try {
      setLoading(true)
      setError(null)

      let url = '/api/books'
      if (category && category !== 'all') {
        url = `/api/books?category=${category}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch books')
      }

      const booksData = data.data || []
      const mappedBooks = booksData.map(book => ({
        ...book,
        id: book._id,
      }))

      setBooks(mappedBooks)
    } catch (error) {
      console.error('Error fetching books:', error)
      setError(error.message || 'Failed to load books')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [category])

  return { books, loading, error, refetch: fetchBooks }
}

export default useBooks
