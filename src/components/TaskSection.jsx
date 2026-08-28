import { CheckCircle, Clock } from 'lucide-react'
import Badge from './Badge'
import { openExternalTool } from './Toast'
import { EXTERNAL_TOOLS } from '../data/types'

function TaskRow({ task, onUpdate, merchantId, showToast }) {
  const tool = task.external_url ? EXTERNAL_TOOLS[task.external_url] : null
  const url = tool ? tool.getUrl(merchantId) : null
  const done = task.status === 'completed'

  return (
    <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 0', borderBottom:'1px solid #f9fafb' }}>
      <div style={{ width:'18px', height:'18px', borderRadius:'50%', border:`2px solid ${done?'#10b981':'#d1d5db'}`, background:done?'#10b981':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        {done && <CheckCircle size={11} color="#fff" />}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:'13px', fontWeight:500, color:done?'#9ca3af':'#374151', textDecoration:done?'line-through':'none' }}>{task.name}</div>
        {task.notes && <div style={{ fontSize:'11px', color:'#9ca3af', marginTop:'2px' }}>{task.notes}</div>}
        {task.due_date && !done && (
          <div style={{ fontSize:'11px', color:'#b45309', marginTop:'2px', display:'flex', alignItems:'center', gap:'4px' }}>
            <Clock size={10} /> Due {task.due_date}
          </div>
        )}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'6px', flexShrink:0 }}>
        {task.owner && <span style={{ fontSize:'11px', color:'#9ca3af' }}>{task.owner}</span>}
        <Badge status={task.status} />
        {url && !done && (
          <button onClick={()=>openExternalTool(url,showToast)} style={{ fontSize:'11px', fontWeight:500, background:'#fff', color:'#374151', border:'1px solid #e5e7eb', borderRadius:'6px', padding:'4px 8px', cursor:'pointer' }}>
            Open ↗
          </button>
        )}
        {!done && (
          <button onClick={()=>onUpdate(task.id,{status:'completed',completed_at:new Date().toISOString()})} style={{ fontSize:'11px', fontWeight:500, background:'#f0fdf4', color:'#15803d', border:'1px solid #bbf7d0', borderRadius:'6px', padding:'4px 8px', cursor:'pointer' }}>
            Mark Done
          </button>
        )}
        {task.status==='not_started' && (
          <button onClick={()=>onUpdate(task.id,{status:'in_progress'})} style={{ fontSize:'11px', fontWeight:500, background:'#eff6ff', color:'#1d4ed8', border:'1px solid #bfdbfe', borderRadius:'6px', padding:'4px 8px', cursor:'pointer' }}>
            Start
          </button>
        )}
      </div>
    </div>
  )
}

export default function TaskSection({ title, tasks, onUpdate, merchantId, showToast }) {
  if (!tasks.length) return null
  return (
    <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'12px', overflow:'hidden' }}>
      {title && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', borderBottom:'1px solid #f3f4f6' }}>
          <div style={{ fontSize:'13px', fontWeight:600, color:'#111827' }}>{title}</div>
          <span style={{ fontSize:'11px', color:'#9ca3af' }}>{tasks.filter(t=>t.status==='completed').length}/{tasks.length} complete</span>
        </div>
      )}
      <div style={{ padding:'0 20px' }}>
        {tasks.map(t=><TaskRow key={t.id} task={t} onUpdate={onUpdate} merchantId={merchantId} showToast={showToast} />)}
      </div>
    </div>
  )
}
