import { BookOpen } from 'lucide-react'

export default function RotatingBook() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-gray/20 to-warm-cream flex items-center justify-center rounded-lg">
      <div className="text-center">
        <div className="mb-4 flex justify-center"><BookOpen size={48} className="text-slate-gray" /></div>
        <h3 className="text-xl font-semibold text-soft-black mb-2">TaleHub</h3>
        <p className="text-slate-gray text-sm">Explore amazing books with live sessions</p>
      </div>
    </div>
  )
}
