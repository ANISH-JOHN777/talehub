const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('dotenv').config()

const User = require('./models/User')
const Program = require('./models/Program')
const Instructor = require('./models/Instructor')
const Enrollment = require('./models/Enrollment')

const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/learntales'

const mockInstructors = [
  {
    name: 'James Clear',
    email: 'james@atomic-habits.com',
    bio: 'Author of Atomic Habits. Habit formation expert.',
    avatar: 'https://via.placeholder.com/200?text=James+Clear',
    expertise: ['Habits', 'Productivity', 'Behavior Change'],
    qualifications: [
      { degree: 'Habit Coach Certification', institution: 'International Habit Institute', year: 2018 }
    ],
    totalStudents: 52000,
    rating: { average: 4.9, count: 2400 },
    social: {
      twitter: 'https://twitter.com/jamesclear',
      linkedin: 'https://linkedin.com/in/jamesclear',
      website: 'https://jamesclear.com'
    }
  },
  {
    name: 'Robert Kiyosaki',
    email: 'robert@richdad.com',
    bio: 'Author of Rich Dad Poor Dad. Financial educator.',
    avatar: 'https://via.placeholder.com/200?text=Robert+Kiyosaki',
    expertise: ['Finance', 'Investing', 'Business'],
    qualifications: [
      { degree: 'Business Management', institution: 'United States Military Academy', year: 1969 }
    ],
    totalStudents: 45000,
    rating: { average: 4.7, count: 1800 },
    social: {
      twitter: 'https://twitter.com/therealkiyosaki',
      linkedin: 'https://linkedin.com/in/robertkiyosaki'
    }
  },
  {
    name: 'Daniel Kahneman',
    email: 'daniel@thinking.com',
    bio: 'Nobel Laureate. Expert in decision making and psychology.',
    avatar: 'https://via.placeholder.com/200?text=Daniel+Kahneman',
    expertise: ['Psychology', 'Decision Making', 'Behavioral Economics'],
    qualifications: [
      { degree: 'PhD in Psychology', institution: 'Hebrew University', year: 1961 },
      { degree: 'Nobel Prize in Economics', institution: 'Nobel Foundation', year: 2002 }
    ],
    totalStudents: 38000,
    rating: { average: 4.8, count: 1600 },
    social: {
      website: 'https://en.wikipedia.org/wiki/Daniel_Kahneman'
    }
  },
  {
    name: 'Yuval Noah Harari',
    email: 'yuval@sapiens.com',
    bio: 'Historian and author. Explores human history and future.',
    avatar: 'https://via.placeholder.com/200?text=Yuval+Harari',
    expertise: ['History', 'Future Studies', 'Philosophy'],
    qualifications: [
      { degree: 'PhD in History', institution: 'University of Oxford', year: 2000 }
    ],
    totalStudents: 35000,
    rating: { average: 4.6, count: 1400 },
    social: {
      twitter: 'https://twitter.com/harari_yuval',
      website: 'https://www.ynharari.com/'
    }
  },
  {
    name: 'Cal Newport',
    email: 'cal@deepwork.com',
    bio: 'Computer scientist and author. Deep work expert.',
    avatar: 'https://via.placeholder.com/200?text=Cal+Newport',
    expertise: ['Deep Work', 'Productivity', 'Career'],
    qualifications: [
      { degree: 'PhD in Computer Science', institution: 'MIT', year: 2009 }
    ],
    totalStudents: 28000,
    rating: { average: 4.8, count: 1200 },
    social: {
      twitter: 'https://twitter.com/calNewport',
      website: 'https://www.calnewport.com/'
    }
  },
  {
    name: 'Simon Sinek',
    email: 'simon@startwithwhy.com',
    bio: 'Organizational leadership expert. Author of Start With Why.',
    avatar: 'https://via.placeholder.com/200?text=Simon+Sinek',
    expertise: ['Leadership', 'Motivation', 'Business Strategy'],
    qualifications: [
      { degree: 'Marketing Degree', institution: 'City University of New York', year: 1996 }
    ],
    totalStudents: 42000,
    rating: { average: 4.7, count: 1700 },
    social: {
      twitter: 'https://twitter.com/simonsinek',
      website: 'https://simonsinek.com/'
    }
  }
]

