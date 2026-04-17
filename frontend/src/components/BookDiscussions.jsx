import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function BookDiscussions({ bookId }) {
  const { user, token } = useAuth()
  const [threads, setThreads] = useState([])
  const [selectedThread, setSelectedThread] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewThread, setShowNewThread] = useState(false)
  const [showNewComment, setShowNewComment] = useState(false)
  const [threadForm, setThreadForm] = useState({
    title: '',
    content: '',
    category: 'discussion',
  })
  const [commentForm, setCommentForm] = useState('')

  // Fetch threads
  useEffect(() => {
    fetchThreads()
  }, [bookId])

  const fetchThreads = async () => {
    try {
      const response = await fetch(`/api/books/${bookId}/discussions`)
      const data = await response.json()
      if (data.success) {
        setThreads(data.data)
      }
    } catch (error) {
      console.error('Error fetching threads:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch thread details
  const handleSelectThread = async (threadId) => {
    try {
      const response = await fetch(`/api/books/${bookId}/discussions/${threadId}`)
      const data = await response.json()
      if (data.success) {
        setSelectedThread(data.data.thread)
        setComments(data.data.comments)
      }
    } catch (error) {
      console.error('Error fetching thread details:', error)
    }
  }

  // Create new thread
  const handleCreateThread = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`/api/books/${bookId}/discussions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(threadForm),
      })

      const data = await response.json()

      if (data.success) {
        setThreads([data.data, ...threads])
        setThreadForm({ title: '', content: '', category: 'discussion' })
        setShowNewThread(false)
      }
    } catch (error) {
      console.error('Error creating thread:', error)
    }
  }

  // Add comment
  const handleAddComment = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(
        `/api/books/${bookId}/discussions/${selectedThread._id}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: commentForm }),
        }
      )

      const data = await response.json()

      if (data.success) {
        setComments([...comments, data.data])
        setCommentForm('')
        setShowNewComment(false)

        // Update thread reply count
        setSelectedThread((prev) => ({
          ...prev,
          replies: prev.replies + 1,
        }))
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `/api/books/${bookId}/discussions/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (data.success) {
        setComments(comments.filter((c) => c._id !== commentId))
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading discussions...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Discussions</h3>

      {/* New Thread Button */}
      {user && (
        <button
          onClick={() => setShowNewThread(!showNewThread)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition mb-6"
        >
          {showNewThread ? 'Cancel' : 'Start Discussion'}
        </button>
      )}

      {/* New Thread Form */}
      {showNewThread && user && (
        <form onSubmit={handleCreateThread} className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic
            </label>
            <input
              type="text"
              value={threadForm.title}
              onChange={(e) =>
                setThreadForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="What do you want to discuss?"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={threadForm.category}
              onChange={(e) =>
                setThreadForm((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="discussion">Discussion</option>
              <option value="question">Question</option>
              <option value="spoiler">Spoiler</option>
              <option value="recommendation">Recommendation</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={threadForm.content}
              onChange={(e) =>
                setThreadForm((prev) => ({ ...prev, content: e.target.value }))
              }
              placeholder="Share your thoughts..."
              rows="4"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Post Discussion
          </button>
        </form>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Threads List */}
        <div className="col-span-1 border-r border-gray-200">
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {threads.length === 0 ? (
              <p className="text-gray-500 text-sm">No discussions yet</p>
            ) : (
              threads.map((thread) => (
                <button
                  key={thread._id}
                  onClick={() => handleSelectThread(thread._id)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    selectedThread?._id === thread._id
                      ? 'bg-teal-100 border border-teal-300'
                      : 'hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">
                      {thread.category}
                    </span>
                    {thread.isPinned && <span>📌</span>}
                  </div>
                  <p className="font-medium text-sm text-gray-800 mt-1 line-clamp-2">
                    {thread.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {thread.replies} replies • {thread.views} views
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Thread Details */}
        <div className="col-span-2">
          {selectedThread ? (
            <div>
              {/* Thread Header */}
              <div className="mb-4 pb-4 border-b">
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  {selectedThread.title}
                </h4>
                <p className="text-gray-600">
                  <span className="font-medium">{selectedThread.author?.name}</span> •{' '}
                  {new Date(selectedThread.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Thread Content */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{selectedThread.content}</p>
              </div>

              {/* Comments */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No comments yet</p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-sm text-gray-800">
                            {comment.author?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {user?._id === comment.author?._id && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-red-600 hover:text-red-800 text-xs"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                      <p className="text-xs text-indigo-600 mt-2">
                        👍 {comment.likes} helpful
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment */}
              {user && (
                <>
                  {!showNewComment ? (
                    <button
                      onClick={() => setShowNewComment(true)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      Add Comment
                    </button>
                  ) : (
                    <form onSubmit={handleAddComment} className="space-y-2">
                      <textarea
                        value={commentForm}
                        onChange={(e) => setCommentForm(e.target.value)}
                        placeholder="Share your thoughts..."
                        rows="2"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-indigo-600 text-white px-4 py-1 rounded text-sm hover:bg-indigo-700 transition"
                        >
                          Post
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowNewComment(false)
                            setCommentForm('')
                          }}
                          className="bg-gray-300 text-gray-800 px-4 py-1 rounded text-sm hover:bg-gray-400 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select a discussion to view details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
