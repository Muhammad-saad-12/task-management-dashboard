import { useState, useEffect } from 'react'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import DashboardHeading from './components/dashboard/DashboardHeading'
import StatCards from './components/dashboard/StatCards'
import TaskList from './components/dashboard/TaskList'
import UpcomingDeadlines from './components/dashboard/UpcomingDeadlines'
import ProjectProgress from './components/dashboard/ProjectProgress'
import CreateTaskModal from './components/dashboard/CreateTaskModal'
import DeleteConfirmModal from './components/dashboard/DeleteConfirmModal'
import {
  currentUser,
  statsData,
  projectTags,
  initialTasks,
  upcomingDeadlines,
  projectProgressData,
} from './data/mockData'

const STORAGE_KEY = 'taskflow_tasks'

function getStoredTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved !== null) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error)
  }
  return initialTasks
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [tasks, setTasks] = useState(getStoredTasks)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error)
    }
  }, [tasks])

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState(null)
  const [taskToDelete, setTaskToDelete] = useState(null)

  const handleOpenCreateModal = () => {
    setTaskToEdit(null)
    setIsTaskModalOpen(true)
  }

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task)
    setIsTaskModalOpen(true)
  }

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false)
    setTaskToEdit(null)
  }

  const handleSaveTask = (taskPayload) => {
    if (taskToEdit) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskToEdit.id
            ? {
                ...t,
                ...taskPayload,
              }
            : t
        )
      )
    } else {
      const newTask = {
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        ...taskPayload,
        completed: false,
        subtasks: { completed: 0, total: 0 },
        assignees: [
          { name: currentUser.name, avatar: currentUser.avatar },
        ],
        commentsCount: 0,
        attachmentsCount: 0,
      }
      setTasks((prev) => [newTask, ...prev])
    }
  }

  const handleRequestDelete = (task) => {
    setTaskToDelete(task)
  }

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id))
      setTaskToDelete(null)
    }
  }

  const handleToggleComplete = (taskId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              completed: !t.completed,
              status: !t.completed ? 'completed' : 'in-progress',
            }
          : t
      )
    )
  }

  return (
    <div className="min-h-screen bg-[#090a10] text-slate-100 flex">
      {/* Left Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header & Search Bar & Profile */}
        <Header
          onOpenSidebar={() => setSidebarOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Dashboard Main Workspace */}
        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Dashboard Heading & Action Bar */}
          <DashboardHeading onOpenCreateModal={handleOpenCreateModal} />

          {/* Task Statistics Cards */}
          <StatCards stats={statsData} />

          {/* Main Content Grid: Task List + Sidebar Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Task List Area (8 columns on large screens) */}
            <section className="lg:col-span-8 space-y-4">
              <TaskList
                tasks={tasks}
                onToggleComplete={handleToggleComplete}
                onEditTask={handleOpenEditModal}
                onDeleteTask={handleRequestDelete}
                searchQuery={searchQuery}
                projectTags={projectTags}
              />
            </section>

            {/* Companion Widgets (4 columns on large screens) */}
            <aside className="lg:col-span-4 space-y-6">
              <UpcomingDeadlines deadlines={upcomingDeadlines} />
              <ProjectProgress projects={projectProgressData} />
            </aside>
          </div>
        </main>
      </div>

      {/* Reusable Create/Edit Task Modal */}
      {isTaskModalOpen && (
        <CreateTaskModal
          isOpen={isTaskModalOpen}
          onClose={handleCloseTaskModal}
          onSave={handleSaveTask}
          projects={projectTags}
          initialData={taskToEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(taskToDelete)}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
        taskTitle={taskToDelete?.title}
      />
    </div>
  )
}
