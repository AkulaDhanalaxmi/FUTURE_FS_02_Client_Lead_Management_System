import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus, Calendar, ArrowRight } from 'lucide-react'
import { dashboardService } from '../services/leadService'
import StatsCards from '../components/dashboard/StatsCards'
import LeadChart from '../components/dashboard/LeadChart'
import StatusChart from '../components/dashboard/StatusChart'
import RecentActivity from '../components/dashboard/RecentActivity'
import { StatusBadge } from '../components/common/StatusBadge'
import { formatDate, formatCurrency, getInitials } from '../utils/helpers'

export default function DashboardPage() {
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats().then(r => r.data.data),
    refetchInterval: 60000,
  })

  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['dashboard-activity'],
    queryFn: () => dashboardService.getActivity().then(r => r.data.data),
    refetchInterval: 60000,
  })

  const overview = statsData?.overview
  const recentLeads = statsData?.recentLeads || []
  const upcomingFollowUps = statsData?.upcomingFollowUps || []

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">Overview</p>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">CRM Dashboard</h1>
        </div>
        <Link to="/leads" className="btn-primary">
          <Plus size={16} />
          Add Lead
        </Link>
      </div>

      {/* Stat cards */}
      <StatsCards stats={overview} loading={statsLoading} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LeadChart data={statsData?.monthlyTrend || []} loading={statsLoading} />
        </div>
        <StatusChart data={statsData?.statusDistribution || []} loading={statsLoading} />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Recent Leads</h3>
              <p className="text-xs text-slate-400 mt-0.5">Latest additions to your pipeline</p>
            </div>
            <Link to="/leads" className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 font-medium">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {statsLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : recentLeads.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No leads yet. <Link to="/leads" className="text-primary-600 hover:underline">Add your first lead</Link></p>
          ) : (
            <div className="space-y-2">
              {recentLeads.map(lead => (
                <Link key={lead._id} to={`/leads/${lead._id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                  <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-400 text-xs font-semibold flex-shrink-0">
                    {getInitials(lead.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate">{lead.name}</p>
                    <p className="text-xs text-slate-400 truncate">{lead.company || lead.email}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={lead.status} />
                    <span className="text-xs text-slate-400 hidden sm:block">{formatDate(lead.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Follow-ups */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Calendar size={16} className="text-primary-600 dark:text-primary-400" />
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Follow-ups Due</h3>
              <p className="text-xs text-slate-400">Next 7 days</p>
            </div>
          </div>
          {statsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />)}
            </div>
          ) : upcomingFollowUps.length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={28} className="text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No follow-ups scheduled</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingFollowUps.map(lead => {
                const daysUntil = Math.ceil((new Date(lead.followUpDate) - new Date()) / (1000 * 60 * 60 * 24))
                return (
                  <Link key={lead._id} to={`/leads/${lead._id}`} className="block p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{lead.name}</p>
                        <p className="text-xs text-slate-400 truncate">{lead.company || lead.email}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        daysUntil <= 1 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                        : daysUntil <= 3 ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                        : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {daysUntil <= 0 ? 'Today' : `${daysUntil}d`}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{formatDate(lead.followUpDate)}</p>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Activity Feed */}
      <RecentActivity activities={activityData || []} loading={activityLoading} />
    </div>
  )
}
