import {
  Search,
  Bell,
  Menu,
  Command,
  SlidersHorizontal,
} from 'lucide-react'
import { currentUser } from '../../data/mockData'

export default function Header({ onOpenSidebar, searchQuery, setSearchQuery }) {
  return (
    <header className="sticky top-0 z-30 flex h-18 w-full items-center justify-between border-b border-white/5 bg-[#0b0d14]/80 px-4 sm:px-8 backdrop-blur-md">
      {/* Left: Mobile Sidebar Trigger & Global Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white lg:hidden transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, projects, tags..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2 pl-10 pr-16 text-sm text-slate-200 placeholder-slate-400 focus:border-indigo-500/50 focus:bg-white/[0.07] focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2.5">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-400">
              <Command className="h-3 w-3" />
              <span>K</span>
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Quick Actions */}
      <div className="flex items-center gap-3 ml-4">
        {/* Quick Filter button (visible on medium+ screens) */}
        <button
          type="button"
          className="hidden md:flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
          <span>Filters</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            {currentUser.unreadNotifications > 0 && (
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
