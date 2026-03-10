import { create } from 'zustand'

type ActiveSheet = 'itinerary-detail' | 'add-itinerary' | 'edit-itinerary' | null

interface UiState {
  selectedDate: string | null
  selectedItineraryId: string | null
  activeSheet: ActiveSheet
  calendarView: 'month' | 'week'
  setSelectedDate: (date: string | null) => void
  openSheet: (sheet: ActiveSheet, itineraryId?: string) => void
  closeSheet: () => void
  setCalendarView: (view: 'month' | 'week') => void
}

export const useUiStore = create<UiState>()((set) => ({
  selectedDate: null,
  selectedItineraryId: null,
  activeSheet: null,
  calendarView: 'month',
  setSelectedDate: (date) => set({ selectedDate: date }),
  openSheet: (sheet, itineraryId) => set({ activeSheet: sheet, selectedItineraryId: itineraryId ?? null }),
  closeSheet: () => set({ activeSheet: null, selectedItineraryId: null }),
  setCalendarView: (view) => set({ calendarView: view }),
}))
