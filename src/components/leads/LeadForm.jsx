import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { LEAD_STATUSES, LEAD_SOURCES, LEAD_PRIORITIES } from '../../utils/helpers'
import LoadingSpinner from '../common/LoadingSpinner'

const EMPTY_FORM = {
  name: '', email: '', phone: '', company: '', source: 'Website',
  status: 'New', priority: 'Medium', value: '', notes: '', followUpDate: ''
}

export default function LeadForm({ isOpen, onClose, onSubmit, initialData = null, loading = false }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const isEdit = !!initialData

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          name: initialData.name || '',
          email: initialData.email || '',
          phone: initialData.phone || '',
          company: initialData.company || '',
          source: initialData.source || 'Website',
          status: initialData.status || 'New',
          priority: initialData.priority || 'Medium',
          value: initialData.value || '',
          notes: initialData.notes || '',
          followUpDate: initialData.followUpDate ? new Date(initialData.followUpDate).toISOString().split('T')[0] : ''
        })
      } else {
        setForm(EMPTY_FORM)
      }
      setErrors({})
    }
  }, [isOpen, initialData])

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim() || form.name.length < 2) newErrors.name = 'Name must be at least 2 characters'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Valid email is required'
    if (form.value && isNaN(Number(form.value))) newErrors.value = 'Must be a number'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const payload = { ...form, value: form.value ? Number(form.value) : 0 }
    if (!payload.followUpDate) delete payload.followUpDate
    onSubmit(payload)
  }

  if (!isOpen) return null

  const Field = ({ name, label, type = 'text', placeholder, required, children }) => (
    <div>
      <label className="label">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children || (
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`input ${errors[name] ? 'border-red-400 ring-1 ring-red-400' : ''}`}
        />
      )}
      {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card w-full max-w-2xl max-h-[90vh] flex flex-col animate-slide-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {isEdit ? 'Edit Lead' : 'Add New Lead'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field name="name" label="Full Name" placeholder="John Smith" required />
              <Field name="email" label="Email Address" type="email" placeholder="john@company.com" required />
              <Field name="phone" label="Phone Number" placeholder="+1-555-0100" />
              <Field name="company" label="Company" placeholder="Acme Corporation" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field name="source" label="Lead Source">
                <select name="source" value={form.source} onChange={handleChange} className="input">
                  {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field name="status" label="Status">
                <select name="status" value={form.status} onChange={handleChange} className="input">
                  {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field name="priority" label="Priority">
                <select name="priority" value={form.priority} onChange={handleChange} className="input">
                  {LEAD_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field name="value" label="Deal Value ($)" placeholder="10000" />
              <Field name="followUpDate" label="Follow-up Date" type="date" />
            </div>

            <Field name="notes" label="Notes">
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Add notes about this lead..."
                rows={3}
                className="input resize-none"
              />
            </Field>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <><LoadingSpinner size="sm" />{isEdit ? 'Saving...' : 'Creating...'}</> : (isEdit ? 'Save Changes' : 'Create Lead')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
