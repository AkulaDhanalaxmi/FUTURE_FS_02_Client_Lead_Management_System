import { Link } from 'react-router-dom'
import { PlusCircle, RefreshCw, FileText, Layers } from 'lucide-react'
import { formatTimeAgo, ACTION_LABELS } from '../../utils/helpers'
import LoadingSpinner from '../common/LoadingSpinner'

const ACTION_ICONS = {
  created: PlusCircle,
  status_changed: RefreshCw,
  note_added: FileText,
  bulk_status_update: Layers,
}

const ACTION_COLORS = {
  created: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  status_changed: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  note_added: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  bulk_status_update: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
}

export default function RecentActivity({ activities = [], loading }) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
          <p className="text-xs text-slate-400 mt-0.5">Latest actions in your CRM</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><LoadingSpinner /></div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-400 text-sm">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.slice(0, 8).map((activity, idx) => {
            const Icon = ACTION_ICONS[activity.action] || RefreshCw
            const colorClass = ACTION_COLORS[activity.action] || ACTION_COLORS.status_changed
            return (
              <div key={idx} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <Link to={`/leads/${activity.leadId}`} className="font-medium text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400">
                      {activity.leadName}
                    </Link>
                    {' — '}
                    <span className="text-slate-500 dark:text-slate-400">{ACTION_LABELS[activity.action] || activity.action}</span>
                  </p>
                  {activity.description && (
                    <p className="text-xs text-slate-400 truncate">{activity.description}</p>
                  )}
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">{formatTimeAgo(activity.timestamp)}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
