import { AlertCircle, ArrowRight, CheckCircle2, Clock, Plus, Search, TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Badge from '../components/Badge'
import { openExternalTool, Toast, useToast } from '../components/Toast'
import { useApp } from '../context/AppContext'
import { EXTERNAL_TOOLS } from '../data/types'
import { getDashboardStats, getNextAction } from '../data/workflow'

const STAGE_OPTIONS = ['all','account','restaurant_id','documents','contract','signature','sales_closure','commercial','live']
const STAGE_LABELS = { all:'All Stages', account:'Account', restaurant_id:'Restaurant ID', documents:'GST & Docs', contract:'Contract', signature:'Signature', sales_closure:'Sales Closure', commercial:'Commercial', live:'Live' }

const stageOrder = ['account','restaurant_id','documents','contract','signature','sales_closure','commercial','live']
function getProgress(m) {
  const idx = stageOrder.indexOf(m.overall_status)
  return Math.round(((idx + 1) / stageOrder.length) * 100)
}

function StatCard({ label, value, color, icon: Icon }) {
  return (
    <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'12px', padding:'20px', flex:1, minWidth:0 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
        <span style={{ fontSize:'11px', fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</span>
        {Icon && <Icon size={14} color="#d1d5db" />}
      </div>
      <div style={{ fontSize:'28px', fontWeight:700, color: color || '#111827', lineHeight:1 }}>{value}</div>
    </div>
  )
}

function ActionCard({ merchant, showToast, navigate }) {
  const next = getNextAction(merchant)
  if (!next) return null
  const tool = next.task?.external_url ? EXTERNAL_TOOLS[next.task.external_url] : null
  const url = tool ? tool.getUrl(merchant.restaurant_id) : null

  return (
    <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'12px', padding:'16px' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'12px' }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:'13px', fontWeight:600, color:'#111827', marginBottom:'2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{merchant.restaurant_name}</div>
          <div style={{ fontSize:'11px', color:'#9ca3af', marginBottom:'10px' }}>{merchant.restaurant_id}</div>
          <div style={{ display:'inline-block', fontSize:'11px', fontWeight:600, color:'#b45309', background:'#fffbeb', border:'1px solid #fde68a', borderRadius:'6px', padding:'3px 8px' }}>
            {next.label}
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'6px', flexShrink:0 }}>
          {url && (
            <button onClick={() => openExternalTool(url, showToast)} style={{ fontSize:'11px', fontWeight:600, background:'#111827', color:'#fff', border:'none', borderRadius:'6px', padding:'5px 10px', cursor:'pointer' }}>
              Open ↗
            </button>
          )}
          <button onClick={() => navigate(`/merchant/${merchant.id}`)} style={{ fontSize:'11px', fontWeight:500, background:'none', border:'none', color:'#3b82f6', cursor:'pointer', padding:'2px 0' }}>
            View →
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { merchants, currentUser } = useApp()
  const navigate = useNavigate()
  const stats = getDashboardStats(merchants)
  const { toast, showToast } = useToast()
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('all')
  const [sort, setSort] = useState('newest')

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const actionRequired = useMemo(() => merchants.filter(m => m.overall_status !== 'live' && getNextAction(m)), [merchants])

  const filtered = useMemo(() => {
    let list = [...merchants]
    if (search) { const q = search.toLowerCase(); list = list.filter(m => m.restaurant_name.toLowerCase().includes(q) || (m.restaurant_id||'').toLowerCase().includes(q)) }
    if (stageFilter !== 'all') list = list.filter(m => m.overall_status === stageFilter)
    list.sort((a,b) => sort === 'newest' ? new Date(b.created_at)-new Date(a.created_at) : new Date(a.created_at)-new Date(b.created_at))
    return list
  }, [merchants, search, stageFilter, sort])

  const inputStyle = { fontSize:'13px', border:'1px solid #e5e7eb', borderRadius:'8px', padding:'7px 12px', fontFamily:'inherit', color:'#111827', background:'#fff', outline:'none' }

  return (
    <div style={{ padding:'32px', maxWidth:'1200px', margin:'0 auto' }}>
      <Toast message={toast} onClose={() => {}} />

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'28px' }}>
        <div>
          <h1 style={{ fontSize:'22px', fontWeight:700, color:'#111827', margin:0 }}>{greeting}, {currentUser.name.split(' ')[0]}</h1>
          <p style={{ fontSize:'13px', color:'#6b7280', marginTop:'4px', marginBottom:0 }}>Here's what's happening with your merchant onboarding pipeline.</p>
        </div>
        <button onClick={() => navigate('/new')} style={{ display:'flex', alignItems:'center', gap:'6px', background:'#111827', color:'#fff', border:'none', borderRadius:'8px', padding:'9px 16px', fontSize:'13px', fontWeight:500, cursor:'pointer' }}>
          <Plus size={14} /> New Merchant
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'flex', gap:'12px', marginBottom:'28px', flexWrap:'wrap' }}>
        <StatCard label="Total" value={stats.total} icon={TrendingUp} />
        <StatCard label="In Progress" value={stats.in_progress} color="#1d4ed8" icon={ArrowRight} />
        <StatCard label="Awaiting Merchant" value={stats.awaiting_merchant} color="#b45309" icon={Clock} />
        <StatCard label="Pending Internal" value={stats.pending_internal} color="#c2410c" icon={AlertCircle} />
        <StatCard label="Ready to Go Live" value={stats.ready_live} color="#7e22ce" />
        <StatCard label="Live" value={stats.live} color="#15803d" icon={CheckCircle2} />
      </div>

      {/* Action Required */}
      {actionRequired.length > 0 && (
        <div style={{ marginBottom:'28px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'14px' }}>
            <AlertCircle size={14} color="#f59e0b" />
            <span style={{ fontSize:'11px', fontWeight:700, color:'#111827', textTransform:'uppercase', letterSpacing:'0.06em' }}>Action Required</span>
            <span style={{ fontSize:'11px', fontWeight:600, background:'#fef3c7', color:'#92400e', padding:'1px 7px', borderRadius:'999px' }}>{actionRequired.length}</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'12px' }}>
            {actionRequired.slice(0,6).map(m => <ActionCard key={m.id} merchant={m} showToast={showToast} navigate={navigate} />)}
          </div>
        </div>
      )}

      {/* Pipeline Table */}
      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'12px', overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid #f3f4f6', flexWrap:'wrap', gap:'12px' }}>
          <span style={{ fontSize:'13px', fontWeight:600, color:'#111827' }}>Merchant Pipeline</span>
          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
            <div style={{ position:'relative' }}>
              <Search size={13} color="#9ca3af" style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)' }} />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" style={{ ...inputStyle, paddingLeft:'30px', width:'180px' }} />
            </div>
            <select value={stageFilter} onChange={e=>setStageFilter(e.target.value)} style={inputStyle}>
              {STAGE_OPTIONS.map(s=><option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
            </select>
            <select value={sort} onChange={e=>setSort(e.target.value)} style={inputStyle}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid #f3f4f6' }}>
                {['Restaurant','ID','Stage','Progress','Next Action','Status'].map(h=>(
                  <th key={h} style={{ textAlign:'left', fontSize:'11px', fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.05em', padding:'10px 20px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => {
                const next = getNextAction(m)
                const pct = getProgress(m)
                return (
                  <tr key={m.id} onClick={()=>navigate(`/merchant/${m.id}`)} style={{ borderBottom:'1px solid #f9fafb', cursor:'pointer', transition:'background 0.1s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#f9fafb'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{ padding:'14px 20px' }}>
                      <div style={{ fontSize:'13px', fontWeight:600, color:'#111827' }}>{m.restaurant_name}</div>
                      <div style={{ fontSize:'11px', color:'#9ca3af', marginTop:'2px' }}>{m.restaurant_type} · {m.listing_type==='fresh'?'Fresh':'Existing'}</div>
                    </td>
                    <td style={{ padding:'14px 20px', fontFamily:'monospace', fontSize:'12px', color:'#6b7280' }}>{m.restaurant_id||'—'}</td>
                    <td style={{ padding:'14px 20px', fontSize:'12px', fontWeight:500, color:'#374151' }}>{STAGE_LABELS[m.overall_status]}</td>
                    <td style={{ padding:'14px 20px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                        <div style={{ width:'72px', height:'4px', background:'#f3f4f6', borderRadius:'999px', overflow:'hidden' }}>
                          <div style={{ width:`${pct}%`, height:'100%', background:'#111827', borderRadius:'999px' }} />
                        </div>
                        <span style={{ fontSize:'11px', color:'#9ca3af' }}>{pct}%</span>
                      </div>
                    </td>
                    <td style={{ padding:'14px 20px', fontSize:'12px', color:'#1d4ed8', fontWeight:500 }}>
                      {next ? next.label : <span style={{ color:'#15803d' }}>✓ Live</span>}
                    </td>
                    <td style={{ padding:'14px 20px' }}>
                      <Badge status={m.overall_status==='live'?'live':m.overall_status} label={STAGE_LABELS[m.overall_status]} />
                    </td>
                  </tr>
                )
              })}
              {!filtered.length && (
                <tr><td colSpan={6} style={{ padding:'48px 20px', textAlign:'center', color:'#9ca3af', fontSize:'13px' }}>No merchants found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
