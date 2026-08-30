import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://azgfgeandoenpuiiavhb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6Z2ZnZWFuZG9lbnB1aWlhdmhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5OTEyNDQsImV4cCI6MjEwMzU2NzI0NH0.IyYtEeX2f-AqjEMCjB70XAzuHWS0IwA2QQo-N-XKF4g'
)

const MERCHANTS = [
  {
    restaurant_name: 'Retro Cafe', legal_entity: 'Retro Hospitality Pvt Ltd',
    contact_name: 'Arjun Mehta', phone: '9800000001', email: 'arjun@retrocafe.demo',
    restaurant_type: 'Cafe', listing_type: 'existing', restaurant_id: 'DEMO-10001',
    overall_status: 'signature', created_at: '2024-08-28T09:00:00Z', updated_at: '2024-08-30T11:00:00Z',
    contract: { contract_id: 'CTR-0001', status: 'sent', raised_at: '2024-08-28T14:00:00Z', signed_at: null, last_reminder_at: '2024-08-29T10:00:00Z', reminder_count: 1 },
    signature: { status: 'awaiting', reminder_sent_at: '2024-08-29T10:00:00Z' },
    discount: { applicable: true, prebook_applicable: false, percentage: 20, duration_days: 30, start_date: '2024-09-01', end_date: '2024-10-01', notes: 'Merchant requested 30-day discount', form_status: 'pending', prebook_form_status: 'not_set' },
  },
  {
    restaurant_name: 'The Daily Grind', legal_entity: 'Daily Grind Foods LLP',
    contact_name: 'Sneha Kapoor', phone: '9800000002', email: 'sneha@dailygrind.demo',
    restaurant_type: 'Cafe', listing_type: 'fresh', restaurant_id: 'DEMO-10002',
    overall_status: 'restaurant_id', created_at: '2024-08-27T10:00:00Z', updated_at: '2024-08-27T15:00:00Z',
    contract: { contract_id: null, status: 'not_raised', raised_at: null, signed_at: null, last_reminder_at: null, reminder_count: 0 },
    signature: { status: 'not_sent', reminder_sent_at: null },
    discount: { applicable: false, prebook_applicable: false, percentage: null, duration_days: null, start_date: null, end_date: null, notes: '', form_status: 'not_required', prebook_form_status: 'not_set' },
  },
  {
    restaurant_name: 'Bistro 21', legal_entity: 'Bistro Twenty One Pvt Ltd',
    contact_name: 'Karan Verma', phone: '9800000003', email: 'karan@bistro21.demo',
    restaurant_type: 'Restaurant', listing_type: 'existing', restaurant_id: 'DEMO-10003',
    overall_status: 'sales_closure', created_at: '2024-08-25T08:00:00Z', updated_at: '2024-08-30T09:00:00Z',
    contract: { contract_id: 'CTR-0002', status: 'signed', raised_at: '2024-08-26T10:00:00Z', signed_at: '2024-08-30T09:00:00Z', last_reminder_at: null, reminder_count: 0 },
    signature: { status: 'signed', reminder_sent_at: null },
    discount: { applicable: true, prebook_applicable: false, percentage: 15, duration_days: 14, start_date: '2024-09-01', end_date: '2024-09-15', notes: '', form_status: 'pending', prebook_form_status: 'not_set' },
  },
  {
    restaurant_name: 'Cafe Roma', legal_entity: 'Roma Eats Pvt Ltd',
    contact_name: 'Divya Nair', phone: '9800000004', email: 'divya@caferoma.demo',
    restaurant_type: 'Cafe', listing_type: 'fresh', restaurant_id: 'DEMO-10004',
    overall_status: 'documents', created_at: '2024-08-29T11:00:00Z', updated_at: '2024-08-29T14:00:00Z',
    contract: { contract_id: null, status: 'not_raised', raised_at: null, signed_at: null, last_reminder_at: null, reminder_count: 0 },
    signature: { status: 'not_sent', reminder_sent_at: null },
    discount: { applicable: null, prebook_applicable: null, percentage: null, duration_days: null, start_date: null, end_date: null, notes: '', form_status: 'not_set', prebook_form_status: 'not_set' },
  },
  {
    restaurant_name: 'The Courtyard', legal_entity: 'Courtyard Dining Pvt Ltd',
    contact_name: 'Amit Sharma', phone: '9800000005', email: 'amit@courtyard.demo',
    restaurant_type: 'Restaurant', listing_type: 'existing', restaurant_id: 'DEMO-10005',
    overall_status: 'commercial', created_at: '2024-08-20T09:00:00Z', updated_at: '2024-08-31T10:00:00Z',
    contract: { contract_id: 'CTR-0003', status: 'signed', raised_at: '2024-08-22T10:00:00Z', signed_at: '2024-08-25T14:00:00Z', last_reminder_at: null, reminder_count: 0 },
    signature: { status: 'signed', reminder_sent_at: null },
    discount: { applicable: true, prebook_applicable: false, percentage: 25, duration_days: 7, start_date: '2024-09-01', end_date: '2024-09-08', notes: 'Launch week offer', form_status: 'completed', prebook_form_status: 'not_set' },
  },
  {
    restaurant_name: 'Urban Bean', legal_entity: 'Urban Bean Coffee Co',
    contact_name: 'Neha Joshi', phone: '9800000006', email: 'neha@urbanbean.demo',
    restaurant_type: 'Cafe', listing_type: 'existing', restaurant_id: 'DEMO-10006',
    overall_status: 'live', created_at: '2024-08-10T09:00:00Z', updated_at: '2024-08-20T12:00:00Z',
    contract: { contract_id: 'CTR-0004', status: 'signed', raised_at: '2024-08-12T10:00:00Z', signed_at: '2024-08-15T14:00:00Z', last_reminder_at: null, reminder_count: 0 },
    signature: { status: 'signed', reminder_sent_at: null },
    discount: { applicable: false, prebook_applicable: false, percentage: null, duration_days: null, start_date: null, end_date: null, notes: '', form_status: 'not_required', prebook_form_status: 'not_set' },
  },
]

