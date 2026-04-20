import toast from 'react-hot-toast'

// Toast notification utilities
export const showToast = {
  success: (message, options = {}) => {
    toast.success(message, {
      duration: 3000,
      style: {
        background: '#10B981',
        color: '#fff',
        fontWeight: '600',
      },
      ...options,
    })
  },

  error: (message, options = {}) => {
    toast.error(message, {
      duration: 4000,
      style: {
        background: '#EF4444',
        color: '#fff',
        fontWeight: '600',
      },
      ...options,
    })
  },

  warning: (message, options = {}) => {
    toast(message, {
      duration: 3500,
      style: {
        background: '#F59E0B',
        color: '#fff',
        fontWeight: '600',
      },
      icon: '⚠️',
      ...options,
    })
  },

  info: (message, options = {}) => {
    toast(message, {
      duration: 3000,
      style: {
        background: '#3B82F6',
        color: '#fff',
        fontWeight: '600',
      },
      icon: 'ℹ️',
      ...options,
    })
  },

  loading: (message, options = {}) => {
    return toast.loading(message, {
      style: {
        background: '#6B7280',
        color: '#fff',
        fontWeight: '600',
      },
      ...options,
    })
  },

  promise: (promise, messages, options = {}) => {
    return toast.promise(
      promise,
      {
        loading: {
          ...messages.loading,
          style: {
            background: '#6B7280',
            color: '#fff',
          },
        },
        success: {
          ...messages.success,
          style: {
            background: '#10B981',
            color: '#fff',
          },
        },
        error: {
          ...messages.error,
          style: {
            background: '#EF4444',
            color: '#fff',
          },
        },
      },
      {
        duration: 4000,
        ...options,
      }
    )
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId)
  },

  dismissAll: () => {
    toast.dismiss()
  },
}

export default showToast
