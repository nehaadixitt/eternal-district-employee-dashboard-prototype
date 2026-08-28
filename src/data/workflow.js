import { STAGES } from '../data/types'

export function getNextAction(merchant) {
  const { tasks, contract, signature, overall_status } = merchant

  if (overall_status === 'live') return null

  const incomplete = tasks.filter(t => t.required && t.status !== 'completed')
  if (!incomplete.length) return { label: 'Mark Account Live', stage: 'live', type: 'go_live' }

  const ordered = ['restaurant_id', 'documents', 'contract', 'signature', 'sales_closure', 'commercial', 'live']
  for (const stage of ordered) {
    const stageTask = incomplete.find(t => t.stage === stage)
    if (stageTask) return { label: stageTask.name, stage, type: stageTask.type, task: stageTask }
  }

  return null
}

export function getStageStatus(merchant, stageId) {
  const { tasks, overall_status } = merchant

  if (stageId === 'account') return 'completed'
  if (stageId === 'live') return overall_status === 'live' ? 'completed' : 'not_started'

  const stageTasks = tasks.filter(t => t.stage === stageId)
  if (!stageTasks.length) return 'not_started'

  const allDone = stageTasks.every(t => t.status === 'completed')
  if (allDone) return 'completed'

  const anyInProgress = stageTasks.some(t => t.status === 'in_progress' || t.status === 'pending')
  if (anyInProgress) return 'in_progress'

  const anyBlocked = stageTasks.some(t => t.status === 'blocked')
  if (anyBlocked) return 'blocked'

  return 'not_started'
}

export function getOverallProgress(merchant) {
  return STAGES.map(s => ({ ...s, status: getStageStatus(merchant, s.id) }))
}

export function getDashboardStats(merchants) {
  return {
    total: merchants.length,
    in_progress: merchants.filter(m => !['live', 'account'].includes(m.overall_status)).length,
    awaiting_merchant: merchants.filter(m => {
      const next = getNextAction(m)
      return next?.task?.owner === 'Merchant'
    }).length,
    pending_internal: merchants.filter(m => {
      const next = getNextAction(m)
      return next?.task?.owner === 'Sales' || next?.task?.owner === 'Manager'
    }).length,
    ready_live: merchants.filter(m => m.overall_status === 'commercial').length,
    live: merchants.filter(m => m.overall_status === 'live').length,
  }
}
