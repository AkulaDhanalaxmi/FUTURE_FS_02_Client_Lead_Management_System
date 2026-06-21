export const STATUS_CONFIG = {
  New: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', dot: 'bg-blue-500' },
  Contacted: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', dot: 'bg-yellow-500' },
  Qualified: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', dot: 'bg-purple-500' },
  Converted: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', dot: 'bg-green-500' },
  Lost: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-500' },
}

export const PRIORITY_CONFIG = {
  Low: { color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  Medium: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  High: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  Urgent: { color: 'bg-red-600 text-white' },
}

export const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost']
export const LEAD_SOURCES = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Social Media', 'Trade Show', 'Other']
export const LEAD_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent']

export const formatCurrency = (value) => {
  if (!value) return '$0'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

export const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const formatTimeAgo = (date) => {
  if (!date) return ''
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return formatDate(date)
}

export const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const ACTION_LABELS = {
  created: 'Lead created',
  status_changed: 'Status updated',
  note_added: 'Note added',
  bulk_status_update: 'Bulk update',
}