const TASKS = {
  'DEMO-10001': [
    { type:'gst_mapping', name:'GST Mapping', stage:'documents', status:'completed', required:true, owner:'Sales', due_date:null, completed_at:'2024-08-28T12:00:00Z', external_url:'gst', notes:'' },
    { type:'kyc', name:'KYC', stage:'documents', status:'completed', required:true, owner:'Sales', due_date:null, completed_at:'2024-08-28T13:00:00Z', external_url:'kyc', notes:'' },
    { type:'raise_contract', name:'Raise Contract', stage:'contract', status:'completed', required:true, owner:'Sales', due_date:null, completed_at:'2024-08-28T14:00:00Z', external_url:'contract', notes:'' },
    { type:'merchant_signature', name:'Await Merchant Signature', stage:'signature', status:'in_progress', required:true, owner:'Merchant', due_date:'2024-09-05', completed_at:null, external_url:null, notes:'Merchant has not signed contract yet' },
    { type:'sales_closure_form', name:'Sales Closure Form', stage:'sales_closure', status:'not_started', required:true, owner:'Sales', due_date:null, completed_at:null, external_url:'sales_closure', notes:'' },
    { type:'discount_form', name:'Discount Form', stage:'commercial', status:'not_started', required:true, owner:'Sales', due_date:null, completed_at:null, external_url:'walkin_discount', notes:'' },
  ],
  'DEMO-10002': [
    { type:'create_listing', name:'Create Restaurant Listing', stage:'restaurant_id', status:'completed', required:true, owner:'Sales', due_date:null, completed_at:'2024-08-27T11:00:00Z', external_url:'listing', notes:'' },
    { type:'generate_id', name:'Generate Restaurant ID', stage:'restaurant_id', status:'completed', required:true, owner:'Sales', due_date:null, completed_at:'2024-08-27T12:00:00Z', external_url:'listing', notes:'' },
    { type:'gst_mapping', name:'GST Mapping', stage:'documents', status:'pending', required:true, owner:'Sales', due_date:null, completed_at:null, external_url:'gst', notes:'' },
    { type:'kyc', name:'KYC', stage:'documents', status:'not_started', required:true, owner:'Sales', due_date:null, completed_at:null, external_url:'kyc', notes:'' },
    { type:'raise_contract', name:'Raise Contract', stage:'contract', status:'not_started', required:true, owner:'Sales', due_date:null, completed_at:null, external_url:'contract', notes:'' },
    { type:'merchant_signature', name:'Await Merchant Signature', stage:'signature', status:'not_started', required:true, owner:'Merchant', due_date:null, completed_at:null, external_url:null, notes:'' },
    { type:'sales_closure_form', name:'Sales Closure Form', stage:'sales_closure', status:'not_started', required:true, owner:'Sales', due_date:null, completed_at:null, external_url:'sales_closure', notes:'' },
  ],
  'DEMO-10003': [
    { type:'gst_mapping', name:'GST Mapping', stage:'documents', status:'completed', required:true, owner:'Sales', due_date:null, completed_at:'2024-08-25T12:00:00Z', external_url:'gst', notes:'' },
    { type:'kyc', name:'KYC', stage:'documents', status:'completed', required:true, owner:'Sales', due_date:null, completed_at:'2024-08-25T13:00:00Z', external_url:'kyc', notes:'' },
    { type:'raise_contract', name:'Raise Contract', stage:'contract', status:'completed', required:true, owner:'Sales', due_date:null, completed_at:'2024-08-26T10:00:00Z', external_url:'contract', notes:'' },
    { type:'merchant_signature', name:'Await Merchant Signature', stage:'signature', status:'completed', required:true, owner:'Merchant', due_date:null, completed_at:'2024-08-30T09:00:00Z', external_url:null, notes:'' },
    { type:'sales_closure_form', name:'Sales Closure Form', stage:'sales_closure', status:'in_progress', required:true, owner:'Sales', due_date:'2024-09-02', completed_at:null, external_url:'sales_closure', notes:'' },
  ],
  'DEMO-10004': [
    { type:'create_listing', name:'Create Restaurant Listing', stage:'restaurant_id', status:'completed', required:true, owner:'Sales', due_date:null, completed_at:'2024-08-29T12:00:00Z', external_url:'listing', notes:'' },
    { type:'generate_id', name:'Generate Restaurant ID', stage:'restaurant_id', status:'completed', required:true, owner:'Sales', due_date:null, completed_at:'2024-08-29T13:00:00Z', external_url:'listing', notes:'' },
    { type:'gst_mapping', name:'GST Mapping', stage:'documents', status:'pending', required:true, owner:'Sales', due_date:null, completed_at:null, external_url:'gst', notes:'Waiting for GST certificate from merchant' },
    { type:'kyc', name:'KYC', stage:'documents', status:'completed', required:true, owner:'Sales', due_date:null, completed_at:'2024-08-29T14:00:00Z', external_url:'kyc', notes:'' },
    { type:'raise_contract', name:'Raise Contract', stage:'contract', status:'not_started', required:true, owner:'Sales', due_date:null, completed_at:null, external_url:'contract', notes:'' },
    { type:'merchant_signature', name:'Await Merchant Signature', stage:'signature', status:'not_started', required:true, owner:'Merchant', due_date:null, completed_at:null, external_url:null, notes:'' },
    { type:'sales_closure_form', name:'Sales Closure Form', stage:'sales_closure', status:'not_started', required:true, owner:'Sales', due_date:null, completed_at:null, external_url:'sales_closure', notes:'' },
  ],
  'DEMO-10005': [
    { type:'gst_mapping', name:'GST Mapping', stage:'documents', status:'completed', required:true, owner:'Sales', due_date:null, completed_at:'2024-08-21T10:00:00Z', external_url:'gst', notes:'' },
    { type:'kyc', name:'KYC', stage:'documents', status:'completed', required:true, owner:'Sales', due_date:null, completed_at:'2024-08-21T11:00:00Z', external_url:'kyc', notes:'' },
    { type:'raise_contract', name:'Raise Contract', stage:'contract', status:'completed', required:true, owner:'Sales', due_date:null, completed_at:'2024-08-22T10:00:00Z', external_url:'contract', notes:'' },
    { type:'merchant_signature', name:'Await Merchant Signature', stage:'signature', status:'completed', required:true, owner:'Merchant', due_date:null, completed_at:'2024-08-25T14:00:00Z', external_url:null, notes:'' },
    { type:'sales_closure_form', name:'Sales Closure Form', stage:'sales_closure', status:'completed', required:true, owner:'Sales', due_date:null, completed_at:'2024-08-28T10:00:00Z', external_url:'sales_closure', notes:'' },
    { type:'go_live', name:'Mark Account Live', stage:'live', status:'pending', required:true, owner:'Manager', due_date:'2024-09-01', completed_at:null, external_url:null, notes:'Ready for go-live approval' },
  ],
  'DEMO-10006': [
    { type:'gst_mapping', name:'GST Mapping', stage:'documents', status:'completed', required:true, owner:'Sales', due_date:null, completed_at:'2024-08-11T10:00:00Z', external_url:'gst', notes:'' },
    { type:'kyc', name:'KYC', stage:'documents', status:'completed', required:true, owner:'Sales', due_date:null, completed_at:'2024-08-11T11:00:00Z', external_url:'kyc', notes:'' },
    { type:'raise_contract', name:'Raise Contract', stage:'contract', status:'completed', required:true, owner:'Sales', due_date:null, completed_at:'2024-08-12T10:00:00Z', external_url:'contract', notes:'' },
    { type:'merchant_signature', name:'Await Merchant Signature', stage:'signature', status:'completed', required:true, owner:'Merchant', due_date:null, completed_at:'2024-08-15T14:00:00Z', external_url:null, notes:'' },
    { type:'sales_closure_form', name:'Sales Closure Form', stage:'sales_closure', status:'completed', required:true, owner:'Sales', due_date:null, completed_at:'2024-08-18T10:00:00Z', external_url:'sales_closure', notes:'' },
    { type:'go_live', name:'Mark Account Live', stage:'live', status:'completed', required:true, owner:'Manager', due_date:null, completed_at:'2024-08-20T12:00:00Z', external_url:null, notes:'' },
  ],
}

