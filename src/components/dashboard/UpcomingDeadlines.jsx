import { Calendar, Clock, ArrowRight } from 'lucide-react'

const colorMap = {
  cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
  purple: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  amber: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
}

export default function UpcomingDeadlines({ deadlines }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#11131c]/60 p-5 backdrop-blur-xs">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-indigo-400" />
          <h2 className="text-sm font-semibold text-white">Upcoming Deadlines</h2>
        </div>
        <button
          type="button"
          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
        >
          <span>View all</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {deadlines.map((item) => (
          <div
            key={item.id}
            className="group flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors"
          >
            <div className="space-y-1 min-w-0">
              <h3 className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                {item.title}
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium border ${
                    colorMap[item.color] || 'bg-white/5 text-slate-300 border-white/10'
                  }`}
                >
                  {item.project}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {item.time}
                </span>
              </div>
            </div>

            <span
              className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold border ${
                item.priority === 'High'
                  ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                  : item.priority === 'Medium'
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                  : 'bg-blue-500/10 text-blue-300 border-blue-500/20'
              }`}
            >
              {item.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
