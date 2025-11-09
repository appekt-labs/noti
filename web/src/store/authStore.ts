import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  checkAuth: () => boolean
  setAuthenticated: (value: boolean) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: (() => {
    const cookies = document.cookie.split(';')
    const hasToken = cookies.some(cookie =>
      cookie.trim().startsWith('access_token=')
    )
    set({ isAuthenticated: hasToken })
    return hasToken
  })(),
  checkAuth: () => {
    const cookies = document.cookie.split(';')
    const hasToken = cookies.some(cookie =>
      cookie.trim().startsWith('access_token=')
    )
    set({ isAuthenticated: hasToken })
    return hasToken
  },
  setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
}))


