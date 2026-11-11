import { FolderKanban, TrendingUp } from 'lucide-react'

export default function ProjectProgress({ projects }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#11131c]/60 p-5 backdrop-blur-xs">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-4 w-4 text-purple-400" />
          <h2 className="text-sm font-semibold text-white">Active Projects</h2>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
          <TrendingUp className="h-3 w-3" />
          <span>On track</span>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {projects.map((proj, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-200">{proj.name}</span>
              <span className="font-semibold text-white">{proj.progress}%</span>
            </div>

            {/* Progress bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${proj.color} transition-all duration-500`}
                style={{ width: `${proj.progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{proj.tasksCount}</span>
              <div className="flex items-center -space-x-1.5">
                {proj.members.map((m, mIdx) => (
                  <img
                    key={mIdx}
                    src={m}
                    alt="Member"
                    className="h-4.5 w-4.5 rounded-full object-cover ring-1 ring-[#11131c]"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
