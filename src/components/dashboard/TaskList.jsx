import { useState, useMemo } from 'react'
import TaskItem from './TaskItem'
import {
  Search,
  LayoutList,
  Columns3,
} from 'lucide-react'

export default function TaskList({
  tasks,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  searchQuery,
  projectTags,
}) {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedProject, setSelectedProject] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [viewMode, setViewMode] = useState('list') // 'list' | 'board'

  const tabs = [
    { id: 'all', label: 'All Tasks', count: tasks.length },
    {
      id: 'in-progress',
      label: 'In Progress',
      count: tasks.filter((t) => t.status === 'in-progress').length,
    },
    {
      id: 'in-review',
      label: 'In Review',
      count: tasks.filter((t) => t.status === 'in-review').length,
    },
    {
      id: 'todo',
      label: 'To Do',
      count: tasks.filter((t) => t.status === 'todo').length,
    },
    {
      id: 'completed',
      label: 'Completed',
      count: tasks.filter((t) => t.completed).length,
    },
  ]

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Tab filter
      if (activeTab === 'completed' && !task.completed) return false
      if (activeTab === 'in-progress' && (task.status !== 'in-progress' || task.completed)) return false
      if (activeTab === 'in-review' && (task.status !== 'in-review' || task.completed)) return false
      if (activeTab === 'todo' && (task.status !== 'todo' || task.completed)) return false

      // Project filter
      if (selectedProject !== 'all' && task.projectId !== selectedProject) return false

      // Priority filter
      if (selectedPriority !== 'all' && task.priority.toLowerCase() !== selectedPriority) return false

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchTitle = task.title.toLowerCase().includes(query)
        const matchDesc = task.description.toLowerCase().includes(query)
        const matchProject = task.project.toLowerCase().includes(query)
        if (!matchTitle && !matchDesc && !matchProject) return false
      }

      return true
    })
  }, [tasks, activeTab, selectedProject, selectedPriority, searchQuery])

  return (
    <div className="space-y-4">
      {/* Task Filters & Control Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-xs'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isActive
                      ? 'bg-indigo-500/30 text-indigo-200'
                      : 'bg-white/5 text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* View Switchers & Dropdowns */}
        <div className="flex items-center gap-2">
          {/* Project Dropdown */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10 focus:outline-hidden cursor-pointer"
          >
            {projectTags.map((proj) => (
              <option key={proj.id} value={proj.id} className="bg-[#11131c] text-slate-200">
                {proj.name}
              </option>
            ))}
          </select>

          {/* Priority Dropdown */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10 focus:outline-hidden cursor-pointer"
          >
            <option value="all" className="bg-[#11131c] text-slate-200">
              All Priorities
            </option>
            <option value="high" className="bg-[#11131c] text-slate-200">
              High Priority
            </option>
            <option value="medium" className="bg-[#11131c] text-slate-200">
              Medium Priority
            </option>
            <option value="low" className="bg-[#11131c] text-slate-200">
              Low Priority
            </option>
          </select>

          {/* View Mode Toggle (List / Board) */}
          <div className="hidden sm:flex items-center rounded-xl border border-white/10 bg-white/5 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <LayoutList className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'board'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Board View"
            >
              <Columns3 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Task Items Table */}
      {filteredTasks.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#11131c]/60 backdrop-blur-xs">
          <table className="w-full table-fixed text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-white/[0.02]">
                <th className="py-3.5 pl-4 sm:pl-6 pr-2 w-[35%] sm:w-[38%]">Task Name</th>
                <th className="py-3.5 px-2 sm:px-3 w-[20%] sm:w-[17%]">Status</th>
                <th className="py-3.5 px-2 sm:px-3 w-[18%] sm:w-[17%]">Assignee</th>
                <th className="py-3.5 px-2 sm:px-3 w-[15%] sm:w-[16%]">Due Date</th>
                <th className="py-3.5 pl-2 pr-4 sm:pr-6 text-right w-[12%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-14 px-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-slate-400 mb-3">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">No tasks found</h3>
          <p className="mt-1 text-xs text-slate-400 max-w-xs">
            {searchQuery
              ? `No tasks matching "${searchQuery}". Try adjusting your search query or filters.`
              : 'No tasks found for the selected tab or filter.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveTab('all')
              setSelectedProject('all')
              setSelectedPriority('all')
            }}
            className="mt-4 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-indigo-400 hover:bg-white/10 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  )
}
