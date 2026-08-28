import { useEffect, useState } from 'react'
import { ExternalLink, X } from 'lucide-react'

export function useToast() {
  const [toast, setToast] = useState(null)
  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 4500)
  }
  return { toast, showToast }
}

export function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onClose, 4500)
    return () => clearTimeout(t)
  }, [message, onClose])

  if (!message) return null

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
      display: 'flex', alignItems: 'flex-start', gap: '12px',
      background: '#111827', color: '#ffffff',
      padding: '14px 16px', borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
      maxWidth: '360px', animation: 'slide-up 0.2s ease-out',
    }}>
      <ExternalLink size={15} color="#60a5fa" style={{ marginTop: '1px', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>Opening external tool</div>
        <div style={{ fontSize: '12px', color: '#9ca3af', lineHeight: 1.4 }}>{message}</div>
      </div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '0', flexShrink: 0 }}>
        <X size={14} />
      </button>
    </div>
  )
}

export function openExternalTool(url, showToast) {
  if (showToast) {
    showToast('Complete the required action there, then return to MerchantFlow to update the task.')
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}
