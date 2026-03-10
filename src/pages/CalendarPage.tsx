import { useNavigate } from 'react-router-dom'
import { RosterCalendar } from '@/components/calendar/RosterCalendar'
import { StatsBar } from '@/components/calendar/StatsBar'
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
      <div
        className="flex flex-col items-center justify-center h-full gap-5 p-8 text-center"
        style={{ background: '#0d1117' }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{ background: 'rgba(241,103,56,0.15)', border: '1px solid rgba(241,103,56,0.3)' }}
        >
          📅
        </div>
        <div>
          <p className="font-bold text-gray-100 text-lg">Set up your roster</p>
          <p className="text-sm text-gray-500 mt-1">Add your FIFO swing pattern to see your schedule</p>
        </div>
        <button
          onClick={() => navigate('/settings')}
          className="px-6 py-3 rounded-xl text-sm font-semibold text-white"
          style={{ background: '#f16738' }}
        >
          Set up roster
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#0d1117' }}>
      {/* Stats dashboard bar */}
      <StatsBar />

      {/* Calendar — takes remaining height */}
      <div className="flex-1 min-h-0">
        <RosterCalendar />
      </div>

      {/* Bottom sheet for add/view/edit */}
      {(activeSheet === 'itinerary-detail' ||
        activeSheet === 'edit-itinerary' ||
        activeSheet === 'add-itinerary') && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={closeSheet}
        >
          <div
            className="w-full rounded-t-2xl max-h-[85vh] overflow-y-auto border-t"
            style={{ background: '#161b22', borderColor: '#30363d' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: '#30363d' }} />
            </div>
            <div
              className="flex items-center justify-between px-4 pb-3 border-b"
              style={{ borderColor: '#30363d' }}
            >
              <h2 className="font-bold text-gray-100 tracking-wide">
                {activeSheet === 'add-itinerary'
                  ? 'Add Trip'
                  : activeSheet === 'edit-itinerary'
                  ? 'Edit Trip'
                  : 'Trip Details'}
              </h2>
              <button
                onClick={closeSheet}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 text-xl"
                style={{ background: '#0d1117' }}
              >
                ✕
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