const DOCS = {
  'DEMO-10001': [{ type:'GST Certificate', required:'yes', status:'completed' }, { type:'Owner PAN', required:'yes', status:'completed' }, { type:'Company PAN', required:'conditional', status:'completed' }, { type:'KYC Form', required:'yes', status:'completed' }],
  'DEMO-10002': [{ type:'GST Certificate', required:'yes', status:'pending' }, { type:'Owner PAN', required:'yes', status:'pending' }, { type:'Company PAN', required:'conditional', status:'pending' }, { type:'KYC Form', required:'yes', status:'pending' }],
  'DEMO-10003': [{ type:'GST Certificate', required:'yes', status:'completed' }, { type:'Owner PAN', required:'yes', status:'completed' }, { type:'Company PAN', required:'conditional', status:'completed' }, { type:'KYC Form', required:'yes', status:'completed' }],
  'DEMO-10004': [{ type:'GST Certificate', required:'yes', status:'pending' }, { type:'Owner PAN', required:'yes', status:'completed' }, { type:'Company PAN', required:'conditional', status:'pending' }, { type:'KYC Form', required:'yes', status:'completed' }],
  'DEMO-10005': [{ type:'GST Certificate', required:'yes', status:'completed' }, { type:'Owner PAN', required:'yes', status:'completed' }, { type:'Company PAN', required:'conditional', status:'completed' }, { type:'KYC Form', required:'yes', status:'completed' }],
  'DEMO-10006': [{ type:'GST Certificate', required:'yes', status:'completed' }, { type:'Owner PAN', required:'yes', status:'completed' }, { type:'Company PAN', required:'conditional', status:'completed' }, { type:'KYC Form', required:'yes', status:'completed' }],
}

