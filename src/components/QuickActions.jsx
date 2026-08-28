import { ExternalLink } from 'lucide-react'
import { openExternalTool } from './Toast'
import { EXTERNAL_TOOLS } from '../data/types'

const QUICK_TOOLS = ['gst','contract','walkin_discount','prebook_discount','sales_closure']

export default function QuickActions({ merchant, showToast }) {
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
      {QUICK_TOOLS.map(key => {
        const tool = EXTERNAL_TOOLS[key]
        if (!tool) return null
        const url = tool.getUrl(merchant.restaurant_id)
        return (
          <button
            key={key}
            onClick={() => openExternalTool(url, showToast)}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#111827'; e.currentTarget.style.color='#111827' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#e5e7eb'; e.currentTarget.style.color='#374151' }}
            style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', fontWeight:500, background:'#fff', color:'#374151', border:'1px solid #e5e7eb', borderRadius:'8px', padding:'7px 12px', cursor:'pointer' }}
          >
            {tool.label}
            <ExternalLink size={11} color="#9ca3af" />
          </button>
        )
      })}
    </div>
  )
}
