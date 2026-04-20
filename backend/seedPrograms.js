require('dotenv').config()
const mongoose = require('mongoose')
const Instructor = require('./models/Instructor')
const Program = require('./models/Program')

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/learntales'

const instructorData = [
  {
    name: 'Dr. James Clear',
    email: 'james@example.com',
    bio: 'Bestselling author of "Atomic Habits". Specializes in behavioral psychology and habit formation.',
    expertise: ['Habits', 'Productivity', 'Psychology', 'Behavior Change'],
    qualifications: [
      { degree: 'MBA', institution: 'Marquette University', year: 2015 },
      { degree: 'BS', institution: 'Denison University', year: 2007 },
    ],
    avatar: 'https://via.placeholder.com/150?text=James+Clear',
    social: {
      twitter: 'https://twitter.com/jamesclear',
      linkedin: 'https://linkedin.com/in/jamesclear',
      website: 'https://jamesclear.com',
    },
    totalStudents: 0,
    maxCapacity: 50,
    isActive: true,
    isAvailable: true,
  },
  {
    name: 'Robert Kiyosaki',
    email: 'robert@example.com',
    bio: 'Author of "Rich Dad Poor Dad". Expert in financial education and real estate investing.',
    expertise: ['Finance', 'Investing', 'Entrepreneurship', 'Real Estate'],
    qualifications: [
      { degree: 'BS', institution: 'United States Military Academy', year: 1969 },
    ],
    avatar: 'https://via.placeholder.com/150?text=Robert+Kiyosaki',
    social: {
      twitter: 'https://twitter.com/theRealKiyosaki',
      linkedin: 'https://linkedin.com/in/robertkiyosaki',
      website: 'https://richdad.com',
    },
    totalStudents: 0,
    maxCapacity: 50,
    isActive: true,
    isAvailable: true,
  },
  {
    name: 'Daniel Kahneman',
    email: 'daniel@example.com',
    bio: 'Nobel Prize winner. Author of "Thinking, Fast and Slow". Psychology and decision-making expert.',
    expertise: ['Psychology', 'Decision Making', 'Behavioral Economics', 'Cognitive Science'],
    qualifications: [
      { degree: 'PhD', institution: 'University of California, Berkeley', year: 1961 },
    ],
    avatar: 'https://via.placeholder.com/150?text=Daniel+Kahneman',
    social: {
      twitter: 'https://twitter.com/DKahneman',
      linkedin: 'https://linkedin.com/in/danielkahneman',
    },
    totalStudents: 0,
    maxCapacity: 50,
    isActive: true,
    isAvailable: true,
  },
  {
    name: 'Yuval Noah Harari',
    email: 'yuval@example.com',
    bio: 'Author of "Sapiens". Historian and futurist exploring human civilization.',
    expertise: ['History', 'Technology', 'Futurism', 'Human Culture'],
    qualifications: [
      { degree: 'PhD', institution: 'University of Oxford', year: 2002 },
    ],
    avatar: 'https://via.placeholder.com/150?text=Yuval+Harari',
    social: {
      twitter: 'https://twitter.com/harari_yuval',
      website: 'https://www.ynharari.com',
    },
    totalStudents: 0,
    maxCapacity: 50,
    isActive: true,
    isAvailable: true,
  },
  {
    name: 'Cal Newport',
    email: 'cal@example.com',
    bio: 'Author of "Deep Work". Productivity and career expert.',
    expertise: ['Productivity', 'Deep Work', 'Career Development', 'Focus'],
    qualifications: [
      { degree: 'PhD', institution: 'MIT', year: 2009 },
    ],
    avatar: 'https://via.placeholder.com/150?text=Cal+Newport',
    social: {
      twitter: 'https://twitter.com/calNewport',
      website: 'https://www.calnewport.com',
    },
    totalStudents: 0,
    maxCapacity: 50,
    isActive: true,
    isAvailable: true,
  },
]

