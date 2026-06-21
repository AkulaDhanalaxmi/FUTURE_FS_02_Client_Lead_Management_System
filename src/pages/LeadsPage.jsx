import { useState, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import { leadService } from '../services/leadService'
import LeadTable from '../components/leads/LeadTable'
import LeadFilters from '../components/leads/LeadFilters'
import LeadForm from '../components/leads/LeadForm'
import ConfirmDialog from '../components/common/ConfirmDialog'

const DEFAULT_FILTERS = {
  search: '', status: 'All', source: 'All', priority: 'All',
  sortBy: 'createdAt', sortOrder: 'desc', page: 1, limit: 10
}

export default function LeadsPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [formOpen, setFormOpen] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['leads', filters],
    queryFn: () => leadService.getLeads(filters).then(r => r.data),
    keepPreviousData: true,
  })

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['leads'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard-activity'] })
  }

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }, [])

  const handleReset = () => setFilters(DEFAULT_FILTERS)
  const handlePageChange = (page) => setFilters(prev => ({ ...prev, page }))

  const openAddForm = () => { setEditingLead(null); setFormOpen(true) }
  const openEditForm = (lead) => { setEditingLead(lead); setFormOpen(true) }
  const closeForm = () => { setFormOpen(false); setEditingLead(null) }

  const handleSubmit = async (formData) => {
    setSubmitting(true)
    try {
      if (editingLead) {
        await leadService.updateLead(editingLead._id, formData)
        toast.success('Lead updated successfully!')
      } else {
        await leadService.createLead(formData)
        toast.success('Lead created successfully!')
      }
      invalidateAll()
      closeForm()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await leadService.deleteLead(deleteTarget._id)
      toast.success('Lead deleted.')
      invalidateAll()
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete lead.')
    } finally {
      setDeleting(false)
    }
  }

  const exportCSV = () => {
    const leads = data?.data || []
    if (leads.length === 0) { toast.error('No leads to export.'); return }
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Source', 'Status', 'Priority', 'Value', 'Created']
    const rows = leads.map(l => [l.name, l.email, l.phone || '', l.company || '', l.source, l.status, l.priority, l.value || 0, new Date(l.createdAt).toLocaleDateString()])
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `leads-export-${Date.now()}.csv`; a.click()
    URL.revokeObjectURL(url)
    toast.success('Leads exported!')
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">Pipeline</p>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            All Leads {data?.pagination?.total ? <span className="text-slate-400 font-normal text-base">({data.pagination.total})</span> : ''}
          </h1>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="btn-secondary">
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={openAddForm} className="btn-primary">
            <Plus size={16} />
            Add Lead
          </button>
        </div>
      </div>

      <LeadFilters filters={filters} onChange={handleFilterChange} onReset={handleReset} />

      <LeadTable
        leads={data?.data || []}
        loading={isLoading}
        pagination={data?.pagination}
        onEdit={openEditForm}
        onDelete={setDeleteTarget}
        onPageChange={handlePageChange}
      />

      <LeadForm
        isOpen={formOpen}
        onClose={closeForm}
        onSubmit={handleSubmit}
        initialData={editingLead}
        loading={submitting}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Lead"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete Lead"
        loading={deleting}
      />
    </div>
  )
}
