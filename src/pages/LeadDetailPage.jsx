import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft, Mail, Phone, Building2, Calendar, Pencil, Trash2,
  Tag, DollarSign, Clock, PlusCircle, RefreshCw, FileText, Layers, User as UserIcon
} from 'lucide-react'
import toast from 'react-hot-toast'
import { leadService } from '../services/leadService'
import { StatusBadge, PriorityBadge } from '../components/common/StatusBadge'
import LeadForm from '../components/leads/LeadForm'
import ConfirmDialog from '../components/common/ConfirmDialog'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { formatDate, formatCurrency, formatTimeAgo, getInitials, ACTION_LABELS } from '../utils/helpers'

const ACTION_ICONS = { created: PlusCircle, status_changed: RefreshCw, note_added: FileText, bulk_status_update: Layers }

export default function LeadDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [addingNote, setAddingNote] = useState(false)

  const { data: lead, isLoading } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadService.getLead(id).then(r => r.data.data),
  })

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['lead', id] })
    queryClient.invalidateQueries({ queryKey: ['leads'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard-activity'] })
  }

  const handleUpdate = async (formData) => {
    setSubmitting(true)
    try {
      await leadService.updateLead(id, formData)
      toast.success('Lead updated successfully!')
      invalidateAll()
      setEditOpen(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update lead.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await leadService.deleteLead(id)
      toast.success('Lead deleted.')
      navigate('/leads')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete lead.')
      setDeleting(false)
    }
  }

  const handleAddNote = async () => {
    if (!noteText.trim()) return
    setAddingNote(true)
    try {
      await leadService.addNote(id, noteText)
      toast.success('Note added!')
      setNoteText('')
      invalidateAll()
    } catch (err) {
      toast.error('Failed to add note.')
    } finally {
      setAddingNote(false)
    }
  }

  const handleQuickStatusChange = async (status) => {
    try {
      await leadService.updateLead(id, { status })
      toast.success(`Status changed to ${status}`)
      invalidateAll()
    } catch (err) {
      toast.error('Failed to update status.')
    }
  }

  if (isLoading) {
    return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
  }

  if (!lead) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Lead not found.</p>
        <Link to="/leads" className="text-primary-600 hover:underline text-sm mt-2 inline-block">Back to leads</Link>
      </div>
    )
  }

  const statuses = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost']

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Back button */}
      <button onClick={() => navigate('/leads')} className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
        <ArrowLeft size={16} />
        Back to Leads
      </button>

      {/* Header card */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-400 text-lg font-bold flex-shrink-0">
              {getInitials(lead.name)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{lead.name}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">{lead.company || 'No company'}</p>
              <div className="flex items-center gap-2 mt-2">
                <StatusBadge status={lead.status} />
                <PriorityBadge priority={lead.priority} />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setEditOpen(true)} className="btn-secondary">
              <Pencil size={15} />
              Edit
            </button>
            <button onClick={() => setDeleteOpen(true)} className="btn-danger">
              <Trash2 size={15} />
              Delete
            </button>
          </div>
        </div>

        {/* Quick status change */}
        <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400 self-center mr-1">Quick update:</span>
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => handleQuickStatusChange(s)}
              disabled={s === lead.status}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                s === lead.status
                  ? 'bg-primary-600 text-white cursor-default'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Contact Information</h3>
            <div className="space-y-3">
              <DetailRow icon={Mail} label="Email" value={lead.email} link={`mailto:${lead.email}`} />
              <DetailRow icon={Phone} label="Phone" value={lead.phone} link={lead.phone ? `tel:${lead.phone}` : null} />
              <DetailRow icon={Building2} label="Company" value={lead.company} />
              <DetailRow icon={Tag} label="Source" value={lead.source} />
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Deal Information</h3>
            <div className="space-y-3">
              <DetailRow icon={DollarSign} label="Deal Value" value={lead.value ? formatCurrency(lead.value) : null} />
              <DetailRow icon={Calendar} label="Follow-up Date" value={lead.followUpDate ? formatDate(lead.followUpDate) : null} />
              <DetailRow icon={Clock} label="Created" value={formatDate(lead.createdAt)} />
              <DetailRow icon={UserIcon} label="Created By" value={lead.createdBy?.name} />
            </div>
          </div>
        </div>

        {/* Right column - Notes & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notes */}
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Notes</h3>
            {lead.notes ? (
              <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 whitespace-pre-wrap leading-relaxed">{lead.notes}</p>
            ) : (
              <p className="text-sm text-slate-400 italic">No notes yet.</p>
            )}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Add a quick note..."
                className="input flex-1"
                onKeyDown={e => e.key === 'Enter' && handleAddNote()}
              />
              <button onClick={handleAddNote} disabled={addingNote || !noteText.trim()} className="btn-primary px-4">
                {addingNote ? <LoadingSpinner size="sm" /> : 'Add'}
              </button>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Activity Timeline</h3>
            {lead.activityLog?.length > 0 ? (
              <div className="space-y-4 relative">
                {[...lead.activityLog].reverse().map((activity, idx) => {
                  const Icon = ACTION_ICONS[activity.action] || RefreshCw
                  return (
                    <div key={idx} className="flex gap-3 relative">
                      {idx !== lead.activityLog.length - 1 && (
                        <div className="absolute left-4 top-9 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />
                      )}
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0 z-10">
                        <Icon size={14} />
                      </div>
                      <div className="flex-1 pb-1">
                        <p className="text-sm text-slate-700 dark:text-slate-300">{activity.description || ACTION_LABELS[activity.action]}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {activity.performedBy?.name && `${activity.performedBy.name} · `}
                          {formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">No activity recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      <LeadForm isOpen={editOpen} onClose={() => setEditOpen(false)} onSubmit={handleUpdate} initialData={lead} loading={submitting} />

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete "${lead.name}"? This action cannot be undone.`}
        confirmText="Delete Lead"
        loading={deleting}
      />
    </div>
  )
}

function DetailRow({ icon: Icon, label, value, link }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        {value ? (
          link ? (
            <a href={link} className="text-sm text-primary-600 dark:text-primary-400 hover:underline truncate block">{value}</a>
          ) : (
            <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{value}</p>
          )
        ) : (
          <p className="text-sm text-slate-300 dark:text-slate-600">Not provided</p>
        )}
      </div>
    </div>
  )
}
