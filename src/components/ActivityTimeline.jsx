import { useState } from 'react'
import { Send } from 'lucide-react'

export function ActivityTimeline({ activity }) {
  const sorted = [...activity].sort((a,b) => new Date(b.timestamp)-new Date(a.timestamp))
  return (
    <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'12px', padding:'20px' }}>
      <div style={{ fontSize:'12px', fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'16px' }}>Activity Timeline</div>
      <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
        {sorted.map((entry, i) => (
          <div key={entry.id} style={{ display:'flex', gap:'12px' }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
              <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#3b82f6', flexShrink:0, marginTop:'4px' }} />
              {i < sorted.length-1 && <div style={{ width:'1px', flex:1, background:'#f3f4f6', margin:'4px 0' }} />}
            </div>
            <div style={{ paddingBottom:'14px', minWidth:0 }}>
              <div style={{ fontSize:'13px', fontWeight:500, color:'#111827' }}>{entry.action}</div>
              <div style={{ fontSize:'12px', color:'#6b7280', marginTop:'1px' }}>{entry.description}</div>
              <div style={{ fontSize:'11px', color:'#9ca3af', marginTop:'2px' }}>{new Date(entry.timestamp).toLocaleString()} · {entry.user}</div>
            </div>
          </div>
        ))}
        {!sorted.length && <div style={{ fontSize:'13px', color:'#9ca3af' }}>No activity yet.</div>}
      </div>
    </div>
  )
}

export function NotesPanel({ notes, onAdd }) {
  const [text, setText] = useState('')

  function submit() {
    if (!text.trim()) return
    onAdd(text.trim())
    setText('')
  }

  return (
    <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'12px', padding:'20px' }}>
      <div style={{ fontSize:'12px', fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'14px' }}>Internal Notes</div>
      <div style={{ display:'flex', gap:'8px', marginBottom:'14px' }}>
        <input
          value={text}
          onChange={e=>setText(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&submit()}
          placeholder="Add a note…"
          style={{ flex:1, border:'1px solid #e5e7eb', borderRadius:'8px', padding:'8px 12px', fontSize:'13px', fontFamily:'inherit', color:'#111827', outline:'none' }}
        />
        <button onClick={submit} style={{ background:'#111827', color:'#fff', border:'none', borderRadius:'8px', padding:'8px 12px', cursor:'pointer', display:'flex', alignItems:'center' }}>
          <Send size={13} />
        </button>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
        {notes.map(n => (
          <div key={n.id} style={{ background:'#f9fafb', borderRadius:'8px', padding:'10px 12px' }}>
            <div style={{ fontSize:'13px', color:'#374151' }}>{n.text}</div>
            <div style={{ fontSize:'11px', color:'#9ca3af', marginTop:'4px' }}>{n.author} · {new Date(n.timestamp).toLocaleString()}</div>
          </div>
        ))}
        {!notes.length && <div style={{ fontSize:'13px', color:'#9ca3af' }}>No notes yet.</div>}
      </div>
    </div>
  )
}
