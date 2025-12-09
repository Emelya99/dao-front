import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
  isAuthenticated: boolean
  loading: boolean
  error: string | null

  setAuthenticated: (v: boolean) => void
  setLoading: (v: boolean) => void
  setError: (msg: string | null) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      loading: false,
      error: null,

      setAuthenticated: (v) => set({ isAuthenticated: v }),
      setLoading: (v) => set({ loading: v }),
      setError: (msg) => set({ error: msg }),

      reset: () =>
        set({
          isAuthenticated: false,
          loading: false,
          error: null
        })
    }),
    {
      name: 'auth-storage'
    }
  )
)