const programData = [
  {
    title: 'Atomic Habits: Building the Unbreakable Habit System',
    description: 'Learn how to build tiny habits that lead to remarkable results. Understand the power of 1% improvement daily.',
    longDescription:
      'In this comprehensive program, James Clear walks you through the science of habit formation and provides actionable strategies to transform your life. Perfect for anyone looking to break bad habits and establish systems for success.',
    category: 'Self-Help',
    level: 'Beginner',
    language: 'English',
    instructor: null, // Will be set after instructor creation
    duration: { weeks: 4, hours: 12 },
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop',
    outcomes: [
      'Understand the neurochemistry of habit formation',
      'Build a personalized habit system',
      'Break destructive habits permanently',
      'Implement 100+ practical strategies',
      'Achieve 1% daily improvements',
    ],
    pricing: {
      basic: {
        name: 'Basic',
        price: 199,
        description: 'Live sessions only',
        features: ['4 live sessions', 'Q&A with instructor', 'Community access'],
      },
      pro: {
        name: 'Pro',
        price: 399,
        description: 'Live + Recordings',
        features: ['4 live sessions', 'Lifetime access to recordings', 'Downloadable resources', 'Community forum'],
      },
      premium: {
        name: 'Premium',
        price: 699,
        description: 'Everything + Personal Coaching',
        features: ['4 live sessions', 'Lifetime recordings', '2 personal coaching calls', 'Custom action plan', 'Priority support'],
      },
    },
    totalEnrolled: 0,
    maxSeats: 200,
    seatsAvailable: 200,
    status: 'Published',
    nextBatchDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    title: 'Rich Dad Poor Dad: Financial Independence Masterclass',
    description:
      'Create wealth through smart investing and business mindset. Learn the principles that separate the rich from everyone else.',
    longDescription:
      'Robert Kiyosaki shares the financial wisdom that transformed his life. This program teaches you the fundamental differences between assets and liabilities, and how to build your path to financial independence.',
    category: 'Finance',
    level: 'Beginner',
    language: 'English',
    instructor: null,
    duration: { weeks: 6, hours: 18 },
    image: 'https://images.unsplash.com/photo-1579621970563-fbf51534e722?w=500&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-fbf51534e722?w=300&h=200&fit=crop',
    outcomes: [
      'Understand the rich mindset vs. poor mindset',
      'Learn asset vs. liability differentiation',
      'Build real estate investment portfolio',
      'Create multiple income streams',
      'Achieve financial independence',
    ],
    pricing: {
      basic: { name: 'Basic', price: 299, description: 'Live sessions', features: ['6 live sessions', 'Q&A access'] },
      pro: {
        name: 'Pro',
        price: 549,
        description: 'Live + Recordings + Templates',
        features: ['6 live sessions', 'Lifetime recordings', 'Investment templates', 'Resource library'],
      },
      premium: {
        name: 'Premium',
        price: 999,
        description: 'Everything + Mentorship',
        features: ['6 live sessions', 'Lifetime recordings', '4 mentorship calls', 'Custom portfolio plan', 'VIP support'],
      },
    },
    totalEnrolled: 0,
    maxSeats: 150,
    seatsAvailable: 150,
    status: 'Published',
    nextBatchDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    title: 'Thinking, Fast and Slow: Psychology of Decision Making',
    description: 'Discover how your brain makes decisions and learn to overcome cognitive biases for better choices.',
    longDescription:
      'Nobel Prize winner Daniel Kahneman reveals the hidden patterns of human thought. Understand the two systems of thinking and apply these insights to make better decisions in every area of your life.',
    category: 'Psychology',
    level: 'Intermediate',
    language: 'English',
    instructor: null,
    duration: { weeks: 5, hours: 15 },
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=200&fit=crop',
    outcomes: [
      'Understand System 1 and System 2 thinking',
      'Identify and overcome your cognitive biases',
      'Improve decision-making quality',
      'Recognize social psychology patterns',
      'Apply behavioral economics to daily life',
    ],
    pricing: {
      basic: { name: 'Basic', price: 249, description: 'Live sessions', features: ['5 live sessions', 'Slides access'] },
      pro: {
        name: 'Pro',
        price: 449,
        description: 'Live + Recordings + Notes',
        features: ['5 live sessions', 'Lifetime recordings', 'Detailed notes', 'Study guides'],
      },
      premium: {
        name: 'Premium',
        price: 799,
        description: 'Everything + Discussion Groups',
        features: ['5 live sessions', 'Lifetime recordings', 'Weekly discussion groups', '2 expert consultations', 'Private community'],
      },
    },
    totalEnrolled: 0,
    maxSeats: 100,
    seatsAvailable: 100,
    status: 'Published',
    nextBatchDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    description: 'Explore the extraordinary journey of human civilization from ancient times to the modern era.',
    longDescription:
      'Yuval Harari takes you on a fascinating journey through human history. Discover how Homo sapiens came to dominate the world and explore the pivotal moments that shaped our species.',
    category: 'History',
    level: 'Beginner',
    language: 'English',
    instructor: null,
    duration: { weeks: 8, hours: 24 },
    image: 'https://images.unsplash.com/photo-1507842725589-01a959e0a396?w=500&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1507842725589-01a959e0a396?w=300&h=200&fit=crop',
    outcomes: [
      'Understand the cognitive revolution in humans',
      'Trace the agricultural revolution\'s impact',
      'Explore the industrial revolution and beyond',
      'Understand how imagination shapes society',
      'Prepare for potential future scenarios',
    ],
    pricing: {
      basic: { name: 'Basic', price: 199, description: 'Live sessions', features: ['8 live sessions', 'Community forum'] },
      pro: {
        name: 'Pro',
        price: 399,
        description: 'Live + Recordings + References',
        features: ['8 live sessions', 'Lifetime recordings', 'Reading references', 'Timeline guides'],
      },
      premium: {
        name: 'Premium',
        price: 649,
        description: 'Everything + Expert Access',
        features: ['8 live sessions', 'Lifetime recordings', '3 expert sessions', 'Advanced content', 'Exclusive materials'],
      },
    },
    totalEnrolled: 0,
    maxSeats: 300,
    seatsAvailable: 300,
    status: 'Published',
    nextBatchDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    title: 'Deep Work: Focus in a Distracted World',
    description: 'Learn the art of deep work and master your focus to achieve exceptional results in your career.',
    longDescription:
      'Cal Newport teaches you how to focus intensely on cognitively demanding work. Master strategies to eliminate distractions and produce your best work consistently.',
    category: 'Personal Development',
    level: 'Intermediate',
    language: 'English',
    instructor: null,
    duration: { weeks: 4, hours: 10 },
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop',
    outcomes: [
      'Define and measure deep work',
      'Create a deep work culture',
      'Eliminate shallow work habits',
      'Structure your day for maximum focus',
      'Achieve career advancement through excellence',
    ],
    pricing: {
      basic: { name: 'Basic', price: 179, description: 'Live sessions', features: ['4 live sessions', 'Checklists'] },
      pro: {
        name: 'Pro',
        price: 349,
        description: 'Live + Recordings + Templates',
        features: ['4 live sessions', 'Lifetime recordings', 'Focus templates', 'Scheduling tools'],
      },
      premium: {
        name: 'Premium',
        price: 599,
        description: 'Everything + Accountability',
        features: ['4 live sessions', 'Lifetime recordings', 'Monthly accountability calls', 'Personal workspace audit', 'Premium support'],
      },
    },
    totalEnrolled: 0,
    maxSeats: 180,
    seatsAvailable: 180,
    status: 'Published',
    nextBatchDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
]

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('[INFO] Connected to MongoDB')

    // Drop existing collections
    await mongoose.connection.dropCollection('instructors').catch(() => {})
    await mongoose.connection.dropCollection('programs').catch(() => {})
    console.log('[CLEAR] Cleared existing data')

    // Create instructors
    const createdInstructors = await Instructor.insertMany(instructorData)
    console.log(`[SUCCESS] Created ${createdInstructors.length} instructors`)

    // Assign instructors to programs and create programs
    const programsWithInstructors = programData.map((program, index) => ({
      ...program,
      instructor: createdInstructors[index]._id,
    }))

    const createdPrograms = await Program.insertMany(programsWithInstructors)
    console.log(`[SUCCESS] Created ${createdPrograms.length} programs`)

    // Update instructor's programs array
    for (let i = 0; i < createdInstructors.length; i++) {
      await Instructor.findByIdAndUpdate(
        createdInstructors[i]._id,
        { programs: [createdPrograms[i]._id] },
        { new: true }
      )
    }
    console.log('[SUCCESS] Linked instructors to programs')

    console.log('\n[SUCCESS] Database seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding error:', error)
    process.exit(1)
  }
}

seedDatabase()
