import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { RESTAURANT_TYPES } from '../data/types'

const inp = { fontSize:'13px', border:'1px solid #e5e7eb', borderRadius:'8px', padding:'8px 12px', fontFamily:'inherit', color:'#111827', background:'#fff', outline:'none', width:'100%', boxSizing:'border-box' }
const lbl = { fontSize:'12px', fontWeight:500, color:'#374151', display:'block', marginBottom:'5px' }

export default function NewMerchant() {
  const { addMerchant } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    restaurant_name:'', legal_entity:'', contact_name:'', phone:'', email:'',
    restaurant_type:'Cafe', listing_type:'', restaurant_id:'',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function handleSubmit() {
    const id = addMerchant(form)
    navigate(`/merchant/${id}`)
  }

  const canStep1 = form.restaurant_name && form.contact_name && form.phone && form.email
  const canSubmit = form.listing_type && (form.listing_type !== 'existing' || form.restaurant_id)

  return (
    <div style={{ padding:'32px', maxWidth:'640px', margin:'0 auto' }}>
      <button
        onClick={() => navigate('/')}
        style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', color:'#6b7280', background:'none', border:'none', cursor:'pointer', marginBottom:'24px', padding:0 }}
      >
        <ArrowLeft size={14} /> Back to Dashboard
      </button>

      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'12px', padding:'28px' }}>
        {/* Steps */}
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'24px' }}>
          {[1, 2].map(s => (
            <div key={s} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <div style={{ width:'26px', height:'26px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:700, background: step >= s ? '#111827' : '#f3f4f6', color: step >= s ? '#fff' : '#9ca3af' }}>{s}</div>
              <span style={{ fontSize:'12px', color: step === s ? '#111827' : '#9ca3af', fontWeight: step === s ? 600 : 400 }}>
                {s === 1 ? 'Merchant Information' : 'Platform Association'}
              </span>
              {s < 2 && <div style={{ width:'24px', height:'1px', background:'#e5e7eb' }} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <div style={{ fontSize:'16px', fontWeight:700, color:'#111827', marginBottom:'20px' }}>Merchant Information</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
              <div>
                <label style={lbl}>Restaurant Name *</label>
                <input style={inp} value={form.restaurant_name} onChange={e=>set('restaurant_name',e.target.value)} placeholder="e.g. Retro Cafe" />
              </div>
              <div>
                <label style={lbl}>Legal Entity Name</label>
                <input style={inp} value={form.legal_entity} onChange={e=>set('legal_entity',e.target.value)} placeholder="e.g. Retro Hospitality Pvt Ltd" />
              </div>
              <div>
                <label style={lbl}>Contact Person *</label>
                <input style={inp} value={form.contact_name} onChange={e=>set('contact_name',e.target.value)} placeholder="Full name" />
              </div>
              <div>
                <label style={lbl}>Phone *</label>
                <input style={inp} value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="10-digit number" />
              </div>
              <div>
                <label style={lbl}>Email *</label>
                <input style={inp} type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="merchant@example.com" />
              </div>
              <div>
                <label style={lbl}>Restaurant Type</label>
                <select style={inp} value={form.restaurant_type} onChange={e=>set('restaurant_type',e.target.value)}>
                  {RESTAURANT_TYPES.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display:'flex', justifyContent:'flex-end', marginTop:'20px' }}>
              <button
                disabled={!canStep1}
                onClick={() => setStep(2)}
                style={{ background: canStep1?'#111827':'#e5e7eb', color: canStep1?'#fff':'#9ca3af', border:'none', borderRadius:'8px', padding:'9px 20px', fontSize:'13px', fontWeight:500, cursor: canStep1?'pointer':'not-allowed' }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ fontSize:'16px', fontWeight:700, color:'#111827', marginBottom:'20px' }}>Existing Platform Association?</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'16px' }}>
              {[
                { val:'existing', title:'Yes — Existing Restaurant ID', desc:'Restaurant already has a platform ID' },
                { val:'fresh', title:'No — Fresh Listing Required', desc:'New restaurant, needs listing creation' },
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => set('listing_type', opt.val)}
                  style={{ padding:'16px', borderRadius:'10px', border:`2px solid ${form.listing_type===opt.val?'#111827':'#e5e7eb'}`, background: form.listing_type===opt.val?'#f9fafb':'#fff', textAlign:'left', cursor:'pointer' }}
                >
                  <div style={{ fontSize:'13px', fontWeight:600, color:'#111827' }}>{opt.title}</div>
                  <div style={{ fontSize:'12px', color:'#6b7280', marginTop:'4px' }}>{opt.desc}</div>
                </button>
              ))}
            </div>

            {form.listing_type === 'existing' && (
              <div style={{ background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:'10px', padding:'16px', marginBottom:'16px' }}>
                <label style={lbl}>Restaurant ID</label>
                <input style={inp} value={form.restaurant_id} onChange={e=>set('restaurant_id',e.target.value)} placeholder="e.g. DEMO-10001" />
                {form.restaurant_id && (
                  <div style={{ fontSize:'12px', color:'#15803d', marginTop:'8px', fontWeight:500 }}>✓ Existing Restaurant ID detected. Fresh listing creation is not required.</div>
                )}
              </div>
            )}

            {form.listing_type === 'fresh' && (
              <div style={{ background:'#faf5ff', border:'1px solid #e9d5ff', borderRadius:'10px', padding:'14px', marginBottom:'16px' }}>
                <div style={{ fontSize:'13px', fontWeight:600, color:'#7e22ce', marginBottom:'6px' }}>Fresh listing tasks will be added automatically:</div>
                <ul style={{ fontSize:'12px', color:'#6d28d9', margin:0, paddingLeft:'18px', lineHeight:1.8 }}>
                  <li>Create Restaurant Listing</li>
                  <li>Generate Restaurant ID</li>
                  <li>GST Mapping, KYC, Documents</li>
                </ul>
              </div>
            )}

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'8px' }}>
              <button onClick={()=>setStep(1)} style={{ fontSize:'13px', color:'#6b7280', background:'none', border:'none', cursor:'pointer', padding:'8px 0' }}>← Back</button>
              <button
                disabled={!canSubmit}
                onClick={handleSubmit}
                style={{ background: canSubmit?'#111827':'#e5e7eb', color: canSubmit?'#fff':'#9ca3af', border:'none', borderRadius:'8px', padding:'9px 20px', fontSize:'13px', fontWeight:500, cursor: canSubmit?'pointer':'not-allowed' }}
              >
                Create Merchant Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
