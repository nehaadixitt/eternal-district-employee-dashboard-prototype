export const STAGES = [
  { id: 'account', label: 'Account' },
  { id: 'restaurant_id', label: 'Restaurant ID' },
  { id: 'documents', label: 'GST & Docs' },
  { id: 'contract', label: 'Contract' },
  { id: 'signature', label: 'Signature' },
  { id: 'sales_closure', label: 'Sales Closure' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'live', label: 'Live' },
]

export const STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  PENDING: 'pending',
  COMPLETED: 'completed',
  BLOCKED: 'blocked',
  AWAITING_EXTERNAL: 'awaiting_external',
  REJECTED: 'rejected',
  CORRECTION: 'correction_required',
}

export const STATUS_LABELS = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  pending: 'Pending',
  completed: 'Completed',
  blocked: 'Blocked',
  awaiting_external: 'Awaiting External',
  rejected: 'Rejected',
  correction_required: 'Correction Required',
}

export const CONTRACT_STATUS_LABELS = {
  not_raised: 'Not Raised',
  raised: 'Raised',
  sent: 'Sent to Merchant',
  signed: 'Signed',
  rejected: 'Rejected',
  correction: 'Requires Correction',
}

export const SIGNATURE_STATUS_LABELS = {
  not_sent: 'Not Sent',
  sent: 'Sent',
  awaiting: 'Awaiting Signature',
  signed: 'Signed',
  rejected: 'Rejected',
}

export const RESTAURANT_TYPES = ['Cafe', 'Restaurant', 'Cloud Kitchen', 'Bar & Restaurant', 'Other']

// Centralised external tool configuration
export const EXTERNAL_TOOLS = {
  gst: {
    key: 'gst',
    label: 'GST Information',
    description: 'Complete GST mapping for the merchant on the admin portal.',
    whenToUse: 'After merchant provides GST certificate. Required before contract.',
    owner: 'Sales',
    requiresMerchantId: true,
    baseUrl: 'https://admin.zomans.com/gst-information?merchant_id=',
    getUrl: (merchantId) => `https://admin.zomans.com/gst-information?merchant_id=${merchantId}`,
    type: 'External Portal',
  },
  contract: {
    key: 'contract',
    label: 'Contract Portal',
    description: 'Raise and manage merchant contracts via the admin contract portal.',
    whenToUse: 'After all documents are verified. Raise contract for merchant signature.',
    owner: 'Sales',
    requiresMerchantId: false,
    url: 'https://admin.zomans.com/dining-admin-dashboards/admin/contract/',
    getUrl: () => 'https://admin.zomans.com/dining-admin-dashboards/admin/contract/',
    type: 'External Portal',
  },
  walkin_discount: {
    key: 'walkin_discount',
    label: 'Walk-In Discount',
    description: 'Submit walk-in discount details via the Google Form.',
    whenToUse: 'After sales closure, if walk-in discount is applicable.',
    owner: 'Sales',
    requiresMerchantId: false,
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSf3_vwdpk7caE7XLijrXj60tPAeKz9CuOhHoSmFaVvEGCMeZw/viewform',
    getUrl: () => 'https://docs.google.com/forms/d/e/1FAIpQLSf3_vwdpk7caE7XLijrXj60tPAeKz9CuOhHoSmFaVvEGCMeZw/viewform',
    type: 'External Form',
  },
  prebook_discount: {
    key: 'prebook_discount',
    label: 'Pre-Book Discount',
    description: 'Submit pre-book discount details via the Google Form.',
    whenToUse: 'After sales closure, if pre-book discount is applicable.',
    owner: 'Sales',
    requiresMerchantId: false,
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSdOZuj-PEfbvXSn-Z2GT0ZHyUpYWIF9yfk7XHV7MWYxzNfJOw/viewform',
    getUrl: () => 'https://docs.google.com/forms/d/e/1FAIpQLSdOZuj-PEfbvXSn-Z2GT0ZHyUpYWIF9yfk7XHV7MWYxzNfJOw/viewform',
    type: 'External Form',
  },
  sales_closure: {
    key: 'sales_closure',
    label: 'Sales Closure',
    description: 'Complete the sales closure process after contract execution.',
    whenToUse: 'After merchant has signed the contract.',
    owner: 'Sales',
    requiresMerchantId: false,
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSfyBC2nDM-oJ0AEYp3sQc-zY9HtkoGXh2TlOSI2Wg3NvOOm1g/viewform',
    getUrl: () => 'https://docs.google.com/forms/d/e/1FAIpQLSfyBC2nDM-oJ0AEYp3sQc-zY9HtkoGXh2TlOSI2Wg3NvOOm1g/viewform',
    type: 'External Form',
  },
  listing: {
    key: 'listing',
    label: 'Listing Portal',
    description: 'Create a fresh restaurant listing on the platform.',
    whenToUse: 'For fresh listings only — before generating a Restaurant ID.',
    owner: 'Sales',
    requiresMerchantId: false,
    url: '#listing-portal',
    getUrl: () => '#listing-portal',
    type: 'External Portal',
  },
  kyc: {
    key: 'kyc',
    label: 'KYC Portal',
    description: 'Complete KYC verification for the merchant.',
    whenToUse: 'During document collection stage.',
    owner: 'Sales',
    requiresMerchantId: false,
    url: '#kyc-portal',
    getUrl: () => '#kyc-portal',
    type: 'External Portal',
  },
}

// Legacy alias for backward compat
export const EXTERNAL_LINKS = Object.fromEntries(
  Object.entries(EXTERNAL_TOOLS).map(([k, v]) => [k, { label: v.label, url: v.url || v.baseUrl || '#' }])
)
