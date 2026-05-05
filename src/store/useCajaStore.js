import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCajaStore = create(
  persist(
    (set) => ({
      caja: null,
      isCajaAbierta: false,
      cajas: [],

      setCaja: (cajaData) =>
        set({
          caja: cajaData,
          isCajaAbierta: !!cajaData,
        }),

      setCajas: (cajas) =>
        set({
          cajas: cajas,
        }),

      updateCajaData: (newData) =>
        set((state) => ({
          caja: state.caja ? { ...state.caja, ...newData } : null,
        })),

      clearCaja: () =>
        set({
          caja: null,
          isCajaAbierta: false,
        }),

      clearCajas: () =>
        set({
          cajas: [],
        }),
    }),
    {
      name: 'caja-storage',
    }
  )
)
