import { Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Badge from '../components/Badge'
import { useApp } from '../context/AppContext'
import { getNextAction } from '../data/workflow'

const STAGE_OPTIONS = ['all','account','restaurant_id','documents','contract','signature','sales_closure','commercial','live']
const STAGE_LABELS = { all:'All Stages', account:'Account', restaurant_id:'Restaurant ID', documents:'GST & Docs', contract:'Contract', signature:'Signature', sales_closure:'Sales Closure', commercial:'Commercial', live:'Live' }

export default function Merchants() {
  const { merchants } = useApp()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('all')

  const filtered = useMemo(() => {
    let list = [...merchants]
    if (search) { const q = search.toLowerCase(); list = list.filter(m => m.restaurant_name.toLowerCase().includes(q) || (m.restaurant_id||'').toLowerCase().includes(q)) }
    if (stageFilter !== 'all') list = list.filter(m => m.overall_status === stageFilter)
    return list.sort((a,b) => new Date(b.created_at)-new Date(a.created_at))
  }, [merchants, search, stageFilter])

  const inputStyle = { fontSize:'13px', border:'1px solid #e5e7eb', borderRadius:'8px', padding:'7px 12px', fontFamily:'inherit', color:'#111827', background:'#fff', outline:'none' }

  return (
    <div style={{ padding:'32px', maxWidth:'1200px', margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'28px' }}>
        <div>
          <h1 style={{ fontSize:'22px', fontWeight:700, color:'#111827', margin:0 }}>Merchants</h1>
          <p style={{ fontSize:'13px', color:'#6b7280', marginTop:'4px', marginBottom:0 }}>Manage restaurant onboarding accounts and track progress.</p>
        </div>
        <button onClick={()=>navigate('/new')} style={{ display:'flex', alignItems:'center', gap:'6px', background:'#111827', color:'#fff', border:'none', borderRadius:'8px', padding:'9px 16px', fontSize:'13px', fontWeight:500, cursor:'pointer' }}>
          <Plus size={14} /> New Merchant
        </button>
      </div>

      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'12px', overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'16px 20px', borderBottom:'1px solid #f3f4f6', flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:1, minWidth:'200px' }}>
            <Search size={13} color="#9ca3af" style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)' }} />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or Restaurant ID…" style={{ ...inputStyle, paddingLeft:'30px', width:'100%' }} />
          </div>
          <select value={stageFilter} onChange={e=>setStageFilter(e.target.value)} style={inputStyle}>
            {STAGE_OPTIONS.map(s=><option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
          </select>
        </div>

        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid #f3f4f6' }}>
                {['Restaurant','Restaurant ID','Type','Current Stage','Next Action','Last Updated','Status'].map(h=>(
                  <th key={h} style={{ textAlign:'left', fontSize:'11px', fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.05em', padding:'10px 20px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => {
                const next = getNextAction(m)
                return (
                  <tr key={m.id} onClick={()=>navigate(`/merchant/${m.id}`)} style={{ borderBottom:'1px solid #f9fafb', cursor:'pointer' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#f9fafb'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{ padding:'14px 20px' }}>
                      <div style={{ fontSize:'13px', fontWeight:600, color:'#111827' }}>{m.restaurant_name}</div>
                      <div style={{ fontSize:'11px', color:'#9ca3af', marginTop:'2px' }}>{m.legal_entity}</div>
                    </td>
                    <td style={{ padding:'14px 20px', fontFamily:'monospace', fontSize:'12px', color:'#6b7280' }}>{m.restaurant_id||'—'}</td>
                    <td style={{ padding:'14px 20px', fontSize:'12px', color:'#6b7280' }}>{m.restaurant_type}</td>
                    <td style={{ padding:'14px 20px', fontSize:'12px', fontWeight:500, color:'#374151' }}>{STAGE_LABELS[m.overall_status]}</td>
                    <td style={{ padding:'14px 20px', fontSize:'12px', color:'#1d4ed8', fontWeight:500 }}>
                      {next ? next.label : <span style={{ color:'#15803d' }}>✓ Live</span>}
                    </td>
                    <td style={{ padding:'14px 20px', fontSize:'12px', color:'#9ca3af' }}>{new Date(m.updated_at).toLocaleDateString()}</td>
                    <td style={{ padding:'14px 20px' }}>
                      <Badge status={m.overall_status==='live'?'live':m.overall_status} label={STAGE_LABELS[m.overall_status]} />
                    </td>
                  </tr>
                )
              })}
              {!filtered.length && (
                <tr><td colSpan={7} style={{ padding:'48px 20px', textAlign:'center', color:'#9ca3af', fontSize:'13px' }}>No merchants found. Try changing your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
