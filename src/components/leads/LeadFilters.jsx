import { Search, Filter, X, SlidersHorizontal } from 'lucide-react'
import { LEAD_STATUSES, LEAD_SOURCES, LEAD_PRIORITIES } from '../../utils/helpers'
import { useState } from 'react'

export default function LeadFilters({ filters, onChange, onReset }) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const hasActiveFilters = filters.status !== 'All' || filters.source !== 'All' || filters.priority !== 'All' || filters.search

  return (
    <div className="card p-4 space-y-3">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads by name, email, or company..."
            value={filters.search}
            onChange={(e) => onChange('search', e.target.value)}
            className="input pl-9"
          />
          {filters.search && (
            <button onClick={() => onChange('search', '')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`btn-secondary gap-2 ${showAdvanced ? 'ring-2 ring-primary-300' : ''}`}
        >
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && <span className="w-2 h-2 bg-primary-500 rounded-full" />}
        </button>
        {hasActiveFilters && (
          <button onClick={onReset} className="btn-secondary text-red-500 hover:text-red-600 gap-1">
            <X size={14} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="label text-xs">Status</label>
            <select value={filters.status} onChange={e => onChange('status', e.target.value)} className="input text-sm">
              <option value="All">All Status</option>
              {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label text-xs">Source</label>
            <select value={filters.source} onChange={e => onChange('source', e.target.value)} className="input text-sm">
              <option value="All">All Sources</option>
              {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label text-xs">Priority</label>
            <select value={filters.priority} onChange={e => onChange('priority', e.target.value)} className="input text-sm">
              <option value="All">All Priority</option>
              {LEAD_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="label text-xs">Sort By</label>
            <select value={filters.sortBy} onChange={e => onChange('sortBy', e.target.value)} className="input text-sm">
              <option value="createdAt">Date Created</option>
              <option value="name">Name</option>
              <option value="value">Deal Value</option>
              <option value="followUpDate">Follow-up</option>
            </select>
          </div>
          <div>
            <label className="label text-xs">Order</label>
            <select value={filters.sortOrder} onChange={e => onChange('sortOrder', e.target.value)} className="input text-sm">
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
