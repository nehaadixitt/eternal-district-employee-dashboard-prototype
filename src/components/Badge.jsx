const variants = {
  completed:    { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  in_progress:  { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  pending:      { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  not_started:  { bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb' },
  blocked:      { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
  live:         { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  signed:       { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  awaiting:     { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  sent:         { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  not_sent:     { bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb' },
  raised:       { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  not_raised:   { bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb' },
  rejected:     { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
  correction:   { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  account:      { bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb' },
  restaurant_id:{ bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  documents:    { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  contract:     { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  signature:    { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  sales_closure:{ bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  commercial:   { bg: '#faf5ff', color: '#7e22ce', border: '#e9d5ff' },
}

const labels = {
  completed: 'Completed', in_progress: 'In Progress', pending: 'Pending',
  not_started: 'Not Started', blocked: 'Blocked', live: 'Live',
  signed: 'Signed', awaiting: 'Awaiting Signature', sent: 'Sent',
  not_sent: 'Not Sent', raised: 'Raised', not_raised: 'Not Raised',
  rejected: 'Rejected', correction: 'Requires Correction',
  account: 'Account', restaurant_id: 'Restaurant ID', documents: 'GST & Docs',
  contract: 'Contract', signature: 'Signature', sales_closure: 'Sales Closure',
  commercial: 'Commercial',
}

export default function Badge({ status, label }) {
  const v = variants[status] || variants.not_started
  const text = label || labels[status] || status
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontSize: '11px', fontWeight: 600,
      padding: '2px 8px', borderRadius: '999px',
      background: v.bg, color: v.color,
      border: `1px solid ${v.border}`,
      whiteSpace: 'nowrap',
    }}>
      {text}
    </span>
  )
}
