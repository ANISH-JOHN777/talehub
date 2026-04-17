const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    author: {
      type: String,
      required: [true, 'Please provide an author'],
      trim: true,
      maxlength: [50, 'Author name cannot be more than 50 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    category: {
      type: String,
      enum: {
        values: ['Fiction', 'Non-Fiction', 'Self-Help', 'Business', 'Technology', 'History', 'Science', 'Other'],
        message: 'Please select a valid category'
      },
      default: 'Other'
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
      default: 0
    },
    reviews: {
      type: Number,
      default: 0
    },
    pages: {
      type: Number,
      min: [1, 'Pages must be at least 1']
    },
    publishedYear: {
      type: Number,
      min: [1000, 'Invalid year'],
      max: [new Date().getFullYear(), 'Year cannot be in the future']
    },
    coverImage: {
      type: String,
      default: null
    },
    pricePerDay: {
      type: Number,
      default: 9.99,
      min: [0.99, 'Price must be at least $0.99']
    },
    subscription: {
      type: String,
      enum: ['free', 'basic', 'premium'],
      default: 'free'
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Book', bookSchema)
