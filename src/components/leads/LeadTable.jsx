import { Link } from 'react-router-dom'
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react'
import { StatusBadge, PriorityBadge } from '../common/StatusBadge'
import { formatDate, formatCurrency, getInitials } from '../../utils/helpers'
import LoadingSpinner from '../common/LoadingSpinner'

export default function LeadTable({ leads = [], loading, pagination, onEdit, onDelete, onPageChange }) {
  if (loading) {
    return (
      <div className="card p-12 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (leads.length === 0) {
    return (
      <div className="card p-16 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <ArrowUpDown size={24} className="text-slate-400" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">No leads found</h3>
        <p className="text-sm text-slate-400">Try adjusting your search or filters, or add a new lead.</p>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              {['Lead', 'Company', 'Status', 'Priority', 'Source', 'Value', 'Follow-up', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-400 text-xs font-semibold flex-shrink-0">
                      {getInitials(lead.name)}
                    </div>
                    <div className="min-w-0">
                      <Link
                        to={`/leads/${lead._id}`}
                        className="text-sm font-medium text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 truncate block"
                      >
                        {lead.name}
                      </Link>
                      <p className="text-xs text-slate-400 truncate">{lead.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                  {lead.company || <span className="text-slate-300 dark:text-slate-600">—</span>}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <PriorityBadge priority={lead.priority} />
                </td>
                <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{lead.source}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  {lead.value ? formatCurrency(lead.value) : <span className="text-slate-300 dark:text-slate-600">—</span>}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {lead.followUpDate ? (
                    <span className={new Date(lead.followUpDate) < new Date() ? 'text-red-500' : ''}>
                      {formatDate(lead.followUpDate)}
                    </span>
                  ) : <span className="text-slate-300 dark:text-slate-600">—</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to={`/leads/${lead._id}`} className="p-1.5 rounded-md text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                      <Eye size={15} />
                    </Link>
                    <button onClick={() => onEdit(lead)} className="p-1.5 rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => onDelete(lead)} className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400">
            Showing {((pagination.current - 1) * pagination.limit) + 1}–{Math.min(pagination.current * pagination.limit, pagination.total)} of {pagination.total} leads
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.current - 1)}
              disabled={pagination.current === 1}
              className="btn-secondary p-2 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-1">
              {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                let page = i + 1
                if (pagination.pages > 5) {
                  if (pagination.current > 3) page = pagination.current - 2 + i
                  if (page > pagination.pages) return null
                }
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-8 h-8 text-sm rounded-lg font-medium transition-colors ${page === pagination.current ? 'bg-primary-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    {page}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => onPageChange(pagination.current + 1)}
              disabled={!pagination.hasMore}
              className="btn-secondary p-2 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
