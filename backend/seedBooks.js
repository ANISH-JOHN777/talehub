#!/usr/bin/env node

/**
 * Seed Books Data Script
 * Add sample books to MongoDB
 * Usage: node backend/seedBooks.js
 */

require('dotenv').config()
const mongoose = require('mongoose')
const Book = require('./models/Book')

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/learntales'

const seedBooks = [
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'Transform your life with tiny changes. Learn the power of small habits that lead to remarkable results through practical strategies and proven methods.',
    category: 'Self-Help',
    rating: 4.8,
    reviews: 3204,
    pages: 320,
    publishedYear: 2018,
  },
  {
    title: 'The Lean Startup',
    author: 'Eric Ries',
    description: 'Build products efficiently and effectively. Discover how to validate ideas quickly and iterate based on customer feedback to reduce waste.',
    category: 'Business',
    rating: 4.6,
    reviews: 2154,
    pages: 368,
    publishedYear: 2011,
  },
  {
    title: 'Deep Work',
    author: 'Cal Newport',
    description: 'Master the art of focused work. Learn techniques to eliminate distractions and produce your best work in an increasingly distracted world.',
    category: 'Productivity',
    rating: 4.7,
    reviews: 1876,
    pages: 296,
    publishedYear: 2016,
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    description: 'Understand how your mind works. Explore the two systems of thinking and how they influence every decision you make daily.',
    category: 'Psychology',
    rating: 4.5,
    reviews: 2341,
    pages: 499,
    publishedYear: 2011,
  },
  {
    title: 'The Innovators',
    author: 'Walter Isaacson',
    description: 'Explore the history of digital innovation. Discover the brilliant minds who created the technology that changed the world forever.',
    category: 'Technology',
    rating: 4.4,
    reviews: 1543,
    pages: 542,
    publishedYear: 2014,
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    description: 'Journey through human history from the Stone Age to the present day. Understand the revolutions that shaped our species and civilization.',
    category: 'History',
    rating: 4.7,
    reviews: 4125,
    pages: 443,
    publishedYear: 2011,
  },
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    description: 'Explore infinite possibilities and alternate lives. A magical journey between worlds that will change how you see your own life.',
    category: 'Fiction',
    rating: 4.2,
    reviews: 892,
    pages: 304,
    publishedYear: 2020,
  },
  {
    title: 'Start with Why',
    author: 'Simon Sinek',
    description: 'Discover the power of purpose. Learn how to inspire others and build movements by starting with why, not what or how.',
    category: 'Business',
    rating: 4.5,
    reviews: 3201,
    pages: 256,
    publishedYear: 2009,
  },
  {
    title: 'Range',
    author: 'David Epstein',
    description: 'Embrace generalization and diverse experiences. Discover how a broad range of knowledge leads to unexpected solutions and innovation.',
    category: 'Self-Help',
    rating: 4.4,
    reviews: 1654,
    pages: 560,
    publishedYear: 2019,
  },
  {
    title: 'The Second Sex',
    author: 'Simone de Beauvoir',
    description: 'A groundbreaking analysis of women\'s role in society. A philosophical exploration of freedom, gender, and human existence.',
    category: 'History',
    rating: 4.3,
    reviews: 756,
    pages: 731,
    publishedYear: 1949,
  },
]

async function seed() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...')
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('[INFO] Connected to MongoDB')

    // Clear existing books
    const existingCount = await Book.countDocuments()
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing books. Clearing...`)
      await Book.deleteMany({})
    }

    // Insert seed books
    console.log(`Inserting ${seedBooks.length} books...`)
    const insertedBooks = await Book.insertMany(seedBooks)
    console.log(`[SUCCESS] Successfully inserted ${insertedBooks.length} books`)

    // Display inserted books
    console.log('\nInserted Books:')
    insertedBooks.forEach((book, index) => {
      console.log(`${index + 1}. ${book.title} by ${book.author}`)
    })

    // Close connection
    await mongoose.connection.close()
    console.log('\n[INFO] Database connection closed')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error.message)
    process.exit(1)
  }
}

// Run seed
seed()