const mockPrograms = [
  {
    title: 'Atomic Habits: Master Your Daily Routines',
    slug: 'atomic-habits-daily-routines',
    description: 'Transform your life through tiny, incremental changes. Learn the science of habit formation and implement proven strategies to build good habits and break bad ones.',
    instructor: null,
    category: 'Self-Help',
    level: 'Beginner',
    duration: '4 weeks',
    thumbnail: 'https://via.placeholder.com/400x300?text=Atomic+Habits',
    outcomes: [
      'Understand the habit loop and how to modify it',
      'Build systems for consistent habit tracking',
      'Create 1% daily improvements',
      'Break negative habits permanently'
    ],
    sessions: [
      { title: 'Introduction to Atomic Habits', dateTime: new Date(Date.now() + 2*24*60*60*1000), recording: '' },
      { title: 'The Habit Loop: Cue, Routine, Reward', dateTime: new Date(Date.now() + 9*24*60*60*1000), recording: '' },
      { title: 'Building Identity-Based Habits', dateTime: new Date(Date.now() + 16*24*60*60*1000), recording: '' },
      { title: 'System Design for Success', dateTime: new Date(Date.now() + 23*24*60*60*1000), recording: '' }
    ],
    pricing: {
      basic: { name: 'Basic', price: 199, features: ['Live sessions', 'Q&A access', 'Community forum'] },
      pro: { name: 'Pro', price: 399, features: ['Everything in Basic', 'Lifetime recordings', 'Downloadable resources', 'Certificate'] },
      premium: { name: 'Premium', price: 699, features: ['Everything in Pro', '2 coaching calls', 'Custom plan', 'Priority support'] }
    },
    seatsLimit: 100,
    nextBatchDate: new Date(Date.now() + 7*24*60*60*1000),
    enrolledCount: 2847,
    rating: { average: 4.9, count: 1523 }
  },
  {
    title: 'Rich Dad Poor Dad: Financial Freedom Blueprint',
    slug: 'rich-dad-poor-dad-financial-freedom',
    description: 'Learn the mindset differences between the rich and poor. Master investment strategies, understand cash flow, and build wealth systematically.',
    instructor: null,
    category: 'Finance',
    level: 'Beginner',
    duration: '6 weeks',
    thumbnail: 'https://via.placeholder.com/400x300?text=Rich+Dad+Poor+Dad',
    outcomes: [
      'Understand the money mindset',
      'Learn investment fundamentals',
      'Create passive income streams',
      'Build a personal financial statement'
    ],
    sessions: [
      { title: 'The Rich and Poor Mentality', dateTime: new Date(Date.now() + 3*24*60*60*1000), recording: '' },
      { title: 'Understanding Cash Flow', dateTime: new Date(Date.now() + 10*24*60*60*1000), recording: '' },
      { title: 'Investment Strategies', dateTime: new Date(Date.now() + 17*24*60*60*1000), recording: '' },
      { title: 'Business Ownership', dateTime: new Date(Date.now() + 24*24*60*60*1000), recording: '' },
      { title: 'Tax Strategies', dateTime: new Date(Date.now() + 31*24*60*60*1000), recording: '' },
      { title: 'Creating Wealth', dateTime: new Date(Date.now() + 38*24*60*60*1000), recording: '' }
    ],
    pricing: {
      basic: { name: 'Basic', price: 299, features: ['Live sessions', 'Q&A access', 'Community forum'] },
      pro: { name: 'Pro', price: 599, features: ['Everything in Basic', 'Lifetime recordings', 'Templates', 'Certificate'] },
      premium: { name: 'Premium', price: 999, features: ['Everything in Pro', '3 coaching calls', 'Investment guidance', 'VIP support'] }
    },
    seatsLimit: 80,
    nextBatchDate: new Date(Date.now() + 10*24*60*60*1000),
    enrolledCount: 1923,
    rating: { average: 4.7, count: 987 }
  },
  {
    title: 'Thinking, Fast and Slow: Decision Making Mastery',
    slug: 'thinking-fast-and-slow',
    description: 'Understand the two systems of human thought. Learn cognitive biases, make better decisions, and improve your judgment in both personal and professional life.',
    instructor: null,
    category: 'Psychology',
    level: 'Intermediate',
    duration: '5 weeks',
    thumbnail: 'https://via.placeholder.com/400x300?text=Thinking+Fast+Slow',
    outcomes: [
      'Understand System 1 and System 2 thinking',
      'Recognize and overcome cognitive biases',
      'Make data-driven decisions',
      'Improve judgment and reasoning'
    ],
    sessions: [
      { title: 'Introduction to Dual System Thinking', dateTime: new Date(Date.now() + 4*24*60*60*1000), recording: '' },
      { title: 'Cognitive Biases and Heuristics', dateTime: new Date(Date.now() + 11*24*60*60*1000), recording: '' },
      { title: 'Risk and Uncertainty', dateTime: new Date(Date.now() + 18*24*60*60*1000), recording: '' },
      { title: 'Overconfidence and Regret', dateTime: new Date(Date.now() + 25*24*60*60*1000), recording: '' },
      { title: 'Improving Decision Making', dateTime: new Date(Date.now() + 32*24*60*60*1000), recording: '' }
    ],
    pricing: {
      basic: { name: 'Basic', price: 249, features: ['Live sessions', 'Q&A access', 'Slides'] },
      pro: { name: 'Pro', price: 499, features: ['Everything in Basic', 'Recordings', 'Case studies', 'Certificate'] },
      premium: { name: 'Premium', price: 799, features: ['Everything in Pro', '2 consulting sessions', 'Personal assessment', 'Priority support'] }
    },
    seatsLimit: 60,
    nextBatchDate: new Date(Date.now() + 8*24*60*60*1000),
    enrolledCount: 1456,
    rating: { average: 4.8, count: 723 }
  },
  {
    title: 'Sapiens: Understanding Human History',
    slug: 'sapiens-human-history',
    description: 'Explore the history and future of humanity. From the cognitive revolution to the modern age, understand how humans came to dominate the world.',
    instructor: null,
    category: 'History',
    level: 'Beginner',
    duration: '8 weeks',
    thumbnail: 'https://via.placeholder.com/400x300?text=Sapiens',
    outcomes: [
      'Understand human evolution and development',
      'Learn the agricultural and industrial revolutions',
      'Explore the future of humanity',
      'Think critically about civilization'
    ],
    sessions: [
      { title: 'The Cognitive Revolution', dateTime: new Date(Date.now() + 5*24*60*60*1000), recording: '' },
      { title: 'The Agricultural Revolution', dateTime: new Date(Date.now() + 12*24*60*60*1000), recording: '' },
      { title: 'The Unification of Humankind', dateTime: new Date(Date.now() + 19*24*60*60*1000), recording: '' },
      { title: 'The Scientific Revolution', dateTime: new Date(Date.now() + 26*24*60*60*1000), recording: '' },
      { title: 'The Industrial Revolution', dateTime: new Date(Date.now() + 33*24*60*60*1000), recording: '' },
      { title: 'Modern Era and Beyond', dateTime: new Date(Date.now() + 40*24*60*60*1000), recording: '' },
      { title: 'The Future of Sapiens', dateTime: new Date(Date.now() + 47*24*60*60*1000), recording: '' },
      { title: 'Lessons and Conclusions', dateTime: new Date(Date.now() + 54*24*60*60*1000), recording: '' }
    ],
    pricing: {
      basic: { name: 'Basic', price: 199, features: ['Live sessions', 'Q&A access', 'Notes'] },
      pro: { name: 'Pro', price: 399, features: ['Everything in Basic', 'Recordings', 'Timeline graphics', 'Certificate'] },
      premium: { name: 'Premium', price: 649, features: ['Everything in Pro', '1 mentoring session', 'Group discussions', 'VIP support'] }
    },
    seatsLimit: 120,
    nextBatchDate: new Date(Date.now() + 14*24*60*60*1000),
    enrolledCount: 1834,
    rating: { average: 4.6, count: 892 }
  },
  {
    title: 'Deep Work: Master Focused Productivity',
    slug: 'deep-work-focused-productivity',
    description: 'Learn to perform meaningful work in a distracted world. Master the art of concentration and produce professional results that matter.',
    instructor: null,
    category: 'Business',
    level: 'Intermediate',
    duration: '4 weeks',
    thumbnail: 'https://via.placeholder.com/400x300?text=Deep+Work',
    outcomes: [
      'Eliminate distractions from your workplace',
      'Develop deep work routines',
      'Master focus and concentration',
      'Produce valuable work consistently'
    ],
    sessions: [
      { title: 'What is Deep Work?', dateTime: new Date(Date.now() + 6*24*60*60*1000), recording: '' },
      { title: 'Creating Your Deep Work Environment', dateTime: new Date(Date.now() + 13*24*60*60*1000), recording: '' },
      { title: 'Rituals and Routines for Focus', dateTime: new Date(Date.now() + 20*24*60*60*1000), recording: '' },
      { title: 'Measuring and Tracking Progress', dateTime: new Date(Date.now() + 27*24*60*60*1000), recording: '' }
    ],
    pricing: {
      basic: { name: 'Basic', price: 179, features: ['Live sessions', 'Q&A access', 'Templates'] },
      pro: { name: 'Pro', price: 379, features: ['Everything in Basic', 'Recordings', 'Workbooks', 'Certificate'] },
      premium: { name: 'Premium', price: 599, features: ['Everything in Pro', '4 coaching calls', 'Accountability partner', 'Priority support'] }
    },
    seatsLimit: 90,
    nextBatchDate: new Date(Date.now() + 6*24*60*60*1000),
    enrolledCount: 1567,
    rating: { average: 4.8, count: 876 }
  },
  {
    title: 'Start With Why: Leadership and Motivation',
    slug: 'start-with-why-leadership',
    description: 'Discover your why and inspire others. Learn the golden circle framework and build a movement around your purpose.',
    instructor: null,
    category: 'Business',
    level: 'Intermediate',
    duration: '5 weeks',
    thumbnail: 'https://via.placeholder.com/400x300?text=Start+With+Why',
    outcomes: [
      'Discover your personal and organizational why',
      'Apply the golden circle framework',
      'Inspire and motivate teams',
      'Build movements and loyal followings'
    ],
    sessions: [
      { title: 'The Power of Why', dateTime: new Date(Date.now() + 7*24*60*60*1000), recording: '' },
      { title: 'The Golden Circle', dateTime: new Date(Date.now() + 14*24*60*60*1000), recording: '' },
      { title: 'Building Trust and Culture', dateTime: new Date(Date.now() + 21*24*60*60*1000), recording: '' },
      { title: 'Leadership in Practice', dateTime: new Date(Date.now() + 28*24*60*60*1000), recording: '' },
      { title: 'Creating your Movement', dateTime: new Date(Date.now() + 35*24*60*60*1000), recording: '' }
    ],
    pricing: {
      basic: { name: 'Basic', price: 229, features: ['Live sessions', 'Q&A access', 'Worksheets'] },
      pro: { name: 'Pro', price: 449, features: ['Everything in Basic', 'Recordings', 'Frameworks', 'Certificate'] },
      premium: { name: 'Premium', price: 749, features: ['Everything in Pro', '3 leadership coaching', 'Team assessment', 'Premium support'] }
    },
    seatsLimit: 75,
    nextBatchDate: new Date(Date.now() + 12*24*60*60*1000),
    enrolledCount: 1298,
    rating: { average: 4.7, count: 654 }
  }
]

