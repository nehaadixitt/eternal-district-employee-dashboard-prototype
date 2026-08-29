import { Mail, MessageSquare } from 'lucide-react'

const channelIcon = { Email: Mail, SMS: MessageSquare }
const channelColor = { Email: '#1d4ed8', SMS: '#7e22ce' }
const channelBg = { Email: '#eff6ff', SMS: '#faf5ff' }

export default function CommunicationHistory({ comms }) {
  const sorted = [...(comms || [])].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  return (
    <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'12px', padding:'20px' }}>
      <div style={{ fontSize:'12px', fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'14px' }}>
        Communication History
      </div>

      {!sorted.length ? (
        <div style={{ fontSize:'13px', color:'#9ca3af' }}>No communications sent yet.</div>
      ) : (
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid #f3f4f6' }}>
                {['Date','Channel','Purpose','Reminder #','Sent By','Status'].map(h => (
                  <th key={h} style={{ textAlign:'left', fontSize:'10px', fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.05em', padding:'6px 10px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map(c => (
                <tr key={c.id} style={{ borderBottom:'1px solid #f9fafb' }}>
                  <td style={{ padding:'10px 10px', fontSize:'12px', color:'#374151', whiteSpace:'nowrap' }}>
                    {new Date(c.timestamp).toLocaleDateString()} {new Date(c.timestamp).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
                  </td>
                  <td style={{ padding:'10px 10px' }}>
                    <div style={{ display:'flex', gap:'4px', flexWrap:'wrap' }}>
                      {c.channels.map(ch => {
                        const Icon = channelIcon[ch] || Mail
                        return (
                          <span key={ch} style={{ display:'inline-flex', alignItems:'center', gap:'4px', fontSize:'11px', fontWeight:600, background: channelBg[ch] || '#f9fafb', color: channelColor[ch] || '#374151', padding:'2px 7px', borderRadius:'999px' }}>
                            <Icon size={10} /> {ch}
                          </span>
                        )
                      })}
                    </div>
                  </td>
                  <td style={{ padding:'10px 10px', fontSize:'12px', color:'#374151' }}>{c.purpose}</td>
                  <td style={{ padding:'10px 10px', fontSize:'12px', color:'#374151', textAlign:'center' }}>#{c.reminder_number}</td>
                  <td style={{ padding:'10px 10px', fontSize:'12px', color:'#6b7280' }}>{c.triggered_by}</td>
                  <td style={{ padding:'10px 10px' }}>
                    <span style={{ fontSize:'11px', fontWeight:600, background:'#fef3c7', color:'#92400e', padding:'2px 7px', borderRadius:'999px' }}>
                      Demo
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
