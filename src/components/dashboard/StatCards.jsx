const colorMap = {
  indigo: {
    border: 'border-indigo-500/20',
    hoverBorder: 'hover:border-indigo-500/40',
    glow: 'from-indigo-500/10 via-transparent to-transparent',
  },
  amber: {
    border: 'border-amber-500/20',
    hoverBorder: 'hover:border-amber-500/40',
    glow: 'from-amber-500/10 via-transparent to-transparent',
  },
  emerald: {
    border: 'border-emerald-500/20',
    hoverBorder: 'hover:border-emerald-500/40',
    glow: 'from-emerald-500/10 via-transparent to-transparent',
  },
  rose: {
    border: 'border-rose-500/20',
    hoverBorder: 'hover:border-rose-500/40',
    glow: 'from-rose-500/10 via-transparent to-transparent',
  },
}

export default function StatCards({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const colors = colorMap[stat.accentColor] || colorMap.indigo

        return (
          <div
            key={stat.id}
            className={`group relative overflow-hidden rounded-2xl border bg-[#11131c]/70 p-5 backdrop-blur-xs transition-all duration-300 hover:-translate-y-0.5 ${colors.border} ${colors.hoverBorder}`}
          >
            {/* Soft Ambient Background Glow */}
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${colors.glow} opacity-40 transition-opacity group-hover:opacity-75`}
            />

            <div className="relative z-10 flex flex-col justify-between space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {stat.title}
              </span>
              <span className="text-3xl font-extrabold tracking-tight text-white">
                {stat.value}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
