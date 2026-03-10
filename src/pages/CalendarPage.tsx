import { useNavigate } from 'react-router-dom'
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

  const selectedItinerary =
    itineraries.find((i) => i.id === selectedItineraryId) ?? itinerariesForDate[0]

  if (!activePattern) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
        <p className="text-3xl">📅</p>
        <p className="font-semibold text-gray-100">Set up your roster first</p>
        <p className="text-sm text-gray-400">Add your FIFO swing pattern to see your schedule</p>
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
      <div className="flex-1 min-h-0">
        <RosterCalendar />
      </div>

      {(activeSheet === 'itinerary-detail' ||
        activeSheet === 'edit-itinerary' ||
        activeSheet === 'add-itinerary') && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-end"
          onClick={closeSheet}
        >
          <div
            className="w-full bg-gray-800 rounded-t-2xl max-h-[85vh] overflow-y-auto border-t border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-gray-700">
              <h2 className="font-semibold text-gray-100">
                {activeSheet === 'add-itinerary'
                  ? 'Add trip'
                  : activeSheet === 'edit-itinerary'
                  ? 'Edit trip'
                  : 'Trip details'}
              </h2>
              <button onClick={closeSheet} className="text-gray-400 text-2xl leading-none">
                &times;
              </button>
            </div>
            {activeSheet === 'itinerary-detail' && selectedItinerary && (
              <ItineraryDetail itinerary={selectedItinerary} />
            )}
            {activeSheet === 'add-itinerary' && <ItineraryForm onComplete={closeSheet} />}
            {activeSheet === 'edit-itinerary' && selectedItinerary && (
              <ItineraryForm existing={selectedItinerary} onComplete={closeSheet} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
