import { create } from 'zustand'
import type { Itinerary } from '@/types/itinerary'
import { saveItinerary, deleteItinerary as dbDelete, getAllItineraries } from '@/db/itineraryRepository'

interface ItineraryState {
  itineraries: Itinerary[]
  hydrated: boolean
  hydrate: () => Promise<void>
  addItinerary: (itinerary: Itinerary) => Promise<void>
  updateItinerary: (itinerary: Itinerary) => Promise<void>
  deleteItinerary: (id: string) => Promise<void>
}

export const useItineraryStore = create<ItineraryState>()((set) => ({
  itineraries: [],
  hydrated: false,
  hydrate: async () => {
    try {
      const all = await getAllItineraries()
      set({ itineraries: all, hydrated: true })
    } catch {
      set({ hydrated: true })
    }
  },
  addItinerary: async (itinerary) => {
    await saveItinerary(itinerary)
    set((state) => ({ itineraries: [...state.itineraries, itinerary] }))
  },
  updateItinerary: async (itinerary) => {
    await saveItinerary(itinerary)
    set((state) => ({
      itineraries: state.itineraries.map((i) => (i.id === itinerary.id ? itinerary : i)),
    }))
  },
  deleteItinerary: async (id) => {
    await dbDelete(id)
    set((state) => ({
      itineraries: state.itineraries.filter((i) => i.id !== id),
    }))
  },
}))
