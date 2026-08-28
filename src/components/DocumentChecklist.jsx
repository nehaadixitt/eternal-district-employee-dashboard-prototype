import Badge from './Badge'

const REQ_LABELS = { yes:'Required', conditional:'Conditional', no:'Optional' }
const REQ_STYLE = {
  yes:         { background:'#fef2f2', color:'#b91c1c' },
  conditional: { background:'#fff7ed', color:'#c2410c' },
  no:          { background:'#f9fafb', color:'#6b7280' },
}

export default function DocumentChecklist({ documents, onUpdate }) {
  return (
    <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'12px', overflow:'hidden' }}>
      <div style={{ padding:'16px 20px', borderBottom:'1px solid #f3f4f6' }}>
        <div style={{ fontSize:'13px', fontWeight:600, color:'#111827' }}>Required Documents</div>
      </div>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr style={{ borderBottom:'1px solid #f3f4f6' }}>
            {['Document','Required','Status','Action'].map(h=>(
              <th key={h} style={{ textAlign:'left', fontSize:'11px', fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.05em', padding:'10px 20px' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {documents.map(doc => (
            <tr key={doc.type} style={{ borderBottom:'1px solid #f9fafb' }}>
              <td style={{ padding:'12px 20px', fontSize:'13px', fontWeight:500, color:'#374151' }}>{doc.type}</td>
              <td style={{ padding:'12px 20px' }}>
                <span style={{ fontSize:'11px', fontWeight:600, padding:'2px 7px', borderRadius:'4px', ...REQ_STYLE[doc.required] }}>
                  {REQ_LABELS[doc.required]}
                </span>
              </td>
              <td style={{ padding:'12px 20px' }}><Badge status={doc.status} /></td>
              <td style={{ padding:'12px 20px' }}>
                {doc.status === 'completed' ? (
                  <span style={{ fontSize:'12px', color:'#15803d', fontWeight:500 }}>✓ Received</span>
                ) : (
                  <button onClick={()=>onUpdate(doc.type,'completed')} style={{ fontSize:'11px', fontWeight:500, background:'#f0fdf4', color:'#15803d', border:'1px solid #bbf7d0', borderRadius:'6px', padding:'4px 10px', cursor:'pointer' }}>
                    Mark Received
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
