import { ArrowLeft, Building2, CheckCircle2, ExternalLink } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { ActivityTimeline, NotesPanel } from '../components/ActivityTimeline'
import CommunicationHistory from '../components/CommunicationHistory'
import ContractPanel from '../components/ContractPanel'
import DiscountPanel from '../components/DiscountPanel'
import DocumentChecklist from '../components/DocumentChecklist'
import QuickActions from '../components/QuickActions'
import SignaturePanel from '../components/SignaturePanel'
import TaskSection from '../components/TaskSection'
import { Toast, openExternalTool, useToast } from '../components/Toast'
import WorkflowTimeline from '../components/WorkflowTimeline'
import { useApp } from '../context/AppContext'
import { EXTERNAL_TOOLS } from '../data/types'
import { getNextAction } from '../data/workflow'

const STAGE_LABELS = {
  account:'Account', restaurant_id:'Restaurant ID', documents:'GST & Docs',
  contract:'Contract', signature:'Signature', sales_closure:'Sales Closure',
  commercial:'Commercial Setup', live:'Live',
}

function NextActionCard({ merchant, showToast }) {
  const next = getNextAction(merchant)

  if (merchant.overall_status === 'live') {
    return (
      <div style={{ display:'flex', alignItems:'center', gap:'12px', background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'12px', padding:'16px 20px' }}>
        <CheckCircle2 size={20} color="#15803d" />
        <div>
          <div style={{ fontSize:'10px', fontWeight:700, color:'#15803d', textTransform:'uppercase', letterSpacing:'0.06em' }}>Account Status</div>
          <div style={{ fontSize:'14px', fontWeight:600, color:'#14532d', marginTop:'2px' }}>Account is Live</div>
        </div>
      </div>
    )
  }

  if (!next) return null

  const tool = next.task?.external_url ? EXTERNAL_TOOLS[next.task.external_url] : null
  const url = tool ? tool.getUrl(merchant.restaurant_id) : null

  return (
    <div style={{ display:'flex', alignItems:'center', gap:'16px', background:'#111827', borderRadius:'12px', padding:'16px 20px' }}>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:'10px', fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.06em' }}>Next Action</div>
        <div style={{ fontSize:'14px', fontWeight:600, color:'#ffffff', marginTop:'3px' }}>{next.label}</div>
        {next.task?.owner && (
          <div style={{ fontSize:'11px', color:'#6b7280', marginTop:'2px' }}>Owner: {next.task.owner}</div>
        )}
      </div>
      {url && (
        <button
          onClick={() => openExternalTool(url, showToast)}
          style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', fontWeight:600, background:'#ffffff', color:'#111827', border:'none', borderRadius:'8px', padding:'8px 14px', cursor:'pointer', flexShrink:0 }}
        >
          <ExternalLink size={12} /> Open ↗
        </button>
      )}
    </div>
  )
}

