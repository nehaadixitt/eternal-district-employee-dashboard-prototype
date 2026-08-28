import { useState } from 'react'
import Badge from './Badge'
import { SIGNATURE_STATUS_LABELS } from '../data/types'

const SIG_STATUSES = ['not_sent','sent','awaiting','signed','rejected']
const sel = { fontSize:'13px', border:'1px solid #e5e7eb', borderRadius:'8px', padding:'7px 12px', fontFamily:'inherit', color:'#111827', background:'#fff', outline:'none', flex:1 }

export default function SignaturePanel({ merchant, onUpdate }) {
  const { signature } = merchant
  const [editing, setEditing] = useState(false)
  const [status, setStatus] = useState(signature.status)

  function save() {
    onUpdate({ signature: { ...signature, status } })
    setEditing(false)
  }

  return (
    <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'12px', padding:'20px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
        <div style={{ fontSize:'13px', fontWeight:600, color:'#111827' }}>Merchant Signature</div>
        <Badge status={signature.status} label={SIGNATURE_STATUS_LABELS[signature.status]} />
      </div>
      {signature.reminder_sent_at && (
        <div style={{ fontSize:'12px', color:'#9ca3af', marginBottom:'12px' }}>Last reminder: {new Date(signature.reminder_sent_at).toLocaleString()}</div>
      )}
      {editing ? (
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          <select value={status} onChange={e=>setStatus(e.target.value)} style={sel}>
            {SIG_STATUSES.map(s=><option key={s} value={s}>{SIGNATURE_STATUS_LABELS[s]}</option>)}
          </select>
          <button onClick={save} style={{ background:'#111827', color:'#fff', border:'none', borderRadius:'8px', padding:'7px 14px', fontSize:'12px', fontWeight:500, cursor:'pointer' }}>Save</button>
          <button onClick={()=>setEditing(false)} style={{ background:'none', border:'none', color:'#6b7280', fontSize:'12px', cursor:'pointer', padding:'7px 8px' }}>Cancel</button>
        </div>
      ) : (
        <div style={{ display:'flex', gap:'8px' }}>
          <button onClick={()=>onUpdate({signature:{...signature,reminder_sent_at:new Date().toISOString()}})} style={{ fontSize:'12px', fontWeight:500, background:'#fffbeb', color:'#b45309', border:'1px solid #fde68a', borderRadius:'8px', padding:'7px 12px', cursor:'pointer' }}>
            Send Reminder
          </button>
          <button onClick={()=>setEditing(true)} style={{ fontSize:'12px', fontWeight:500, background:'#fff', color:'#374151', border:'1px solid #e5e7eb', borderRadius:'8px', padding:'7px 12px', cursor:'pointer' }}>
            Update Status
          </button>
        </div>
      )}
    </div>
  )
}
