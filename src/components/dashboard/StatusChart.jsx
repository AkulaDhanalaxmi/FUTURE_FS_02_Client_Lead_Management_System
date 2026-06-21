import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import LoadingSpinner from '../common/LoadingSpinner'

const COLORS = {
  New: '#3b82f6',
  Contacted: '#f59e0b',
  Qualified: '#8b5cf6',
  Converted: '#22c55e',
  Lost: '#ef4444',
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const { name, value, payload: p } = payload[0]
  return (
    <div className="card p-2.5 text-xs shadow-lg">
      <p className="font-medium text-slate-900 dark:text-white">{name}</p>
      <p className="text-slate-500 dark:text-slate-400">{value} leads · {p.percentage}%</p>
    </div>
  )
}

export default function StatusChart({ data = [], loading }) {
  if (loading) return <div className="card p-6 h-64 flex items-center justify-center"><LoadingSpinner /></div>

  const chartData = data.map(d => ({ name: d.status, value: d.count, percentage: d.percentage }))
  const total = data.reduce((sum, d) => sum + d.count, 0)

  return (
    <div className="card p-6">
      <div className="mb-4">
        <h3 className="font-semibold text-slate-900 dark:text-white">Status Distribution</h3>
        <p className="text-xs text-slate-400 mt-0.5">{total} total leads</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie data={chartData} cx={65} cy={65} innerRadius={45} outerRadius={65} dataKey="value" strokeWidth={2} stroke="transparent">
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {data.map(({ status, count, percentage }) => (
            <div key={status} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[status] }} />
                <span className="text-xs text-slate-600 dark:text-slate-400">{status}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-slate-900 dark:text-white">{count}</span>
                <span className="text-xs text-slate-400 ml-1">({percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
