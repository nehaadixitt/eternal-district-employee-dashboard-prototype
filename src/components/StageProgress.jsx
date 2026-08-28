import { Check } from 'lucide-react'
import { getOverallProgress } from '../data/workflow'

const stageColors = {
  completed: 'bg-emerald-500 text-white border-emerald-500',
  in_progress: 'bg-blue-500 text-white border-blue-500',
  pending: 'bg-amber-400 text-white border-amber-400',
  blocked: 'bg-red-500 text-white border-red-500',
  not_started: 'bg-white text-gray-400 border-gray-200',
}

const lineColors = {
  completed: 'bg-emerald-400',
  in_progress: 'bg-blue-300',
  pending: 'bg-amber-300',
  blocked: 'bg-red-300',
  not_started: 'bg-gray-200',
}

export default function StageProgress({ merchant }) {
  const stages = getOverallProgress(merchant)

  return (
    <div className="flex items-center w-full overflow-x-auto py-2">
      {stages.map((stage, i) => (
        <div key={stage.id} className="flex items-center flex-1 min-w-0">
          <div className="flex flex-col items-center flex-shrink-0">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${stageColors[stage.status]}`}>
              {stage.status === 'completed' ? <Check size={14} /> : i + 1}
            </div>
            <span className="text-xs text-gray-500 mt-1 whitespace-nowrap font-medium">{stage.label}</span>
          </div>
          {i < stages.length - 1 && (
            <div className={`h-0.5 flex-1 mx-1 mb-4 ${lineColors[stages[i + 1].status]}`} />
          )}
        </div>
      ))}
    </div>
  )
}
