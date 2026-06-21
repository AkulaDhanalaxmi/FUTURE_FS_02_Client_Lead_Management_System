import { AlertTriangle, X } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', loading = false, variant = 'danger' }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card p-6 w-full max-w-md animate-slide-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          <X size={18} />
        </button>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertTriangle className="text-red-600 dark:text-red-400" size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary" disabled={loading}>Cancel</button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={variant === 'danger' ? 'btn-danger' : 'btn-primary'}
          >
            {loading ? <><LoadingSpinner size="sm" /> Processing...</> : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
