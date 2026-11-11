import { useState, useEffect } from 'react'
import {
  X,
  Plus,
  Pencil,
  Check,
  FolderKanban,
  Flag,
  Calendar,
  FileText,
  AlertCircle,
} from 'lucide-react'

const priorityOptions = [
  {
    id: 'Low',
    label: 'Low',
    color: 'text-blue-400 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20',
    activeColor: 'bg-blue-500/25 border-blue-400 text-blue-200 ring-1 ring-blue-400',
  },
  {
    id: 'Medium',
    label: 'Medium',
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20',
    activeColor: 'bg-amber-500/25 border-amber-400 text-amber-200 ring-1 ring-amber-400',
  },
  {
    id: 'High',
    label: 'High',
    color: 'text-rose-400 border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20',
    activeColor: 'bg-rose-500/25 border-rose-400 text-rose-200 ring-1 ring-rose-400',
  },
]

export default function CreateTaskModal({
  isOpen,
  onClose,
  onSave,
  projects = [],
  initialData = null,
}) {
  const isEditing = Boolean(initialData)
  const availableProjects = projects.filter((p) => p.id !== 'all')
  const defaultProjectId = availableProjects[0]?.id || ''

  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(
    initialData?.description === 'No description provided.'
      ? ''
      : initialData?.description || ''
  )
  const [projectId, setProjectId] = useState(
    initialData?.projectId || defaultProjectId
  )
  const [priority, setPriority] = useState(initialData?.priority || 'Medium')
  const [dueDate, setDueDate] = useState(initialData?.rawDueDate || '')
  const [error, setError] = useState('')

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!title.trim()) {
      setError('Task title is required')
      return
    }

    const selectedProjectObj =
      availableProjects.find((p) => p.id === projectId) || availableProjects[0]

    // Format human-friendly due date string
    let formattedDueDate = initialData?.dueDate || 'No due date'
    let isToday = initialData?.isToday || false

    if (dueDate) {
      const parsedDate = new Date(dueDate + 'T00:00:00')
      const today = new Date()
      const isSameDay =
        parsedDate.getFullYear() === today.getFullYear() &&
        parsedDate.getMonth() === today.getMonth() &&
        parsedDate.getDate() === today.getDate()

      if (isSameDay) {
        formattedDueDate = 'Today, 5:00 PM'
        isToday = true
      } else {
        formattedDueDate = parsedDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
        isToday = false
      }
    } else if (!isEditing) {
      formattedDueDate = 'No due date'
      isToday = false
    }

    const taskPayload = {
      title: title.trim(),
      description: description.trim() || 'No description provided.',
      project: selectedProjectObj?.name || 'General',
      projectId: selectedProjectObj?.id || 'general',
      projectColor: selectedProjectObj?.color || 'cyan',
      priority,
      dueDate: formattedDueDate,
      rawDueDate: dueDate,
      isToday,
    }

    onSave(taskPayload)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#12141e] shadow-2xl shadow-black/80 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {isEditing ? (
                <Pencil className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </div>
            <h2 className="text-base font-semibold text-white">
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Task Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (error) setError('')
              }}
              placeholder="e.g. Audit checkout flow accessibility..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:border-indigo-500/50 focus:bg-white/[0.07] focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-slate-400" />
              <span>Description</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details, acceptance criteria, or design links..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-slate-100 placeholder-slate-400 focus:border-indigo-500/50 focus:bg-white/[0.07] focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
            />
          </div>

          {/* Project & Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Project Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FolderKanban className="h-3.5 w-3.5 text-slate-400" />
                <span>Project</span>
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-slate-200 focus:border-indigo-500/50 focus:outline-hidden cursor-pointer"
              >
                {availableProjects.map((proj) => (
                  <option
                    key={proj.id}
                    value={proj.id}
                    className="bg-[#12141e] text-slate-200"
                  >
                    {proj.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>Due Date</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-slate-200 focus:border-indigo-500/50 focus:outline-hidden cursor-pointer"
              />
            </div>
          </div>

          {/* Priority Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Flag className="h-3.5 w-3.5 text-slate-400" />
              <span>Priority</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {priorityOptions.map((opt) => {
                const isSelected = priority === opt.id
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setPriority(opt.id)}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-medium transition-all ${
                      isSelected ? opt.activeColor : opt.color
                    }`}
                  >
                    <span>{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98] transition-all"
            >
              {isEditing ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Save Changes</span>
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create Task</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
