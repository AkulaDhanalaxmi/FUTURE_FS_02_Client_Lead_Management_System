import { useState } from 'react'
import { User, Lock, Mail, Save, Sun, Moon, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import api from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { getInitials } from '../utils/helpers'

export default function SettingsPage() {
  const { user, updateUser } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [showPasswords, setShowPasswords] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      const { data } = await api.put('/auth/profile', profileForm)
      updateUser(data.user)
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match.')
      return
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return
    }
    setSavingPassword(true)
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      toast.success('Password changed successfully!')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.')
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">Account</p>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h1>
      </div>

      {/* Profile */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
            <User size={18} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Profile Information</h3>
            <p className="text-xs text-slate-400">Update your account details</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-xl font-bold">
            {getInitials(user?.name)}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role} Account</p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={e => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  className="input pl-9"
                />
              </div>
            </div>
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={e => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                  className="input pl-9"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={savingProfile} className="btn-primary">
              {savingProfile ? <LoadingSpinner size="sm" /> : <Save size={15} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Password */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
            <Lock size={18} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Password & Security</h3>
            <p className="text-xs text-slate-400">Change your account password</p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="label">Current Password</label>
            <input
              type={showPasswords ? 'text' : 'password'}
              value={passwordForm.currentPassword}
              onChange={e => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="input"
              placeholder="••••••••"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">New Password</label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                className="input"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={e => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="input"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              {showPasswords ? <EyeOff size={14} /> : <Eye size={14} />}
              {showPasswords ? 'Hide' : 'Show'} passwords
            </button>
            <button type="submit" disabled={savingPassword} className="btn-primary">
              {savingPassword ? <LoadingSpinner size="sm" /> : <Lock size={15} />}
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Appearance */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
            {isDark ? <Moon size={18} className="text-purple-600 dark:text-purple-400" /> : <Sun size={18} className="text-purple-600 dark:text-purple-400" />}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Appearance</h3>
            <p className="text-xs text-slate-400">Customize how LeadFlow looks</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">Dark Mode</p>
            <p className="text-xs text-slate-400">Switch between light and dark themes</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-12 h-6 rounded-full transition-colors ${isDark ? 'bg-primary-600' : 'bg-slate-300'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isDark ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>
    </div>
  )
}
