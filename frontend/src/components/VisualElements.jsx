// SVG-based visual elements for enhanced UI

export const HeroBackground = () => (
  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1A1A1A" />
        <stop offset="50%" stopColor="#708090" />
        <stop offset="100%" stopColor="#4A90E2" />
      </linearGradient>
      <pattern id="dots" x="50" y="50" width="100" height="100" patternUnits="userSpaceOnUse">
        <circle cx="50" cy="50" r="2" fill="#FAF3E0" opacity="0.1" />
      </pattern>
    </defs>
    <rect width="1200" height="600" fill="url(#heroGrad)" />
    <rect width="1200" height="600" fill="url(#dots)" />
    
    {/* Floating shapes */}
    <circle cx="100" cy="100" r="80" fill="#4A90E2" opacity="0.1" />
    <circle cx="1100" cy="500" r="120" fill="#9B59B6" opacity="0.1" />
    <rect x="800" y="150" width="150" height="150" fill="#1ABC9C" opacity="0.08" />
  </svg>
)

export const BookIllustration = ({ className = "" }) => (
  <svg className={`w-full h-full ${className}`} viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4A90E2" />
        <stop offset="100%" stopColor="#2C5282" />
      </linearGradient>
    </defs>
    
    {/* Book spine */}
    <rect x="80" y="60" width="40" height="180" fill="#2C5282" />
    
    {/* Book cover */}
    <rect x="120" y="60" width="100" height="180" fill="url(#bookGrad)" rx="8" />
    
    {/* Book title lines */}
    <rect x="135" y="100" width="70" height="3" fill="#FAF3E0" opacity="0.8" />
    <rect x="135" y="115" width="70" height="2" fill="#FAF3E0" opacity="0.6" />
    <rect x="135" y="128" width="70" height="2" fill="#FAF3E0" opacity="0.6" />
    
    {/* Decorative element */}
    <circle cx="170" cy="160" r="15" fill="#9B59B6" opacity="0.3" />
    <circle cx="170" cy="160" r="10" fill="none" stroke="#FAF3E0" strokeWidth="1.5" />
  </svg>
)

export const ProgramCardBackground = ({ category = "Business" }) => {
  const gradients = {
    Business: "from-blue-500 to-blue-600",
    Psychology: "from-purple-500 to-purple-600",
    Finance: "from-green-500 to-green-600",
    Technology: "from-indigo-500 to-indigo-600",
    "Personal Development": "from-pink-500 to-pink-600",
    History: "from-amber-500 to-amber-600",
    "Self-Help": "from-rose-500 to-rose-600",
  }
  
  return (
    <svg className="absolute inset-0 w-full h-full rounded-lg" viewBox="0 0 400 300">
      <defs>
        <linearGradient id={`cardGrad-${category}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={category === 'Business' ? '#3B82F6' : '#8B5CF6'} />
          <stop offset="100%" stopColor={category === 'Business' ? '#1E40AF' : '#6D28D9'} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#cardGrad-${category})`} />
      
      {/* Decorative circles */}
      <circle cx="350" cy="50" r="60" fill="#FFFFFF" opacity="0.1" />
      <circle cx="50" cy="250" r="80" fill="#FFFFFF" opacity="0.08" />
      <circle cx="200" cy="150" r="40" fill="#FFFFFF" opacity="0.05" />
    </svg>
  )
}

export const SessionIllustration = () => (
  <svg className="w-full h-full" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sessionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1ABC9C" />
        <stop offset="100%" stopColor="#16A085" />
      </linearGradient>
    </defs>
    
    {/* Screen frame */}
    <rect x="60" y="50" width="180" height="140" fill="url(#sessionGrad)" rx="8" strokeWidth="4" stroke="#708090" />
    
    {/* Screen content - people */}
    <circle cx="90" cy="90" r="15" fill="#FAF3E0" />
    <path d="M 70 115 L 110 115 L 110 130 L 70 130 Z" fill="#FAF3E0" opacity="0.8" />
    
    <circle cx="150" cy="90" r="15" fill="#FAF3E0" />
    <path d="M 130 115 L 170 115 L 170 130 L 130 130 Z" fill="#FAF3E0" opacity="0.8" />
    
    <circle cx="210" cy="90" r="15" fill="#FAF3E0" />
    <path d="M 190 115 L 230 115 L 230 130 L 190 130 Z" fill="#FAF3E0" opacity="0.8" />
    
    {/* Mic icon bottom */}
    <circle cx="150" cy="220" r="12" fill="#F39C12" />
    <rect x="148" y="232" width="4" height="20" fill="#F39C12" />
  </svg>
)

export const AchievementIllustration = () => (
  <svg className="w-full h-full" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
    {/* Trophy */}
    <rect x="110" y="80" width="80" height="100" fill="#F39C12" rx="4" />
    <circle cx="150" cy="60" r="20" fill="#F39C12" />
    <path d="M 120 180 L 100 220 L 200 220 L 180 180 Z" fill="#F39C12" opacity="0.8" />
    <rect x="145" y="220" width="10" height="40" fill="#F39C12" />
    
    {/* Stars around */}
    <text x="80" y="100" fontSize="24" fill="#FFD700">★</text>
    <text x="220" y="120" fontSize="24" fill="#FFD700">★</text>
    <text x="100" y="250" fontSize="20" fill="#FFD700">★</text>
  </svg>
)

export const GradientBox = ({ children, gradient = "gradient-accent", className = "" }) => (
  <div className={`bg-${gradient} ${className}`}>
    {children}
  </div>
)

export const FloatingCard = ({ children, delay = 0 }) => (
  <div
    className="animate-float"
    style={{ animationDelay: `${delay}s` }}
  >
    {children}
  </div>
)

export const GlowingButton = ({ children, className = "" }) => (
  <button className={`shadow-glow hover:shadow-glow-purple transition-all duration-300 ${className}`}>
    {children}
  </button>
)

export const StatCard = ({ icon: Icon, label, value, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    green: "from-green-500 to-green-600",
    orange: "from-orange-500 to-orange-600",
  }
  
  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg p-6 text-white shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <Icon size={40} opacity={0.5} />
      </div>
    </div>
  )
}

export default {
  HeroBackground,
  BookIllustration,
  ProgramCardBackground,
  SessionIllustration,
  AchievementIllustration,
  GradientBox,
  FloatingCard,
  GlowingButton,
  StatCard,
}
