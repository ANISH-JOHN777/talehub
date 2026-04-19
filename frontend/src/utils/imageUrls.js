// Free Image URLs from Unsplash API
// These are direct URLs that don't require API keys

export const imageUrls = {
  // Hero/Landing Images
  hero: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&h=600&fit=crop',
  heroAlt: 'https://images.unsplash.com/photo-150784272343-583f20270319?w=1200&h=600&fit=crop',
  
  // Book/Program Cover Images
  books: {
    business: [
      'https://images.unsplash.com/photo-1553729870-e46b54b85b0a?w=400&h=500&fit=crop', // Business
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=500&fit=crop', // Strategy
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=500&fit=crop', // Planning
    ],
    psychology: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=500&fit=crop', // Mind
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop', // People
      'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=400&h=500&fit=crop', // Thoughts
    ],
    finance: [
      'https://images.unsplash.com/photo-1579621970563-fbf51534e722?w=400&h=500&fit=crop', // Money
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=500&fit=crop', // Growth
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=500&fit=crop', // Analytics
    ],
    technology: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=500&fit=crop', // Tech
      'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=500&fit=crop', // Code
      'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&h=500&fit=crop', // Innovation
    ],
    selfHelp: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=500&fit=crop', // Wellness
      'https://images.unsplash.com/photo-1518066000714-58c45f1b773c?w=400&h=500&fit=crop', // Yoga
      'https://images.unsplash.com/photo-1544716278-ca5e3af4abd8?w=400&h=500&fit=crop', // Meditation
    ],
    history: [
      'https://images.unsplash.com/photo-1507842725589-01a959e0a396?w=400&h=500&fit=crop', // History
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=500&fit=crop', // Museum
      'https://images.unsplash.com/photo-1516979187457-635ffe35ff55?w=400&h=500&fit=crop', // Archive
    ],
  },

  // Feature Section Images
  features: {
    expert: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop',
    liveSessions: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop',
    affordable: 'https://images.unsplash.com/photo-1554177355-61d440c63e39?w=500&h=400&fit=crop',
    community: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop',
  },

  // Dashboard/User Images
  dashboard: 'https://images.unsplash.com/photo-1516321334612-a1d19d94e4b7?w=800&h=600&fit=crop',
  profile: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',

  // Session/Class Images
  sessions: [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
  ],

  // Category specific
  getImageByCategory: (category) => {
    const categoryMap = {
      'Self-Help': 'selfHelp',
      'Business': 'business',
      'Finance': 'finance',
      'Psychology': 'psychology',
      'Technology': 'technology',
      'History': 'history',
      'Personal Development': 'selfHelp',
    }
    const key = categoryMap[category] || 'business'
    const images = imageUrls.books[key]
    return images[Math.floor(Math.random() * images.length)]
  },

  // Get random image
  getRandom: (category) => {
    return imageUrls.getImageByCategory(category)
  },
}

export default imageUrls
