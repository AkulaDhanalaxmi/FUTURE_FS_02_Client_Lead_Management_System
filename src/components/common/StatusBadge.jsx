import { STATUS_CONFIG, PRIORITY_CONFIG } from '../../utils/helpers'

export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' }
  return (
    <span className={`badge gap-1.5 ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  const config = PRIORITY_CONFIG[priority] || { color: 'bg-slate-100 text-slate-600' }
  return (
    <span className={`badge ${config.color}`}>
      {priority}
    </span>
  )
}
