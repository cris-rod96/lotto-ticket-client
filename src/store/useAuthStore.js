import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,

      login: (data) =>
        set({
          token: data.token,
          user: data.usuario,
        }),
      updateUser: (newData) =>
        set((state) => ({
          user: { ...state.user, ...newData },
        })),

      logout: () =>
        set({
          token: null,
          user: null,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
)
