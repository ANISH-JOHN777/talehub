// Utility for generating SVG image placeholders

export const generatePlaceholderImage = (width = 400, height = 300, category = 'Program') => {
  const colors = {
    'Business': '#3B82F6',
    'Psychology': '#8B5CF6',
    'Finance': '#10B981',
    'Technology': '#6366F1',
    'Personal Development': '#EC4899',
    'History': '#F59E0B',
    'Self-Help': '#F43F5E',
  }

  const bgColor = colors[category] || '#6B7280'
  const textColor = '#FFFFFF'

  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect fill='${bgColor}' width='${width}' height='${height}'/%3E%3Ctext x='50%25' y='40%25' font-size='24' font-weight='bold' fill='${textColor}' text-anchor='middle' dominant-baseline='middle' font-family='Arial'%3E${category}%3C/text%3E%3Ctext x='50%25' y='60%25' font-size='16' fill='${textColor}' text-anchor='middle' dominant-baseline='middle' font-family='Arial' opacity='0.8'%3EProgram Cover%3C/text%3E%3C/svg%3E`
}

export const ImagePlaceholder = ({ width = 400, height = 300, category = 'Program', text = '' }) => {
  const colors = {
    'Business': '#3B82F6',
    'Psychology': '#8B5CF6',
    'Finance': '#10B981',
    'Technology': '#6366F1',
    'Personal Development': '#EC4899',
    'History': '#F59E0B',
    'Self-Help': '#F43F5E',
  }

  const bgColor = colors[category] || '#6B7280'

  return (
    <div
      className="flex items-center justify-center rounded-lg overflow-hidden"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: bgColor,
      }}
    >
      <div className="text-center text-white">
        <div className="text-4xl mb-3">📚</div>
        <p className="text-lg font-bold">{text || category}</p>
        <p className="text-sm opacity-75">Program Cover</p>
      </div>
    </div>
  )
}

// Creates a gradient background for cards
export const createGradientBg = (category) => {
  const gradients = {
    'Business': 'from-blue-500 to-blue-600',
    'Psychology': 'from-purple-500 to-purple-600',
    'Finance': 'from-green-500 to-green-600',
    'Technology': 'from-indigo-500 to-indigo-600',
    'Personal Development': 'from-pink-500 to-pink-600',
    'History': 'from-amber-500 to-amber-600',
    'Self-Help': 'from-rose-500 to-rose-600',
  }
  return gradients[category] || 'from-slate-500 to-slate-600'
}

// Image fallback utility
export const handleImageError = (event) => {
  event.target.src = generatePlaceholderImage()
  event.target.alt = 'Image unavailable'
}

// Preload image utility
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(src)
    img.onerror = reject
    img.src = src
  })
}

// Create a gradient SVG background
export const createGradientSVG = (color1, color2, gradientId = 'grad') => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'%3E%3Cdefs%3E%3ClinearGradient id='${gradientId}' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:${color1};stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:${color2};stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='600' fill='url(%23${gradientId})' /%3E%3C/svg%3E`
}

// Pattern overlay utility
export const createPattern = (pattern = 'dots') => {
  const patterns = {
    dots: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Ccircle cx='50' cy='50' r='2' fill='%23ffffff' opacity='0.1'/%3E%3C/svg%3E`,
    grid: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cline x1='0' y1='0' x2='100' y2='0' stroke='%23ffffff' stroke-width='1' opacity='0.1'/%3E%3Cline x1='0' y1='0' x2='0' y2='100' stroke='%23ffffff' stroke-width='1' opacity='0.1'/%3E%3C/svg%3E`,
    lines: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cline x1='0' y1='0' x2='100' y2='100' stroke='%23ffffff' stroke-width='0.5' opacity='0.1'/%3E%3C/svg%3E`,
  }
  return patterns[pattern] || patterns.dots
}

export default {
  generatePlaceholderImage,
  ImagePlaceholder,
  createGradientBg,
  handleImageError,
  preloadImage,
  createGradientSVG,
  createPattern,
}
