import { useState } from 'react'
import { Mail, MessageSquare, X, CheckCircle2, AlertCircle } from 'lucide-react'

export default function ReminderModal({ merchant, onSend, onClose }) {
  const [channels, setChannels] = useState({ Email: true, SMS: true })
  const [sending, setSending] = useState(false)
  const [sendStatus, setSendStatus] = useState(null) // null | 'sent' | 'failed'

  function toggleChannel(ch) {
    setChannels(c => ({ ...c, [ch]: !c[ch] }))
  }

  async function handleSend() {
    const selected = Object.entries(channels).filter(([, v]) => v).map(([k]) => k)
    if (!selected.length) return
    setSending(true)
    const status = await onSend(selected)
    setSendStatus(status)
    setSending(false)
  }

  const reminderNum = (merchant.contract.reminder_count || 0) + 1
  const msgPreview = `Hi ${merchant.contact_name}, this is a reminder to complete the digital signature for your onboarding contract with us. Please sign at your earliest convenience.`
  const disabled = (!channels.Email && !channels.SMS) || sending

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
      <div style={{ background:'#fff', borderRadius:'16px', width:'100%', maxWidth:'460px', boxShadow:'0 20px 60px rgba(0,0,0,0.15)', overflow:'hidden' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px', borderBottom:'1px solid #f3f4f6' }}>
          <div>
            <div style={{ fontSize:'15px', fontWeight:700, color:'#111827' }}>Send Contract Reminder</div>
            <div style={{ fontSize:'12px', color:'#9ca3af', marginTop:'2px' }}>Reminder #{reminderNum}</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af', padding:'4px' }}>
            <X size={18} />
          </button>
        </div>

        {sendStatus === null ? (
          <div style={{ padding:'24px' }}>
            {/* Recipient */}
            <div style={{ marginBottom:'18px' }}>
              <div style={{ fontSize:'11px', fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'10px' }}>Recipient</div>
              <div style={{ background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:'10px', padding:'14px 16px' }}>
                <div style={{ fontSize:'14px', fontWeight:600, color:'#111827', marginBottom:'8px' }}>{merchant.restaurant_name}</div>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
                  <Mail size={13} color="#6b7280" />
                  <span style={{ fontSize:'13px', color:'#374151' }}>{merchant.email}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <MessageSquare size={13} color="#6b7280" />
                  <span style={{ fontSize:'13px', color:'#374151' }}>+91 {merchant.phone}</span>
                </div>
              </div>
            </div>

            {/* Channels */}
            <div style={{ marginBottom:'18px' }}>
              <div style={{ fontSize:'11px', fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'10px' }}>Delivery Channels</div>
              <div style={{ display:'flex', gap:'10px' }}>
                {[{ key:'Email', icon:Mail }, { key:'SMS', icon:MessageSquare }].map(({ key, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => toggleChannel(key)}
                    style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 16px', borderRadius:'8px', border:`2px solid ${channels[key]?'#111827':'#e5e7eb'}`, background:channels[key]?'#111827':'#fff', color:channels[key]?'#fff':'#6b7280', cursor:'pointer', fontSize:'13px', fontWeight:500, flex:1, justifyContent:'center' }}
                  >
                    <Icon size={14} />
                    {key}
                    {channels[key] && <span style={{ fontSize:'11px' }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Message preview */}
            <div style={{ marginBottom:'24px' }}>
              <div style={{ fontSize:'11px', fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'8px' }}>Message Preview</div>
              <div style={{ background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:'8px', padding:'12px 14px', fontSize:'12px', color:'#374151', lineHeight:1.6, fontStyle:'italic' }}>
                "{msgPreview}"
              </div>
            </div>

            {/* Actions */}
            <div style={{ display:'flex', gap:'10px' }}>
              <button onClick={onClose} style={{ flex:1, padding:'10px', borderRadius:'8px', border:'1px solid #e5e7eb', background:'#fff', color:'#374151', fontSize:'13px', fontWeight:500, cursor:'pointer' }}>
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={disabled}
                style={{ flex:2, padding:'10px', borderRadius:'8px', border:'none', background:disabled?'#e5e7eb':'#111827', color:disabled?'#9ca3af':'#fff', fontSize:'13px', fontWeight:600, cursor:disabled?'not-allowed':'pointer' }}
              >
                {sending ? 'Sending…' : 'Send Reminder'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding:'32px 24px', textAlign:'center' }}>
            <div style={{ width:'48px', height:'48px', background:sendStatus==='sent'?'#f0fdf4':'#fef2f2', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              {sendStatus === 'sent'
                ? <CheckCircle2 size={24} color="#15803d" />
                : <AlertCircle size={24} color="#dc2626" />}
            </div>
            <div style={{ fontSize:'15px', fontWeight:700, color:'#111827', marginBottom:'6px' }}>
              {sendStatus === 'sent' ? 'Reminder sent successfully' : 'Email delivery failed'}
            </div>
            <div style={{ fontSize:'13px', color:'#6b7280', marginBottom:'4px' }}>
              {Object.entries(channels).filter(([,v])=>v).map(([k])=>k).join(' + ')} · {new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
            </div>
            <div style={{ fontSize:'12px', color:'#9ca3af', marginBottom:'24px' }}>
              {sendStatus === 'sent' ? 'Recorded in activity timeline' : 'Recorded as failed in activity timeline'}
            </div>
            <button onClick={onClose} style={{ padding:'9px 24px', borderRadius:'8px', border:'none', background:'#111827', color:'#fff', fontSize:'13px', fontWeight:500, cursor:'pointer' }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
