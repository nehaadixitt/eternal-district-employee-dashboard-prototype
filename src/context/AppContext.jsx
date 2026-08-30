import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AppContext = createContext(null)

// Shape a flat DB row + related rows into the merchant object the UI expects
function shapeMerchant(row, tasks = [], documents = [], notes = [], activity = [], comms_history = []) {
  return {
    ...row,
    tasks,
    documents,
    notes,
    activity,
    comms_history,
  }
}

export function AppProvider({ children }) {
  const [merchants, setMerchants] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser] = useState({ name: 'Priya S', role: 'sales' })

  // ── Load all data on mount ──────────────────────────────────────────────
  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    const [
      { data: ms },
      { data: ts },
      { data: ds },
      { data: ns },
      { data: as },
      { data: cs },
    ] = await Promise.all([
      supabase.from('merchants').select('*').order('created_at', { ascending: false }),
      supabase.from('tasks').select('*'),
      supabase.from('documents').select('*'),
      supabase.from('notes').select('*').order('timestamp', { ascending: false }),
      supabase.from('activity').select('*').order('timestamp', { ascending: true }),
      supabase.from('comms_history').select('*').order('timestamp', { ascending: false }),
    ])

    const shaped = (ms || []).map(m => shapeMerchant(
      m,
      (ts || []).filter(t => t.merchant_id === m.id),
      (ds || []).filter(d => d.merchant_id === m.id),
      (ns || []).filter(n => n.merchant_id === m.id),
      (as || []).filter(a => a.merchant_id === m.id),
      (cs || []).filter(c => c.merchant_id === m.id),
    ))
    setMerchants(shaped)
    setLoading(false)
  }

  function getMerchant(id) {
    return merchants.find(m => m.id === id)
  }

  // ── Update merchant top-level fields ───────────────────────────────────
  async function updateMerchant(id, updates) {
    const now = new Date().toISOString()
    const { contract, signature, discount, ...rest } = updates
    const patch = { ...rest, updated_at: now }
    if (contract !== undefined) patch.contract = contract
    if (signature !== undefined) patch.signature = signature
    if (discount !== undefined) patch.discount = discount

    await supabase.from('merchants').update(patch).eq('id', id)

    setMerchants(prev => prev.map(m =>
      m.id === id ? { ...m, ...updates, updated_at: now } : m
    ))
  }

  // ── Update a task ───────────────────────────────────────────────────────
  async function updateTask(merchantId, taskId, updates) {
    await supabase.from('tasks').update(updates).eq('id', taskId).eq('merchant_id', merchantId)
    setMerchants(prev => prev.map(m => {
      if (m.id !== merchantId) return m
      return { ...m, tasks: m.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t), updated_at: new Date().toISOString() }
    }))
  }

  // ── Update a document ──────────────────────────────────────────────────
  async function updateDocument(merchantId, docType, status) {
    await supabase.from('documents').update({ status }).eq('merchant_id', merchantId).eq('type', docType)
    setMerchants(prev => prev.map(m => {
      if (m.id !== merchantId) return m
      return { ...m, documents: m.documents.map(d => d.type === docType ? { ...d, status } : d), updated_at: new Date().toISOString() }
    }))
  }

  // ── Add a note ─────────────────────────────────────────────────────────
  async function addNote(merchantId, text) {
    const note = { id: `n${Date.now()}`, merchant_id: merchantId, text, author: currentUser.name, timestamp: new Date().toISOString() }
    await supabase.from('notes').insert(note)
    setMerchants(prev => prev.map(m =>
      m.id === merchantId ? { ...m, notes: [note, ...m.notes] } : m
    ))
  }

  // ── Add activity ───────────────────────────────────────────────────────
  async function addActivity(merchantId, action, description) {
    const entry = { id: `a${Date.now()}`, merchant_id: merchantId, action, description, user: currentUser.name, timestamp: new Date().toISOString() }
    await supabase.from('activity').insert(entry)
    setMerchants(prev => prev.map(m =>
      m.id === merchantId ? { ...m, activity: [...m.activity, entry] } : m
    ))
  }

  // ── Send reminder (demo mode) ──────────────────────────────────────────
  async function sendReminder(merchantId, channels) {
    const now = new Date().toISOString()
    const merchant = getMerchant(merchantId)
    const reminderCount = (merchant.contract.reminder_count || 0) + 1

    const commsEntry = { id: `c${Date.now()}`, merchant_id: merchantId, timestamp: now, channels, purpose: 'Contract Signature Reminder', reminder_number: reminderCount, triggered_by: currentUser.name, status: 'sent_demo' }
    const activityEntry = { id: `a${Date.now()}`, merchant_id: merchantId, action: 'Contract Reminder Sent', description: `Reminder #${reminderCount} sent via ${channels.join(' + ')} (Demo Mode)`, user: currentUser.name, timestamp: now }
    const updatedContract = { ...merchant.contract, last_reminder_at: now, reminder_count: reminderCount }

    await Promise.all([
      supabase.from('comms_history').insert(commsEntry),
      supabase.from('activity').insert(activityEntry),
      supabase.from('merchants').update({ contract: updatedContract, updated_at: now }).eq('id', merchantId),
    ])

    setMerchants(prev => prev.map(m => {
      if (m.id !== merchantId) return m
      return { ...m, updated_at: now, contract: updatedContract, comms_history: [commsEntry, ...m.comms_history], activity: [...m.activity, activityEntry] }
    }))
  }

  // ── Add new merchant ───────────────────────────────────────────────────
  async function addMerchant(data) {
    const restaurantId = data.listing_type === 'existing' ? data.restaurant_id : `DEMO-${10007 + merchants.length}`
    const now = new Date().toISOString()

    const merchantRow = {
      restaurant_name: data.restaurant_name,
      legal_entity: data.legal_entity,
      contact_name: data.contact_name,
      phone: data.phone,
      email: data.email,
      restaurant_type: data.restaurant_type,
      listing_type: data.listing_type,
      restaurant_id: restaurantId,
      overall_status: 'account',
      created_at: now,
      updated_at: now,
      contract: { contract_id: null, status: 'not_raised', raised_at: null, signed_at: null, last_reminder_at: null, reminder_count: 0 },
      signature: { status: 'not_sent', reminder_sent_at: null },
      discount: { applicable: null, prebook_applicable: null, percentage: null, duration_days: null, start_date: null, end_date: null, notes: '', form_status: 'not_set', prebook_form_status: 'not_set' },
    }

    const { data: inserted } = await supabase.from('merchants').insert(merchantRow).select().single()
    const id = inserted.id

    const baseTasks = [
      { id: `${id}_gst`, merchant_id: id, type: 'gst_mapping', name: 'GST Mapping', stage: 'documents', status: 'not_started', required: true, owner: 'Sales', due_date: null, completed_at: null, external_url: 'gst', notes: '' },
      { id: `${id}_kyc`, merchant_id: id, type: 'kyc', name: 'KYC', stage: 'documents', status: 'not_started', required: true, owner: 'Sales', due_date: null, completed_at: null, external_url: 'kyc', notes: '' },
      { id: `${id}_contract`, merchant_id: id, type: 'raise_contract', name: 'Raise Contract', stage: 'contract', status: 'not_started', required: true, owner: 'Sales', due_date: null, completed_at: null, external_url: 'contract', notes: '' },
      { id: `${id}_sig`, merchant_id: id, type: 'merchant_signature', name: 'Await Merchant Signature', stage: 'signature', status: 'not_started', required: true, owner: 'Merchant', due_date: null, completed_at: null, external_url: null, notes: '' },
      { id: `${id}_sc`, merchant_id: id, type: 'sales_closure_form', name: 'Sales Closure Form', stage: 'sales_closure', status: 'not_started', required: true, owner: 'Sales', due_date: null, completed_at: null, external_url: 'sales_closure', notes: '' },
      { id: `${id}_live`, merchant_id: id, type: 'go_live', name: 'Mark Account Live', stage: 'live', status: 'not_started', required: true, owner: 'Manager', due_date: null, completed_at: null, external_url: null, notes: '' },
    ]
    const freshTasks = data.listing_type === 'fresh' ? [
      { id: `${id}_listing`, merchant_id: id, type: 'create_listing', name: 'Create Restaurant Listing', stage: 'restaurant_id', status: 'not_started', required: true, owner: 'Sales', due_date: null, completed_at: null, external_url: 'listing', notes: '' },
      { id: `${id}_genid`, merchant_id: id, type: 'generate_id', name: 'Generate Restaurant ID', stage: 'restaurant_id', status: 'not_started', required: true, owner: 'Sales', due_date: null, completed_at: null, external_url: 'listing', notes: '' },
    ] : []
    const docs = [
      { merchant_id: id, type: 'GST Certificate', required: 'yes', status: 'pending' },
      { merchant_id: id, type: 'Owner PAN', required: 'yes', status: 'pending' },
      { merchant_id: id, type: 'Company PAN', required: 'conditional', status: 'pending' },
      { merchant_id: id, type: 'KYC Form', required: 'yes', status: 'pending' },
    ]
    const firstActivity = [{ id: `a${Date.now()}`, merchant_id: id, action: 'Account Created', description: 'Merchant account created', user: currentUser.name, timestamp: now }]

    const allTasks = [...freshTasks, ...baseTasks]
    await Promise.all([
      supabase.from('tasks').insert(allTasks),
      supabase.from('documents').insert(docs),
      supabase.from('activity').insert(firstActivity),
    ])

    const newMerchant = shapeMerchant(inserted, allTasks, docs, [], firstActivity, [])
    setMerchants(prev => [newMerchant, ...prev])
    return id
  }

  return (
    <AppContext.Provider value={{ merchants, loading, currentUser, getMerchant, updateMerchant, updateTask, updateDocument, addNote, addActivity, addMerchant, sendReminder }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
