import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, Settings, LogOut, Zap, X, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils/helpers'
import toast from 'react-hot-toast'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/leads', icon: Users, label: 'Leads' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ isMobileOpen, onMobileClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200 dark:border-slate-800">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <Zap size={16} className="text-white" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 dark:text-white text-sm tracking-wide">LeadFlow</h1>
          <p className="text-xs text-slate-400">CRM Platform</p>
        </div>
        {isMobileOpen && (
          <button onClick={onMobileClose} className="ml-auto text-slate-400 hover:text-slate-600 lg:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Menu</p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-primary-600 dark:text-primary-400' : ''} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="text-primary-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User profile */}
      <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {getInitials(user?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
          <aside className="relative flex flex-col w-64 bg-white dark:bg-slate-900 h-full shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}
