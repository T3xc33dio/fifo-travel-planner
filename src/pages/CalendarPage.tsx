import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { RosterCalendar } from '@/components/calendar/RosterCalendar'
import { ItineraryDetail } from '@/components/itinerary/ItineraryDetail'
import { ItineraryForm } from '@/components/itinerary/ItineraryForm'
import { useUiStore } from '@/store/uiStore'
import { useRosterStore } from '@/store/rosterStore'
import { useItineraryStore } from '@/store/itineraryStore'
import { useItineraryForDate } from '@/hooks/useItineraryForDate'

export function CalendarPage() {
  const navigate = useNavigate()
  const activePattern = useRosterStore((s) => s.activePattern)
  const activeSheet = useUiStore((s) => s.activeSheet)
  const selectedItineraryId = useUiStore((s) => s.selectedItineraryId)
  const selectedDate = useUiStore((s) => s.selectedDate)
  const closeSheet = useUiStore((s) => s.closeSheet)
  const itineraries = useItineraryStore((s) => s.itineraries)
  const itinerariesForDate = useItineraryForDate(selectedDate)
  const [navDate, setNavDate] = useState(new Date())

  const selectedItinerary = itineraries.find((i) => i.id === selectedItineraryId)
    ?? itinerariesForDate[0]

  if (!activePattern) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
        <p className="text-2xl">📅</p>
        <p className="font-semibold text-gray-800">Set up your roster first</p>
        <p className="text-sm text-gray-500">Add your FIFO swing pattern to see your schedule</p>
        <button
          onClick={() => navigate('/settings')}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium"
        >
          Set up roster
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-gray-900">{format(navDate, 'MMMM yyyy')}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setNavDate((d) => { const n = new Date(d); n.setMonth(n.getMonth() - 1); return n })}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-lg"
          >
            ‹
          </button>
          <button
            onClick={() => setNavDate((d) => { const n = new Date(d); n.setMonth(n.getMonth() + 1); return n })}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-lg"
          >
            ›
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <RosterCalendar />
      </div>

      {(activeSheet === 'itinerary-detail' || activeSheet === 'edit-itinerary' || activeSheet === 'add-itinerary') && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={closeSheet}>
          <div
            className="w-full bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b">
              <h2 className="font-semibold text-gray-900">
                {activeSheet === 'add-itinerary' ? 'Add trip' : activeSheet === 'edit-itinerary' ? 'Edit trip' : 'Trip details'}
              </h2>
              <button onClick={closeSheet} className="text-gray-400 text-2xl leading-none">&times;</button>
            </div>
            {activeSheet === 'itinerary-detail' && selectedItinerary && (
              <ItineraryDetail itinerary={selectedItinerary} />
            )}
            {activeSheet === 'add-itinerary' && (
              <ItineraryForm onComplete={closeSheet} />
            )}
            {activeSheet === 'edit-itinerary' && selectedItinerary && (
              <ItineraryForm existing={selectedItinerary} onComplete={closeSheet} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
