import { ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { openExternalTool } from './Toast'
import { EXTERNAL_TOOLS } from '../data/types'

const inp = { fontSize:'13px', border:'1px solid #e5e7eb', borderRadius:'8px', padding:'7px 10px', fontFamily:'inherit', color:'#111827', background:'#fff', outline:'none', width:'100%' }

function DiscountCard({ title, toolKey, applicable, formStatus, data, onSave, onMarkComplete, showToast }) {
  const tool = EXTERNAL_TOOLS[toolKey]
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ percentage:data?.percentage||'', duration_days:data?.duration_days||'', start_date:data?.start_date||'', end_date:data?.end_date||'' })
  const set = (k,v) => setForm(f=>({...f,[k]:v}))
  const isDone = formStatus === 'completed'
  const isNA = applicable === false

  return (
    <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'12px', padding:'18px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
        <div style={{ fontSize:'13px', fontWeight:600, color:'#111827' }}>{title}</div>
        {isNA && <span style={{ fontSize:'11px', fontWeight:600, background:'#f9fafb', color:'#6b7280', padding:'2px 8px', borderRadius:'999px', border:'1px solid #e5e7eb' }}>Not Applicable</span>}
        {!isNA && isDone && <span style={{ fontSize:'11px', fontWeight:600, background:'#f0fdf4', color:'#15803d', padding:'2px 8px', borderRadius:'999px', border:'1px solid #bbf7d0' }}>Completed</span>}
        {!isNA && !isDone && <span style={{ fontSize:'11px', fontWeight:600, background:'#fffbeb', color:'#b45309', padding:'2px 8px', borderRadius:'999px', border:'1px solid #fde68a' }}>Pending</span>}
      </div>

      {isNA ? (
        <div style={{ fontSize:'12px', color:'#9ca3af' }}>Not applicable for this merchant.</div>
      ) : (
        <>
          {data?.percentage && !editing && (
            <div style={{ display:'flex', gap:'20px', marginBottom:'12px' }}>
              {[['Discount',`${data.percentage}%`],['Duration',`${data.duration_days} days`],['Start',data.start_date||'—'],['End',data.end_date||'—']].map(([l,v])=>(
                <div key={l}><div style={{ fontSize:'10px', color:'#9ca3af', marginBottom:'2px' }}>{l}</div><div style={{ fontSize:'13px', fontWeight:600, color:'#111827' }}>{v}</div></div>
              ))}
            </div>
          )}
          {editing && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'12px' }}>
              {[['Discount %','percentage','number','e.g. 20'],['Duration (days)','duration_days','number','e.g. 30'],['Start Date','start_date','date',''],['End Date','end_date','date','']].map(([label,key,type,ph])=>(
                <div key={key}>
                  <div style={{ fontSize:'11px', fontWeight:500, color:'#6b7280', marginBottom:'4px' }}>{label}</div>
                  <input type={type} value={form[key]} onChange={e=>set(key,e.target.value)} placeholder={ph} style={inp} />
                </div>
              ))}
            </div>
          )}
          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
            <button onClick={()=>openExternalTool(tool.getUrl(),showToast)} style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'12px', fontWeight:500, background:'#fff', color:'#374151', border:'1px solid #e5e7eb', borderRadius:'8px', padding:'6px 12px', cursor:'pointer' }}>
              <ExternalLink size={11} /> {tool.label} ↗
            </button>
            {!isDone && !editing && (
              <button onClick={()=>setEditing(true)} style={{ fontSize:'12px', fontWeight:500, background:'#fff', color:'#374151', border:'1px solid #e5e7eb', borderRadius:'8px', padding:'6px 12px', cursor:'pointer' }}>Edit Details</button>
            )}
            {editing && (
              <>
                <button onClick={()=>{onSave(form);setEditing(false)}} style={{ fontSize:'12px', fontWeight:500, background:'#111827', color:'#fff', border:'none', borderRadius:'8px', padding:'6px 12px', cursor:'pointer' }}>Save</button>
                <button onClick={()=>setEditing(false)} style={{ background:'none', border:'none', color:'#6b7280', fontSize:'12px', cursor:'pointer', padding:'6px 8px' }}>Cancel</button>
              </>
            )}
            {!isDone && !editing && (
              <button onClick={onMarkComplete} style={{ fontSize:'12px', fontWeight:500, background:'#f0fdf4', color:'#15803d', border:'1px solid #bbf7d0', borderRadius:'8px', padding:'6px 12px', cursor:'pointer' }}>Mark Complete</button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default function DiscountPanel({ merchant, onUpdate, showToast }) {
  const { discount } = merchant
  const [deciding, setDeciding] = useState(discount.applicable === null)
  const [wa, setWa] = useState(discount.applicable)
  const [pa, setPa] = useState(discount.prebook_applicable ?? false)

  if (deciding) {
    return (
      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'12px', padding:'20px' }}>
        <div style={{ fontSize:'13px', fontWeight:600, color:'#111827', marginBottom:'16px' }}>Commercial Setup</div>
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          {[['Walk-In Discount',wa,setWa],['Pre-Book Discount',pa,setPa]].map(([label,val,setter])=>(
            <div key={label}>
              <div style={{ fontSize:'12px', fontWeight:600, color:'#374151', marginBottom:'8px' }}>{label}</div>
              <div style={{ display:'flex', gap:'8px' }}>
                {[true,false].map(v=>(
                  <button key={String(v)} onClick={()=>setter(v)} style={{ fontSize:'12px', fontWeight:500, padding:'6px 16px', borderRadius:'8px', border:`2px solid ${val===v?'#111827':'#e5e7eb'}`, background:val===v?'#111827':'#fff', color:val===v?'#fff':'#6b7280', cursor:'pointer' }}>
                    {v?'Yes':'No'}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button disabled={wa===null} onClick={()=>{onUpdate({discount:{...discount,applicable:wa,prebook_applicable:pa}});setDeciding(false)}} style={{ background:'#111827', color:'#fff', border:'none', borderRadius:'8px', padding:'9px 18px', fontSize:'13px', fontWeight:500, cursor:'pointer', opacity:wa===null?0.4:1, alignSelf:'flex-start', marginTop:'4px' }}>
            Confirm
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontSize:'13px', fontWeight:600, color:'#111827' }}>Commercial Setup</div>
        <button onClick={()=>setDeciding(true)} style={{ fontSize:'12px', color:'#3b82f6', background:'none', border:'none', cursor:'pointer' }}>Reconfigure</button>
      </div>
      <DiscountCard title="Walk-In Discount" toolKey="walkin_discount" applicable={discount.applicable} formStatus={discount.form_status} data={discount}
        onSave={f=>onUpdate({discount:{...discount,...f}})}
        onMarkComplete={()=>onUpdate({discount:{...discount,form_status:'completed'}})}
        showToast={showToast} />
      <DiscountCard title="Pre-Book Discount" toolKey="prebook_discount" applicable={discount.prebook_applicable} formStatus={discount.prebook_form_status||'pending'} data={{ percentage:discount.prebook_percentage, duration_days:discount.prebook_duration_days, start_date:discount.prebook_start_date, end_date:discount.prebook_end_date }}
        onSave={f=>onUpdate({discount:{...discount,prebook_percentage:f.percentage,prebook_duration_days:f.duration_days,prebook_start_date:f.start_date,prebook_end_date:f.end_date}})}
        onMarkComplete={()=>onUpdate({discount:{...discount,prebook_form_status:'completed'}})}
        showToast={showToast} />
    </div>
  )
}
