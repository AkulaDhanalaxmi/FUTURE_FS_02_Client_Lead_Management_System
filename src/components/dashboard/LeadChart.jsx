import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useTheme } from '../../context/ThemeContext'
import LoadingSpinner from '../common/LoadingSpinner'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card p-3 text-xs shadow-lg">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-slate-500 dark:text-slate-400 capitalize">{entry.name}:</span>
          <span className="font-medium text-slate-900 dark:text-white">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function LeadChart({ data = [], loading }) {
  const { isDark } = useTheme()
  const gridColor = isDark ? '#334155' : '#e2e8f0'
  const textColor = isDark ? '#94a3b8' : '#64748b'

  if (loading) return <div className="card p-6 h-64 flex items-center justify-center"><LoadingSpinner /></div>

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Lead Trend</h3>
          <p className="text-xs text-slate-400 mt-0.5">Last 6 months overview</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="convertedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
          <Area type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} fill="url(#leadsGrad)" name="Leads" dot={false} activeDot={{ r: 5 }} />
          <Area type="monotone" dataKey="converted" stroke="#22c55e" strokeWidth={2} fill="url(#convertedGrad)" name="Converted" dot={false} activeDot={{ r: 5 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
