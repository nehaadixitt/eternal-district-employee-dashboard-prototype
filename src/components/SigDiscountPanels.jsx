import { Bell } from 'lucide-react'
import { useState } from 'react'
import Badge from './Badge'
import { SIGNATURE_STATUS_LABELS } from '../data/types'

const SIG_STATUSES = ['not_sent', 'sent', 'awaiting', 'signed', 'rejected']

export function SignaturePanel({ merchant, onUpdate }) {
  const { signature } = merchant
  const [editing, setEditing] = useState(false)
  const [status, setStatus] = useState(signature.status)

  function save() {
    onUpdate({ signature: { ...signature, status } })
    setEditing(false)
  }

  function sendReminder() {
    onUpdate({ signature: { ...signature, reminder_sent_at: new Date().toISOString() } })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 text-sm">Merchant Signature</h3>
        <Badge status={signature.status} label={SIGNATURE_STATUS_LABELS[signature.status]} />
      </div>
      {signature.reminder_sent_at && (
        <p className="text-xs text-gray-400 mb-3">Last reminder: {new Date(signature.reminder_sent_at).toLocaleString()}</p>
      )}
      {editing ? (
        <div className="flex items-center gap-2">
          <select value={status} onChange={e => setStatus(e.target.value)} className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {SIG_STATUSES.map(s => <option key={s} value={s}>{SIGNATURE_STATUS_LABELS[s]}</option>)}
          </select>
          <button onClick={save} className="bg-blue-600 text-white text-xs px-3 py-2 rounded-lg">Save</button>
          <button onClick={() => setEditing(false)} className="text-xs text-gray-500 px-3 py-2">Cancel</button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button onClick={sendReminder} className="flex items-center gap-1 text-xs border border-amber-200 text-amber-600 hover:bg-amber-50 px-3 py-2 rounded-lg transition-colors">
            <Bell size={12} /> Send Reminder
          </button>
          <button onClick={() => setEditing(true)} className="text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
            Update Status
          </button>
        </div>
      )}
    </div>
  )
}

export function DiscountPanel({ merchant, onUpdate }) {
  const { discount } = merchant
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...discount })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function save() {
    onUpdate({ discount: form })
    setEditing(false)
  }

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 text-sm">Discount / Commercial</h3>
        {discount.applicable !== null && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${discount.applicable ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
            {discount.applicable ? 'Discount Applicable' : 'No Discount'}
          </span>
        )}
      </div>

      {!editing && (
        <div className="space-y-2 text-sm">
          {discount.applicable === null && <p className="text-gray-400 text-sm">Discount applicability not set.</p>}
          {discount.applicable && (
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-gray-400">Percentage</p><p className="font-semibold text-gray-800">{discount.percentage}%</p></div>
              <div><p className="text-xs text-gray-400">Duration</p><p className="font-semibold text-gray-800">{discount.duration_days} days</p></div>
              <div><p className="text-xs text-gray-400">Start Date</p><p className="font-semibold text-gray-800">{discount.start_date || '—'}</p></div>
              <div><p className="text-xs text-gray-400">End Date</p><p className="font-semibold text-gray-800">{discount.end_date || '—'}</p></div>
              {discount.notes && <div className="col-span-2"><p className="text-xs text-gray-400">Notes</p><p className="text-gray-700">{discount.notes}</p></div>}
            </div>
          )}
          <button onClick={() => setEditing(true)} className="text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors mt-2">
            {discount.applicable === null ? 'Set Discount' : 'Edit'}
          </button>
        </div>
      )}

      {editing && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Discount Applicable?</label>
            <div className="flex gap-2">
              {[true, false].map(v => (
                <button key={String(v)} onClick={() => set('applicable', v)}
                  className={`px-4 py-2 text-sm rounded-lg border-2 transition-all ${form.applicable === v ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'}`}>
                  {v ? 'Yes' : 'No'}
                </button>
              ))}
            </div>
          </div>
          {form.applicable && (
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Percentage (%)</label><input className={inputCls} type="number" value={form.percentage || ''} onChange={e => set('percentage', e.target.value)} /></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Duration (days)</label><input className={inputCls} type="number" value={form.duration_days || ''} onChange={e => set('duration_days', e.target.value)} /></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label><input className={inputCls} type="date" value={form.start_date || ''} onChange={e => set('start_date', e.target.value)} /></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">End Date</label><input className={inputCls} type="date" value={form.end_date || ''} onChange={e => set('end_date', e.target.value)} /></div>
              <div className="col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">Notes</label><input className={inputCls} value={form.notes || ''} onChange={e => set('notes', e.target.value)} /></div>
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <button onClick={save} className="bg-blue-600 text-white text-xs px-4 py-2 rounded-lg">Save</button>
            <button onClick={() => setEditing(false)} className="text-xs text-gray-500 px-3 py-2">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
