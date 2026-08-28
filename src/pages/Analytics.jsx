import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getNextAction } from '../data/workflow'
import Badge from '../components/Badge'

const FUNNEL_STAGES = [
  { key:'agreed', label:'Merchant Agreed' },
  { key:'restaurant_id', label:'Restaurant ID Ready' },
  { key:'contract', label:'Contract Raised' },
  { key:'signature', label:'Contract Signed' },
  { key:'sales_closure', label:'Sales Closure' },
  { key:'live', label:'Live' },
]
const STAGE_ORDER = ['account','restaurant_id','documents','contract','signature','sales_closure','commercial','live']
const STAGE_LABELS = { account:'Account', restaurant_id:'Restaurant ID', documents:'GST & Docs', contract:'Contract', signature:'Signature', sales_closure:'Sales Closure', commercial:'Commercial', live:'Live' }

function stageIndex(s) { return STAGE_ORDER.indexOf(s) }

const FUNNEL_COLORS = ['#3b82f6','#6366f1','#8b5cf6','#a855f7','#ec4899','#10b981']

export default function Analytics() {
  const { merchants } = useApp()
  const navigate = useNavigate()

  const total = merchants.length
  const live = merchants.filter(m=>m.overall_status==='live').length
  const completionRate = total ? Math.round((live/total)*100) : 0
  const avgDays = (() => {
    const lm = merchants.filter(m=>m.overall_status==='live')
    if (!lm.length) return '—'
    const avg = lm.reduce((s,m)=>(s+(new Date(m.updated_at)-new Date(m.created_at))/(86400000)),0)/lm.length
    return `${Math.round(avg)} days`
  })()

  const pendingMerchant = merchants.filter(m=>getNextAction(m)?.task?.owner==='Merchant').length
  const pendingSales = merchants.filter(m=>{ const n=getNextAction(m); return n?.task?.owner==='Sales' }).length
  const pendingDocs = merchants.filter(m=>m.documents.some(d=>d.status!=='completed')).length
  const pendingClosure = merchants.filter(m=>m.overall_status==='sales_closure').length

  const funnelCounts = {
    agreed: total,
    restaurant_id: merchants.filter(m=>stageIndex(m.overall_status)>=stageIndex('restaurant_id')).length,
    contract: merchants.filter(m=>m.contract.status!=='not_raised').length,
    signature: merchants.filter(m=>m.signature.status==='signed').length,
    sales_closure: merchants.filter(m=>stageIndex(m.overall_status)>=stageIndex('sales_closure')).length,
    live,
  }
  const maxFunnel = funnelCounts.agreed || 1

  const recentMerchants = [...merchants].sort((a,b)=>new Date(b.updated_at)-new Date(a.updated_at)).slice(0,5)

  const card = { background:'#fff', border:'1px solid #e5e7eb', borderRadius:'12px', padding:'20px' }

  return (
    <div style={{ padding:'32px', maxWidth:'1100px', margin:'0 auto' }}>
      <div style={{ marginBottom:'28px' }}>
        <h1 style={{ fontSize:'22px', fontWeight:700, color:'#111827', margin:0 }}>Analytics</h1>
        <p style={{ fontSize:'13px', color:'#9ca3af', marginTop:'4px', marginBottom:0 }}>Onboarding pipeline overview · Demo data</p>
      </div>

      {/* Summary + Pending */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'20px' }}>
        <div style={card}>
          <div style={{ fontSize:'12px', fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'16px' }}>Summary</div>
          {[
            { label:'Total Accounts', value:total, color:'#111827' },
            { label:'Average Onboarding Time', value:avgDays, color:'#111827' },
            { label:'Completion Rate', value:`${completionRate}%`, color:'#15803d' },
            { label:'Accounts Live', value:live, color:'#15803d' },
          ].map(r=>(
            <div key={r.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid #f9fafb' }}>
              <span style={{ fontSize:'13px', color:'#374151' }}>{r.label}</span>
              <span style={{ fontSize:'13px', fontWeight:700, color:r.color }}>{r.value}</span>
            </div>
          ))}
        </div>

        <div style={card}>
          <div style={{ fontSize:'12px', fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'16px' }}>Pending Actions</div>
          {[
            { label:'Awaiting Merchant Action', value:pendingMerchant, color:'#b45309', bg:'#fffbeb' },
            { label:'Pending Sales Action', value:pendingSales, color:'#1d4ed8', bg:'#eff6ff' },
            { label:'Pending Documentation', value:pendingDocs, color:'#c2410c', bg:'#fff7ed' },
            { label:'Pending Sales Closure', value:pendingClosure, color:'#7e22ce', bg:'#faf5ff' },
          ].map(r=>(
            <div key={r.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid #f9fafb' }}>
              <span style={{ fontSize:'13px', color:'#374151' }}>{r.label}</span>
              <span style={{ fontSize:'13px', fontWeight:700, background:r.bg, color:r.color, padding:'2px 10px', borderRadius:'999px' }}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Funnel */}
      <div style={{ ...card, marginBottom:'20px' }}>
        <div style={{ fontSize:'12px', fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'20px' }}>Onboarding Funnel</div>
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {FUNNEL_STAGES.map((stage, i) => {
            const count = funnelCounts[stage.key]
            const pct = Math.round((count/maxFunnel)*100)
            return (
              <div key={stage.key} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <span style={{ fontSize:'12px', color:'#6b7280', width:'160px', flexShrink:0 }}>{stage.label}</span>
                <div style={{ flex:1, background:'#f3f4f6', borderRadius:'999px', height:'24px', overflow:'hidden', position:'relative' }}>
                  <div style={{ width:`${pct}%`, height:'100%', background:FUNNEL_COLORS[i], borderRadius:'999px', display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:'10px', minWidth: count>0?'32px':0, transition:'width 0.4s ease' }}>
                    {count > 0 && <span style={{ fontSize:'11px', fontWeight:700, color:'#fff' }}>{count}</span>}
                  </div>
                </div>
                <span style={{ fontSize:'12px', fontWeight:600, color:'#374151', width:'36px', textAlign:'right' }}>{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={card}>
        <div style={{ fontSize:'12px', fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'16px' }}>Recent Merchant Activity</div>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid #f3f4f6' }}>
              {['Restaurant','Restaurant ID','Stage','Next Action','Updated','Status'].map(h=>(
                <th key={h} style={{ textAlign:'left', fontSize:'11px', fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.05em', padding:'8px 12px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentMerchants.map(m => {
              const next = getNextAction(m)
              const updated = new Date(m.updated_at)
              const now = new Date()
              const diffH = Math.round((now-updated)/3600000)
              const updatedLabel = diffH < 1 ? 'Just now' : diffH < 24 ? `${diffH}h ago` : diffH < 48 ? 'Yesterday' : updated.toLocaleDateString()
              return (
                <tr key={m.id} onClick={()=>navigate(`/merchant/${m.id}`)} style={{ borderBottom:'1px solid #f9fafb', cursor:'pointer' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#f9fafb'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'12px 12px', fontSize:'13px', fontWeight:600, color:'#111827' }}>{m.restaurant_name}</td>
                  <td style={{ padding:'12px 12px', fontFamily:'monospace', fontSize:'12px', color:'#6b7280' }}>{m.restaurant_id||'—'}</td>
                  <td style={{ padding:'12px 12px', fontSize:'12px', color:'#374151' }}>{STAGE_LABELS[m.overall_status]}</td>
                  <td style={{ padding:'12px 12px', fontSize:'12px', color:'#1d4ed8', fontWeight:500 }}>{next?next.label:<span style={{color:'#15803d'}}>✓ Live</span>}</td>
                  <td style={{ padding:'12px 12px', fontSize:'12px', color:'#9ca3af' }}>{updatedLabel}</td>
                  <td style={{ padding:'12px 12px' }}><Badge status={m.overall_status==='live'?'live':m.overall_status} label={STAGE_LABELS[m.overall_status]} /></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
