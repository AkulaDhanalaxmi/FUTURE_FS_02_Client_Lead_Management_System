import { Menu, Sun, Moon, Bell, Search } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { useLocation } from 'react-router-dom'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/leads': 'Lead Management',
  '/settings': 'Settings',
}

export default function Navbar({ onMobileMenuToggle }) {
  const { isDark, toggleTheme } = useTheme()
  const { user } = useAuth()
  const location = useLocation()

  const currentPath = Object.keys(PAGE_TITLES).find(p => location.pathname.startsWith(p)) || '/dashboard'
  const title = location.pathname.includes('/leads/') ? 'Lead Details' : PAGE_TITLES[currentPath]

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-4 px-4 md:px-6 h-16">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
        >
          <Menu size={22} />
        </button>

        <div className="flex-1">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
          <p className="text-xs text-slate-400 hidden sm:block">
            {greeting()}, {user?.name?.split(' ')[0]}! Here's your CRM overview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-semibold ml-1">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}