const mockUsers = [
  {
    username: 'john_learner',
    email: 'john@example.com',
    password: 'password123',
    name: 'John Learner',
    avatar: 'https://via.placeholder.com/100?text=JL',
    bio: 'Passionate about personal development and learning',
    tier: 'pro',
    totalBooksRead: 12
  },
  {
    username: 'sarah_dev',
    email: 'sarah@example.com',
    password: 'password123',
    name: 'Sarah Developer',
    avatar: 'https://via.placeholder.com/100?text=SD',
    bio: 'Software engineer interested in productivity',
    tier: 'premium',
    totalBooksRead: 8
  },
  {
    username: 'mike_investor',
    email: 'mike@example.com',
    password: 'password123',
    name: 'Mike Investor',
    avatar: 'https://via.placeholder.com/100?text=MI',
    bio: 'Financial enthusiast and wealth builder',
    tier: 'pro',
    totalBooksRead: 15
  },
  {
    username: 'emma_student',
    email: 'emma@example.com',
    password: 'password123',
    name: 'Emma Student',
    avatar: 'https://via.placeholder.com/100?text=ES',
    bio: 'Student exploring various fields of knowledge',
    tier: 'free',
    totalBooksRead: 5
  },
  {
    username: 'alex_founder',
    email: 'alex@example.com',
    password: 'password123',
    name: 'Alex Founder',
    avatar: 'https://via.placeholder.com/100?text=AF',
    bio: 'Startup founder always learning',
    tier: 'premium',
    totalBooksRead: 20
  }
]

