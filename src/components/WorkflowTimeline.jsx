import { Check } from 'lucide-react'
import { getOverallProgress } from '../data/workflow'

const dotStyle = {
  completed:   { background:'#10b981', border:'2px solid #10b981', color:'#fff' },
  in_progress: { background:'#3b82f6', border:'2px solid #3b82f6', color:'#fff' },
  pending:     { background:'#f59e0b', border:'2px solid #f59e0b', color:'#fff' },
  blocked:     { background:'#ef4444', border:'2px solid #ef4444', color:'#fff' },
  not_started: { background:'#fff',    border:'2px solid #e5e7eb', color:'#9ca3af' },
}
const lineColor = {
  completed:'#10b981', in_progress:'#3b82f6', pending:'#f59e0b', blocked:'#ef4444', not_started:'#e5e7eb',
}
const labelColor = {
  completed:'#10b981', in_progress:'#3b82f6', pending:'#b45309', blocked:'#ef4444', not_started:'#9ca3af',
}

export default function WorkflowTimeline({ merchant }) {
  const stages = getOverallProgress(merchant)
  return (
    <div style={{ display:'flex', alignItems:'flex-start', width:'100%', overflowX:'auto', paddingBottom:'4px' }}>
      {stages.map((stage, i) => (
        <div key={stage.id} style={{ display:'flex', alignItems:'center', flex:1, minWidth:0 }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
            <div style={{ width:'28px', height:'28px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:700, ...dotStyle[stage.status] }}>
              {stage.status === 'completed' ? <Check size={12} /> : i + 1}
            </div>
            <span style={{ fontSize:'10px', fontWeight:600, color:labelColor[stage.status], marginTop:'5px', whiteSpace:'nowrap' }}>
              {stage.label}
            </span>
          </div>
          {i < stages.length - 1 && (
            <div style={{ flex:1, height:'2px', background:lineColor[stages[i+1].status], margin:'0 4px', marginBottom:'16px' }} />
          )}
        </div>
      ))}
    </div>
  )
}
