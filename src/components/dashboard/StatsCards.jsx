import { Users, UserPlus, PhoneCall, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'

const STAT_CARDS = [
  { key: 'total', label: 'Total Leads', icon: Users, color: 'bg-blue-500', lightBg: 'bg-blue-50 dark:bg-blue-900/20', textColor: 'text-blue-600 dark:text-blue-400' },
  { key: 'new', label: 'New Leads', icon: UserPlus, color: 'bg-emerald-500', lightBg: 'bg-emerald-50 dark:bg-emerald-900/20', textColor: 'text-emerald-600 dark:text-emerald-400' },
  { key: 'contacted', label: 'Contacted', icon: PhoneCall, color: 'bg-amber-500', lightBg: 'bg-amber-50 dark:bg-amber-900/20', textColor: 'text-amber-600 dark:text-amber-400' },
  { key: 'converted', label: 'Converted', icon: TrendingUp, color: 'bg-violet-500', lightBg: 'bg-violet-50 dark:bg-violet-900/20', textColor: 'text-violet-600 dark:text-violet-400' },
]

function GrowthIndicator({ rate }) {
  if (rate > 0) return <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium"><TrendingUp size={12} />+{rate}%</span>
  if (rate < 0) return <span className="flex items-center gap-1 text-xs text-red-500 font-medium"><TrendingDown size={12} />{rate}%</span>
  return <span className="flex items-center gap-1 text-xs text-slate-400"><Minus size={12} />0%</span>
}

export default function StatsCards({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-5 flex items-center justify-center h-28">
            <LoadingSpinner />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STAT_CARDS.map(({ key, label, icon: Icon, lightBg, textColor }) => (
        <div key={key} className="card p-5 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl ${lightBg} flex items-center justify-center`}>
              <Icon size={20} className={textColor} />
            </div>
            {key === 'total' && <GrowthIndicator rate={stats?.growthRate ?? 0} />}
            {key === 'converted' && (
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                {stats?.conversionRate ?? 0}% rate
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mb-0.5">
            {stats?.[key] ?? 0}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        </div>
      ))}
    </div>
  )
}
