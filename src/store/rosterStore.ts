import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SwingPattern, RosterDayOverride } from '@/types/roster'
import { savePattern, saveOverride, deleteOverride } from '@/db/rosterRepository'

interface RosterState {
  activePattern: SwingPattern | null
  overrides: RosterDayOverride[]
  setPattern: (pattern: SwingPattern) => Promise<void>
  addOverride: (override: RosterDayOverride) => Promise<void>
  removeOverride: (date: string) => Promise<void>
  loadFromDb: (pattern: SwingPattern | undefined, overrides: RosterDayOverride[]) => void
}

export const useRosterStore = create<RosterState>()(
  persist(
    (set) => ({
      activePattern: null,
      overrides: [],
      setPattern: async (pattern) => {
        await savePattern(pattern)
        set({ activePattern: pattern })
      },
      addOverride: async (override) => {
        await saveOverride(override)
        set((state) => ({
          overrides: [
            ...state.overrides.filter((o) => o.date !== override.date),
            override,
          ],
        }))
      },
      removeOverride: async (date) => {
        await deleteOverride(date)
        set((state) => ({
          overrides: state.overrides.filter((o) => o.date !== date),
        }))
      },
      loadFromDb: (pattern, overrides) => {
        set({ activePattern: pattern ?? null, overrides })
      },
    }),
    {
      name: 'fifo-roster',
      partialize: (state) => ({
        activePattern: state.activePattern,
        overrides: state.overrides,
      }),
    },
  ),
)