export default function MerchantDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getMerchant, updateMerchant, updateTask, updateDocument, addNote, addActivity, sendReminder } = useApp()
  const merchant = getMerchant(id)
  const { toast, showToast } = useToast()

  if (!merchant) {
    return (
      <div style={{ padding:'48px', textAlign:'center', color:'#9ca3af', fontSize:'14px' }}>
        Merchant not found.
      </div>
    )
  }

  function handleTaskUpdate(taskId, updates) {
    updateTask(id, taskId, updates)
    if (updates.status === 'completed') {
      const task = merchant.tasks.find(t => t.id === taskId)
      addActivity(id, `${task.name} Completed`, 'Task marked as complete')
    }
  }

  function handleDocUpdate(docType, status) {
    updateDocument(id, docType, status)
    addActivity(id, 'Document Updated', `${docType} marked as ${status}`)
  }

  const freshTasks = merchant.tasks.filter(t => t.stage === 'restaurant_id')
  const docTasks = merchant.tasks.filter(t => t.stage === 'documents')
  const scTasks = merchant.tasks.filter(t => t.stage === 'sales_closure')

  return (
    <div style={{ padding:'32px', maxWidth:'1200px', margin:'0 auto' }}>
      <Toast message={toast} onClose={() => {}} />

      <button
        onClick={() => navigate('/')}
        style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', color:'#6b7280', background:'none', border:'none', cursor:'pointer', marginBottom:'20px', padding:0 }}
        onMouseEnter={e => e.currentTarget.style.color='#111827'}
        onMouseLeave={e => e.currentTarget.style.color='#6b7280'}
      >
        <ArrowLeft size={14} /> Back to Dashboard
      </button>

      {/* Account Header */}
      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'12px', padding:'24px', marginBottom:'16px' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'20px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
            <div style={{ width:'44px', height:'44px', background:'#f3f4f6', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Building2 size={20} color="#6b7280" />
            </div>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                <h1 style={{ fontSize:'18px', fontWeight:700, color:'#111827', margin:0 }}>{merchant.restaurant_name}</h1>
                <span style={{ fontSize:'10px', fontWeight:700, background:'#fef3c7', color:'#92400e', padding:'2px 6px', borderRadius:'4px' }}>DEMO</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginTop:'5px', flexWrap:'wrap' }}>
                {merchant.restaurant_id && (
                  <span style={{ fontFamily:'monospace', fontSize:'11px', background:'#f3f4f6', color:'#6b7280', padding:'2px 8px', borderRadius:'4px' }}>
                    {merchant.restaurant_id}
                  </span>
                )}
                <span style={{ fontSize:'12px', color:'#9ca3af' }}>{merchant.restaurant_type}</span>
                <span style={{ fontSize:'11px', fontWeight:500, background: merchant.listing_type==='fresh'?'#faf5ff':'#f9fafb', color: merchant.listing_type==='fresh'?'#7e22ce':'#6b7280', padding:'2px 8px', borderRadius:'999px', border:`1px solid ${merchant.listing_type==='fresh'?'#e9d5ff':'#e5e7eb'}` }}>
                  {merchant.listing_type === 'fresh' ? 'Fresh Listing' : 'Existing Listing'}
                </span>
              </div>
            </div>
          </div>
          <div style={{ textAlign:'right', fontSize:'12px', color:'#9ca3af', flexShrink:0 }}>
            <div>Stage: <span style={{ fontWeight:600, color:'#374151' }}>{STAGE_LABELS[merchant.overall_status]}</span></div>
            <div style={{ marginTop:'3px' }}>Created {new Date(merchant.created_at).toLocaleDateString()}</div>
            <div style={{ marginTop:'2px' }}>Updated {new Date(merchant.updated_at).toLocaleDateString()}</div>
          </div>
        </div>

        <div style={{ marginBottom:'20px' }}>
          <WorkflowTimeline merchant={merchant} />
        </div>

        <NextActionCard merchant={merchant} showToast={showToast} />
      </div>

      {/* Quick Actions */}
      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'12px', padding:'16px 20px', marginBottom:'16px' }}>
        <div style={{ fontSize:'10px', fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'10px' }}>Quick Actions</div>
        <QuickActions merchant={merchant} showToast={showToast} />
      </div>

      {/* Main content grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'16px' }}>
        {/* Left column */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

          {/* Merchant Info */}
          <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'12px', padding:'20px' }}>
            <div style={{ fontSize:'13px', fontWeight:600, color:'#111827', marginBottom:'14px' }}>Merchant Information</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'14px' }}>
              {[
                { label:'Contact', value:merchant.contact_name },
                { label:'Phone', value:merchant.phone },
                { label:'Email', value:merchant.email },
                { label:'Legal Entity', value:merchant.legal_entity||'—' },
              ].map(f => (
                <div key={f.label}>
                  <div style={{ fontSize:'11px', color:'#9ca3af', marginBottom:'2px' }}>{f.label}</div>
                  <div style={{ fontSize:'13px', fontWeight:500, color:'#374151' }}>{f.value}</div>
                </div>
              ))}
            </div>
          </div>

          {merchant.listing_type === 'fresh' && freshTasks.length > 0 && (
            <TaskSection title="Fresh Listing" tasks={freshTasks} onUpdate={handleTaskUpdate} merchantId={merchant.restaurant_id} showToast={showToast} />
          )}

          {docTasks.length > 0 && (
            <TaskSection title="GST & Document Tasks" tasks={docTasks} onUpdate={handleTaskUpdate} merchantId={merchant.restaurant_id} showToast={showToast} />
          )}

          <DocumentChecklist documents={merchant.documents} onUpdate={handleDocUpdate} />

          <ContractPanel merchant={merchant} onUpdate={u => updateMerchant(id, u)} onSendReminder={channels => sendReminder(id, channels)} showToast={showToast} />

          <SignaturePanel merchant={merchant} onUpdate={u => updateMerchant(id, u)} />

          {scTasks.length > 0 && (
            <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'12px', padding:'20px' }}>
              <div style={{ fontSize:'13px', fontWeight:600, color:'#111827', marginBottom:'6px' }}>Sales Closure</div>
              <div style={{ fontSize:'12px', color:'#6b7280', marginBottom:'14px' }}>Complete the sales closure process after contract execution.</div>
              <TaskSection tasks={scTasks} onUpdate={handleTaskUpdate} merchantId={merchant.restaurant_id} showToast={showToast} />
            </div>
          )}

          <DiscountPanel merchant={merchant} onUpdate={u => updateMerchant(id, u)} showToast={showToast} />
        </div>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          <NotesPanel
            notes={merchant.notes}
            onAdd={text => { addNote(id, text); addActivity(id, 'Note Added', text.slice(0, 60)) }}
          />
          <CommunicationHistory comms={merchant.comms_history} />
          <ActivityTimeline activity={merchant.activity} />
        </div>
      </div>
    </div>
  )
}
