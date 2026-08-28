import { ExternalLink } from 'lucide-react'
import { useState } from 'react'
import Badge from './Badge'
import { openExternalTool } from './Toast'
import { CONTRACT_STATUS_LABELS, EXTERNAL_TOOLS } from '../data/types'

const CONTRACT_STATUSES = ['not_raised','raised','sent','signed','rejected','correction']

const sel = { fontSize:'13px', border:'1px solid #e5e7eb', borderRadius:'8px', padding:'7px 12px', fontFamily:'inherit', color:'#111827', background:'#fff', outline:'none', flex:1 }

export default function ContractPanel({ merchant, onUpdate, showToast }) {
  const { contract } = merchant
  const [editing, setEditing] = useState(false)
  const [status, setStatus] = useState(contract.status)
  const tool = EXTERNAL_TOOLS.contract

  function save() {
    onUpdate({ contract: { ...contract, status, raised_at: status!=='not_raised'&&!contract.raised_at?new Date().toISOString():contract.raised_at, signed_at: status==='signed'&&!contract.signed_at?new Date().toISOString():contract.signed_at } })
    setEditing(false)
  }

  return (
    <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'12px', padding:'20px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
        <div style={{ fontSize:'13px', fontWeight:600, color:'#111827' }}>Contract</div>
        <Badge status={contract.status} label={CONTRACT_STATUS_LABELS[contract.status]} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'16px' }}>
        {[
          { label:'Contract ID', value:contract.contract_id||'—' },
          { label:'Date Raised', value:contract.raised_at?new Date(contract.raised_at).toLocaleDateString():'—' },
          { label:'Merchant Email', value:merchant.email },
          { label:'Signed Date', value:contract.signed_at?new Date(contract.signed_at).toLocaleDateString():'—' },
        ].map(f=>(
          <div key={f.label}>
            <div style={{ fontSize:'11px', color:'#9ca3af', marginBottom:'2px' }}>{f.label}</div>
            <div style={{ fontSize:'13px', fontWeight:500, color:'#374151' }}>{f.value}</div>
          </div>
        ))}
      </div>
      {editing ? (
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          <select value={status} onChange={e=>setStatus(e.target.value)} style={sel}>
            {CONTRACT_STATUSES.map(s=><option key={s} value={s}>{CONTRACT_STATUS_LABELS[s]}</option>)}
          </select>
          <button onClick={save} style={{ background:'#111827', color:'#fff', border:'none', borderRadius:'8px', padding:'7px 14px', fontSize:'12px', fontWeight:500, cursor:'pointer' }}>Save</button>
          <button onClick={()=>setEditing(false)} style={{ background:'none', border:'none', color:'#6b7280', fontSize:'12px', cursor:'pointer', padding:'7px 8px' }}>Cancel</button>
        </div>
      ) : (
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
          <button onClick={()=>openExternalTool(tool.getUrl(),showToast)} style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', fontWeight:500, background:'#fff', color:'#374151', border:'1px solid #e5e7eb', borderRadius:'8px', padding:'7px 12px', cursor:'pointer' }}>
            <ExternalLink size={12} /> Contract Portal ↗
          </button>
          <button onClick={()=>setEditing(true)} style={{ fontSize:'12px', fontWeight:500, background:'#fff', color:'#374151', border:'1px solid #e5e7eb', borderRadius:'8px', padding:'7px 12px', cursor:'pointer' }}>
            Update Status
          </button>
        </div>
      )}
    </div>
  )
}