async function seed() {
  console.log('Seeding merchants...')

  for (const m of MERCHANTS) {
    const { data: inserted, error } = await supabase.from('merchants').insert(m).select().single()
    if (error) { console.error('Merchant insert error:', error.message); continue }

    const id = inserted.id
    const rid = m.restaurant_id

    const tasks = (TASKS[rid] || []).map((t, i) => ({ ...t, id: `${id}_t${i}`, merchant_id: id }))
    const docs = (DOCS[rid] || []).map(d => ({ ...d, merchant_id: id }))
    const activity = [{ id: `${id}_a1`, merchant_id: id, action: 'Account Created', description: 'Merchant account created', user: 'Priya S', timestamp: m.created_at }]

    if (rid === 'DEMO-10001') {
      activity.push(
        { id: `${id}_a2`, merchant_id: id, action: 'Restaurant ID Added', description: 'Existing Restaurant ID DEMO-10001 added', user: 'Priya S', timestamp: '2024-08-28T09:15:00Z' },
        { id: `${id}_a3`, merchant_id: id, action: 'GST Marked Complete', description: 'GST mapping completed', user: 'Priya S', timestamp: '2024-08-28T12:00:00Z' },
        { id: `${id}_a4`, merchant_id: id, action: 'Contract Raised', description: 'Contract CTR-0001 raised', user: 'Priya S', timestamp: '2024-08-28T14:00:00Z' },
        { id: `${id}_a5`, merchant_id: id, action: 'Contract Sent', description: 'Contract sent to merchant', user: 'Priya S', timestamp: '2024-08-29T10:00:00Z' },
      )
    }

    const comms = rid === 'DEMO-10001' ? [{ id: `${id}_c1`, merchant_id: id, timestamp: '2024-08-29T10:00:00Z', channels: ['Email', 'SMS'], purpose: 'Contract Signature Reminder', reminder_number: 1, triggered_by: 'Priya S', status: 'sent_demo' }] : []

    await Promise.all([
      tasks.length ? supabase.from('tasks').insert(tasks) : Promise.resolve(),
      docs.length ? supabase.from('documents').insert(docs) : Promise.resolve(),
      supabase.from('activity').insert(activity),
      comms.length ? supabase.from('comms_history').insert(comms) : Promise.resolve(),
    ])

    console.log(`✓ ${m.restaurant_name}`)
  }

  console.log('Done!')
}

seed()