async function seedDatabase() {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('[INFO] MongoDB connected')

    // Clear existing data
    await User.deleteMany({})
    await Instructor.deleteMany({})
    await Program.deleteMany({})
    await Enrollment.deleteMany({})
    console.log('[CLEAR] Cleared existing data')

    // Create instructors
    const createdInstructors = await Instructor.insertMany(mockInstructors)
    console.log(`[SUCCESS] Created ${createdInstructors.length} instructors`)

    // Create programs with instructor references
    const programsWithInstructors = mockPrograms.map((prog, index) => ({
      ...prog,
      instructor: createdInstructors[index % createdInstructors.length]._id
    }))
    const createdPrograms = await Program.insertMany(programsWithInstructors)
    console.log(`[SUCCESS] Created ${createdPrograms.length} programs`)

    // Create users with hashed passwords
    const usersWithHashedPassword = await Promise.all(
      mockUsers.map(async user => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    )
    const createdUsers = await User.insertMany(usersWithHashedPassword)
    console.log(`[SUCCESS] Created ${createdUsers.length} users`)

    // Create sample enrollments
    const enrollments = []
    createdUsers.forEach((user, userIndex) => {
      // Each user enrolls in 2-3 random programs
      const enrollmentCount = Math.floor(Math.random() * 2) + 2
      for (let i = 0; i < enrollmentCount; i++) {
        const randomProgram = createdPrograms[Math.floor(Math.random() * createdPrograms.length)]
        const tiers = ['Basic', 'Pro', 'Premium']
        const randomTier = tiers[Math.floor(Math.random() * tiers.length)]
        
        // Get pricing for the tier
        const tierPricing = {
          'Basic': 199,
          'Pro': 399,
          'Premium': 699
        }
        
        enrollments.push({
          user: user._id,
          program: randomProgram._id,
          tier: randomTier,
          price: tierPricing[randomTier],
          status: Math.random() > 0.3 ? 'Active' : 'Completed',
          progress: {
            sessionsAttended: Math.floor(Math.random() * 10),
            sessionsCompleted: Math.floor(Math.random() * 8),
            percentComplete: Math.floor(Math.random() * 100)
          },
          paymentDetails: {
            transactionId: `TXN${Date.now()}${Math.random()}`,
            paymentMethod: ['credit_card', 'debit_card', 'upi'][Math.floor(Math.random() * 3)],
            paidAt: new Date(),
            amount: tierPricing[randomTier]
          },
          enrolledAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        })
      }
    })
    
    const createdEnrollments = await Enrollment.insertMany(enrollments)
    console.log(`[SUCCESS] Created ${createdEnrollments.length} enrollments`)

    // Update programs with enrollment counts
    for (const program of createdPrograms) {
      const enrollmentCount = await Enrollment.countDocuments({ program: program._id })
      await Program.updateOne({ _id: program._id }, { enrolledCount: enrollmentCount })
    }

    // Generate analytics
    console.log('\n[STATS] Mock Data Summary:')
    console.log(`   • ${createdInstructors.length} Expert Instructors`)
    console.log(`   • ${createdPrograms.length} Programs`)
    console.log(`   • ${createdUsers.length} Users`)
    console.log(`   • ${createdEnrollments.length} Enrollments`)
    
    const enrollmentByTier = {}
    await Enrollment.aggregate([
      { $group: { _id: '$tier', count: { $sum: 1 } } }
    ]).then(results => {
      results.forEach(r => {
        enrollmentByTier[r._id] = r.count
      })
    })
    console.log('\n[PRICING] Enrollments by Tier:')
    console.log(`   • Basic: ${enrollmentByTier.Basic || 0}`)
    console.log(`   • Pro: ${enrollmentByTier.Pro || 0}`)
    console.log(`   • Premium: ${enrollmentByTier.Premium || 0}`)

    console.log('\n[COMPLETE] Database seeding complete!')
    console.log('\n📝 Test User Credentials:')
    mockUsers.forEach(user => {
      console.log(`   • ${user.username} / password123`)
    })

    await mongoose.connection.close()
  } catch (error) {
    console.error('❌ Seeding error:', error.message)
    process.exit(1)
  }
}

seedDatabase()
