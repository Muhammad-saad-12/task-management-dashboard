import { Plus, CalendarDays } from 'lucide-react'

export default function DashboardHeading({ onOpenCreateModal }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Section Title & Sprint Date Indicator */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Dashboard
        </h1>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
          <CalendarDays className="h-4 w-4 text-indigo-400" />
          <span>Sprint 14 • Nov 10 – Nov 24, 2026</span>
        </div>
      </div>

      {/* Right: Prominent + Add Task Button */}
      <div>
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="group relative flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 px-5 py-3 sm:px-6 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:from-indigo-400 hover:to-purple-500 active:scale-[0.98] ring-1 ring-white/20 transition-all duration-200 cursor-pointer"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/20 text-white transition-transform duration-200 group-hover:rotate-90">
            <Plus className="h-4 w-4 stroke-[2.5]" />
          </div>
          <span>Add Task</span>
        </button>
      </div>
    </div>
  )
}
