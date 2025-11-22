import { useState } from 'react'
import { useProjects } from '../hooks/useProjects'
import { useMessages } from '../hooks/useMessages'
import CreateProject from '../components/forms/CreateProject'
import CreateMessage from '../components/forms/CreateMessage'
import { FiPlus, FiCopy, FiCheck, FiFolder, FiMessageSquare, FiCalendar } from 'react-icons/fi'
import { format } from 'date-fns'
import { Button } from '@headlessui/react'
import Logo from '../components/Logo'
function Dashboard() {
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [showCreateMessage, setShowCreateMessage] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const { data: projects, isLoading: projectsLoading } = useProjects()
  const { data: messages, isLoading: messagesLoading } = useMessages(
    selectedProjectId || '',
    20,
    0
  )
  const selectedProject = projects?.find((p) => p.id === selectedProjectId)

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }
  const url = new URL(window.location.href);
  const origin = url.origin;
  const getVariantColor = (variant: string) => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'danger':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'info':
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'banner':
        return '📢'
      case 'modal':
        return '🪟'
      case 'toast':
        return '🍞'
      default:
        return '💬'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo className="text-emerald-600 text-2xl font-bold" />
            <div className="flex items-center gap-4">
              <Button
                onClick={() => {
                  setSelectedProjectId(null)
                  setShowCreateProject(true)
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                New Project
              </Button>

              <Button onClick={async () => {
                window.location.href = '/api/v1/auth/logout'
              }} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2">
                Log out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Projects</h2>
              {projectsLoading ? (
                <div className="text-center py-8 text-gray-500">Loading projects...</div>
              ) : projects && projects.length > 0 ? (
                <div className="space-y-2">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProjectId(project.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${selectedProjectId === project.id
                        ? 'bg-emerald-50 border-2 border-emerald-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <FiFolder className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium text-gray-900">{project.name}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Created {format(new Date(project.createdAt), 'MMM d, yyyy')}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-4">No projects yet</p>
                  <Button
                    onClick={() => setShowCreateProject(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-2 rounded-lg"
                  >
                    Create your first project
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedProjectId ? (
              <div className="space-y-6">
                {selectedProject && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          {selectedProject.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                          Project Key: <span className="font-mono text-emerald-600">
                            {selectedProject.projectKey}
                          </span>
                        </p>
                      </div>
                      <Button
                        onClick={() => setShowCreateMessage(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                      >
                        <FiPlus className="w-4 h-4" />
                        New Message
                      </Button>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-emerald-900 mb-2">
                        SDK Integration
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 bg-white px-3 py-2 rounded text-xs font-mono text-gray-800 border border-emerald-200">
                          {`${origin}/api/v1/projects/${selectedProject.projectKey}/messages`}
                        </code>
                        <Button
                          onClick={() =>
                            copyToClipboard(
                              `${window.location.origin}/api/v1/projects/${selectedProject.projectKey}/messages`,
                              'endpoint'
                            )
                          }
                          className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
                        >
                          {copiedKey === 'endpoint' ? (
                            <FiCheck className="w-4 h-4" />
                          ) : (
                            <FiCopy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Messages</h3>
                  {messagesLoading ? (
                    <div className="text-center py-8 text-gray-500">Loading messages...</div>
                  ) : messages && messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{getTypeIcon(message.type)}</span>
                              <h4 className="font-semibold text-gray-900">{message.title}</h4>
                            </div>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium border ${getVariantColor(
                                message.variant
                              )}`}
                            >
                              {message.variant}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{message.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <FiCalendar className="w-3 h-3" />
                              <span>
                                {format(new Date(message.activeFrom), 'MMM d, yyyy')} -{' '}
                                {format(new Date(message.activeTo), 'MMM d, yyyy')}
                              </span>
                            </div>
                            <span className="capitalize">{message.type}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FiMessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="mb-4">No messages yet</p>
                      <Button
                        onClick={() => setShowCreateMessage(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-2 rounded-lg"
                      >
                        Create your first message
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <FiFolder className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a project to get started
                </h3>
                <p className="text-gray-600 mb-6">
                  Choose a project from the sidebar to view and manage messages
                </p>
                {projects && projects.length === 0 && (
                  <Button
                    onClick={() => setShowCreateProject(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg"
                  >
                    Create your first project
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreateProject && (
        <CreateProject onClose={() => setShowCreateProject(false)} />
      )}
      {showCreateMessage && (
        <CreateMessage
          onClose={() => setShowCreateMessage(false)}
          projectId={selectedProjectId || undefined}
        />
      )}
    </div>
  )
}

export default Dashboard
