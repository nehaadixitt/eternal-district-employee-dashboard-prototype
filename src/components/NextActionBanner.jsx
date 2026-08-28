import { ArrowRight, CheckCircle } from 'lucide-react'
import { getNextAction } from '../data/workflow'

export default function NextActionBanner({ merchant }) {
  const next = getNextAction(merchant)

  if (merchant.overall_status === 'live') {
    return (
      <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
        <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
        <div>
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Account Status</p>
          <p className="text-sm font-semibold text-emerald-800">Account is Live</p>
        </div>
      </div>
    )
  }

  if (!next) return null

  return (
    <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
      <ArrowRight size={18} className="text-blue-600 flex-shrink-0" />
      <div>
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Next Action</p>
        <p className="text-sm font-semibold text-blue-900">{next.label}</p>
      </div>
      {next.task?.owner && (
        <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
          {next.task.owner}
        </span>
      )}
    </div>
  )
}
