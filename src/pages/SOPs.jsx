import { ExternalLink } from 'lucide-react'
import { openExternalTool, Toast, useToast } from '../components/Toast'
import { EXTERNAL_TOOLS } from '../data/types'

const SECTIONS = [
  { title: 'Core Onboarding', tools: ['gst', 'contract'] },
  { title: 'Sales Closure', tools: ['sales_closure'] },
  { title: 'Discounts & Commercial', tools: ['walkin_discount', 'prebook_discount'] },
]

function ToolCard({ tool, showToast }) {
  return (
    <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'12px', padding:'20px', display:'flex', flexDirection:'column', gap:'12px' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'8px' }}>
        <div>
          <div style={{ fontSize:'14px', fontWeight:600, color:'#111827' }}>{tool.label}</div>
          <span style={{ fontSize:'10px', fontWeight:600, background:'#f3f4f6', color:'#6b7280', padding:'2px 6px', borderRadius:'4px', marginTop:'4px', display:'inline-block' }}>{tool.type}</span>
        </div>
        <span style={{ fontSize:'11px', fontWeight:600, background:'#eff6ff', color:'#1d4ed8', padding:'2px 8px', borderRadius:'999px', flexShrink:0 }}>{tool.owner}</span>
      </div>
      <p style={{ fontSize:'12px', color:'#6b7280', lineHeight:1.5, margin:0 }}>{tool.description}</p>
      <div style={{ background:'#f9fafb', borderRadius:'8px', padding:'10px 12px' }}>
        <div style={{ fontSize:'10px', fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'4px' }}>When to use</div>
        <div style={{ fontSize:'12px', color:'#374151' }}>{tool.whenToUse}</div>
      </div>
      <button
        onClick={() => openExternalTool(tool.getUrl(''), showToast)}
        style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', background:'#111827', color:'#fff', border:'none', borderRadius:'8px', padding:'9px 14px', fontSize:'12px', fontWeight:500, cursor:'pointer', marginTop:'auto' }}
      >
        <ExternalLink size={12} /> Open {tool.label} ↗
      </button>
    </div>
  )
}

export default function SOPs() {
  const { toast, showToast } = useToast()

  return (
    <div style={{ padding:'32px', maxWidth:'1000px', margin:'0 auto' }}>
      <Toast message={toast} onClose={() => {}} />
      <div style={{ marginBottom:'28px' }}>
        <h1 style={{ fontSize:'22px', fontWeight:700, color:'#111827', margin:0 }}>SOPs & Forms</h1>
        <p style={{ fontSize:'13px', color:'#6b7280', marginTop:'4px', marginBottom:0 }}>Access all onboarding tools and sales closure forms from one place.</p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'32px' }}>
        {SECTIONS.map(section => (
          <div key={section.title}>
            <div style={{ fontSize:'11px', fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'14px' }}>{section.title}</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'14px' }}>
              {section.tools.map(key => {
                const tool = EXTERNAL_TOOLS[key]
                if (!tool) return null
                return <ToolCard key={key} tool={tool} showToast={showToast} />
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
