import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Zap, Mail, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => setForm({ email: 'admin@leadflow.com', password: 'Admin@123' })

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white" style={{
              width: `${(i + 1) * 120}px`, height: `${(i + 1) * 120}px`,
              top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.3 - i * 0.04
            }} />
          ))}
        </div>
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl">LeadFlow CRM</span>
          </div>
        </div>
        <div className="relative">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Turn leads into<br />lasting clients.
          </h1>
          <p className="text-primary-200 text-lg leading-relaxed mb-8">
            Manage your entire sales pipeline in one place. Track, nurture, and convert leads with powerful tools built for modern teams.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[['12k+', 'Leads Tracked'], ['98%', 'Uptime'], ['3x', 'Conversion Rate']].map(([num, label]) => (
              <div key={label} className="bg-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold text-white">{num}</p>
                <p className="text-primary-200 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-primary-300 text-sm">© 2024 LeadFlow CRM. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">LeadFlow CRM</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Sign in</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Enter your credentials to access the dashboard</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm mb-5">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@leadflow.com"
                  className="input pl-9"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input pl-9 pr-10"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 mt-2">
              {loading ? <><LoadingSpinner size="sm" />Signing in...</> : 'Sign in'}
            </button>
          </form>

          <div className="mt-4">
            <button
              onClick={fillDemo}
              className="w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Use demo credentials
            </button>
          </div>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
