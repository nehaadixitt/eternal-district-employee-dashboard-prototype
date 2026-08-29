import { createContext, useContext, useState } from 'react'
import { DEMO_MERCHANTS } from '../data/merchants'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [merchants, setMerchants] = useState(DEMO_MERCHANTS)
  const [currentUser] = useState({ name: 'Priya S', role: 'sales' })

  function getMerchant(id) {
    return merchants.find(m => m.id === id)
  }

  function updateMerchant(id, updates) {
    setMerchants(prev => prev.map(m => m.id === id ? { ...m, ...updates, updated_at: new Date().toISOString() } : m))
  }

  function updateTask(merchantId, taskId, updates) {
    setMerchants(prev => prev.map(m => {
      if (m.id !== merchantId) return m
      const tasks = m.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
      return { ...m, tasks, updated_at: new Date().toISOString() }
    }))
  }

  function updateDocument(merchantId, docType, status) {
    setMerchants(prev => prev.map(m => {
      if (m.id !== merchantId) return m
      const documents = m.documents.map(d => d.type === docType ? { ...d, status } : d)
      return { ...m, documents, updated_at: new Date().toISOString() }
    }))
  }

  function addNote(merchantId, text) {
    const note = {
      id: `n${Date.now()}`,
      text,
      author: currentUser.name,
      timestamp: new Date().toISOString(),
    }
    setMerchants(prev => prev.map(m => {
      if (m.id !== merchantId) return m
      return { ...m, notes: [note, ...m.notes] }
    }))
  }

  function addActivity(merchantId, action, description) {
    const entry = {
      id: `a${Date.now()}`,
      action,
      description,
      user: currentUser.name,
      timestamp: new Date().toISOString(),
    }
    setMerchants(prev => prev.map(m => {
      if (m.id !== merchantId) return m
      return { ...m, activity: [...m.activity, entry] }
    }))
  }

  // Simulates sending a contract reminder (demo mode — no real messages sent)
  function sendReminder(merchantId, channels) {
    const now = new Date().toISOString()
    setMerchants(prev => prev.map(m => {
      if (m.id !== merchantId) return m
      const reminderCount = (m.contract.reminder_count || 0) + 1
      const commsEntry = {
        id: `c${Date.now()}`,
        timestamp: now,
        channels,
        purpose: 'Contract Signature Reminder',
        reminder_number: reminderCount,
        triggered_by: currentUser.name,
        status: 'sent_demo',
      }
      const activityEntry = {
        id: `a${Date.now()}`,
        action: 'Contract Reminder Sent',
        description: `Reminder #${reminderCount} sent via ${channels.join(' + ')} (Demo Mode)`,
        user: currentUser.name,
        timestamp: now,
      }
      return {
        ...m,
        updated_at: now,
        contract: {
          ...m.contract,
          last_reminder_at: now,
          reminder_count: reminderCount,
        },
        comms_history: [...(m.comms_history || []), commsEntry],
        activity: [...m.activity, activityEntry],
      }
    }))
  }

  function addMerchant(data) {
    const id = String(Date.now())
    const restaurantId = data.listing_type === 'existing' ? data.restaurant_id : `DEMO-${10007 + merchants.length}`
    const baseTasks = [
      { id: 't_gst', type: 'gst_mapping', name: 'GST Mapping', stage: 'documents', status: 'not_started', required: true, owner: 'Sales', due_date: null, completed_at: null, external_url: 'gst', notes: '' },
      { id: 't_kyc', type: 'kyc', name: 'KYC', stage: 'documents', status: 'not_started', required: true, owner: 'Sales', due_date: null, completed_at: null, external_url: 'kyc', notes: '' },
      { id: 't_contract', type: 'raise_contract', name: 'Raise Contract', stage: 'contract', status: 'not_started', required: true, owner: 'Sales', due_date: null, completed_at: null, external_url: 'contract', notes: '' },
      { id: 't_sig', type: 'merchant_signature', name: 'Await Merchant Signature', stage: 'signature', status: 'not_started', required: true, owner: 'Merchant', due_date: null, completed_at: null, external_url: null, notes: '' },
      { id: 't_sc', type: 'sales_closure_form', name: 'Sales Closure Form', stage: 'sales_closure', status: 'not_started', required: true, owner: 'Sales', due_date: null, completed_at: null, external_url: 'sales_closure', notes: '' },
      { id: 't_live', type: 'go_live', name: 'Mark Account Live', stage: 'live', status: 'not_started', required: true, owner: 'Manager', due_date: null, completed_at: null, external_url: null, notes: '' },
    ]
    const freshTasks = data.listing_type === 'fresh' ? [
      { id: 't_listing', type: 'create_listing', name: 'Create Restaurant Listing', stage: 'restaurant_id', status: 'not_started', required: true, owner: 'Sales', due_date: null, completed_at: null, external_url: 'listing', notes: '' },
      { id: 't_genid', type: 'generate_id', name: 'Generate Restaurant ID', stage: 'restaurant_id', status: 'not_started', required: true, owner: 'Sales', due_date: null, completed_at: null, external_url: 'listing', notes: '' },
    ] : []
    const newMerchant = {
      id,
      restaurant_name: data.restaurant_name,
      legal_entity: data.legal_entity,
      contact_name: data.contact_name,
      phone: data.phone,
      email: data.email,
      restaurant_type: data.restaurant_type,
      listing_type: data.listing_type,
      restaurant_id: restaurantId,
      overall_status: 'account',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      contract: { contract_id: null, status: 'not_raised', raised_at: null, signed_at: null, last_reminder_at: null, reminder_count: 0 },
      signature: { status: 'not_sent', reminder_sent_at: null },
      discount: { applicable: null, prebook_applicable: null, percentage: null, duration_days: null, start_date: null, end_date: null, notes: '', form_status: 'not_set', prebook_form_status: 'not_set' },
      documents: [
        { type: 'GST Certificate', required: 'yes', status: 'pending' },
        { type: 'Owner PAN', required: 'yes', status: 'pending' },
        { type: 'Company PAN', required: 'conditional', status: 'pending' },
        { type: 'KYC Form', required: 'yes', status: 'pending' },
      ],
      tasks: [...freshTasks, ...baseTasks],
      notes: [],
      comms_history: [],
      activity: [{ id: 'a1', action: 'Account Created', description: 'Merchant account created', user: currentUser.name, timestamp: new Date().toISOString() }],
    }
    setMerchants(prev => [newMerchant, ...prev])
    return id
  }

  return (
    <AppContext.Provider value={{ merchants, currentUser, getMerchant, updateMerchant, updateTask, updateDocument, addNote, addActivity, addMerchant, sendReminder }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
