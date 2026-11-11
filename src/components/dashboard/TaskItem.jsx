import { useState, useRef, useEffect } from 'react'
import {
  Calendar,
  CheckCircle2,
  Circle,
  MoreVertical,
  Pencil,
  Trash2,
} from 'lucide-react'

const getStatusBadge = (task) => {
  if (task.completed || task.status === 'completed') {
    return {
      label: 'Completed',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      dotClass: 'bg-emerald-400',
    }
  }
  if (task.status === 'in-progress') {
    return {
      label: 'In Progress',
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      dotClass: 'bg-amber-400',
    }
  }
  if (task.status === 'in-review') {
    return {
      label: 'In Review',
      badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      dotClass: 'bg-purple-400',
    }
  }
  return {
    label: 'To Do',
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dotClass: 'bg-blue-400',
  }
}

export default function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const isCompleted = task.completed
  const statusInfo = getStatusBadge(task)

  const assigneeNames =
    task.assignees && task.assignees.length > 0
      ? task.assignees.map((a) => a.name).join(', ')
      : 'Unassigned'

  return (
    <tr
      className={`group border-b border-white/5 transition-colors hover:bg-white/[0.03] ${
        isCompleted ? 'opacity-65' : ''
      }`}
    >
      {/* 1. Task Name Column */}
      <td className="py-3.5 pl-4 sm:pl-6 pr-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Completion Checkbox */}
          <button
            type="button"
            onClick={() => onToggleComplete(task.id)}
            className="shrink-0 text-slate-400 hover:text-indigo-400 transition-colors"
            aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-emerald-400 fill-emerald-400/20" />
            ) : (
              <Circle className="h-4 w-4 sm:h-4.5 sm:w-4.5 hover:stroke-indigo-400" />
            )}
          </button>

          {/* Title and Project */}
          <div className="min-w-0 flex-1">
            <div
              className={`font-medium text-slate-100 text-xs sm:text-sm leading-tight truncate ${
                isCompleted ? 'line-through text-slate-400' : ''
              }`}
              title={task.title}
            >
              {task.title}
            </div>
            {task.project && (
              <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">
                {task.project}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* 2. Status Column */}
      <td className="py-3.5 px-2 sm:px-3">
        <span
          className={`inline-flex items-center gap-1 sm:gap-1.5 rounded-md px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-medium border max-w-full truncate ${statusInfo.badgeClass}`}
        >
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusInfo.dotClass}`} />
          <span className="truncate">{statusInfo.label}</span>
        </span>
      </td>

      {/* 3. Assignee Column (Plain text name only) */}
      <td className="py-3.5 px-2 sm:px-3">
        <span
          className="text-xs sm:text-sm text-slate-300 truncate block font-normal"
          title={assigneeNames}
        >
          {assigneeNames}
        </span>
      </td>

      {/* 4. Due Date Column */}
      <td className="py-3.5 px-2 sm:px-3">
        <div
          className={`flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs truncate ${
            task.isToday
              ? 'text-amber-300 font-semibold'
              : 'text-slate-300'
          }`}
        >
          <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-400 shrink-0 hidden sm:inline" />
          <span className="truncate">{task.dueDate || 'No due date'}</span>
        </div>
      </td>

      {/* 5. Actions Column (Three-dot menu ⋮) */}
      <td className="py-3.5 pl-2 pr-4 sm:pr-6 text-right">
        <div className="relative inline-flex items-center justify-end" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg transition-colors ${
              menuOpen
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
            aria-label="More task options"
          >
            <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>

          {/* Three-dot dropdown menu */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-32 rounded-xl border border-white/10 bg-[#161826] p-1.5 shadow-2xl shadow-black/80 z-30 text-left">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  onEdit?.(task)
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Pencil className="h-3.5 w-3.5 text-slate-400" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  onDelete?.(task)
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}
