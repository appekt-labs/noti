export interface Project {
  id: string
  name: string
  projectKey: string
  createdAt: string
  updatedAt: string
  userId: string
}

export interface Message {
  id: string
  title: string
  description: string
  type: 'banner' | 'modal' | 'toast'
  variant: 'info' | 'warning' | 'danger' | 'success'
  projectId: string
  createdAt: string
  updatedAt: string
  activeFrom: string
  activeTo: string
  metadata?: any
}

export interface CreateProject {
  name: string
}

export interface CreateMessage {
  projectId: string
  title: string
  description: string
  type: 'banner' | 'modal' | 'toast'
  variant: 'info' | 'warning' | 'danger' | 'success'
  activeFrom: string
  activeTo: string
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data?: T
}
