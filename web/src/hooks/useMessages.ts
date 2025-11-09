import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../utils/api'
import type { Message, CreateMessage, ApiResponse } from '../types'
import toast from 'react-hot-toast'

export const useMessages = (projectId: string, limit = 20, page = 0) => {
  return useQuery({
    queryKey: ['messages', projectId, limit, page],
    queryFn: async () => {
      const { data } = await api.get<Message[]>(
        `/projects/${projectId}/messages?limit=${limit}&page=${page}`
      )
      return data
    },
    enabled: !!projectId,
    retry: false,
  })
}

export const useCreateMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (message: CreateMessage) => {
      const { data } = await api.post<ApiResponse>('/messages', message)
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.projectId] })
      toast.success('Message created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create message')
    },
  })
}

