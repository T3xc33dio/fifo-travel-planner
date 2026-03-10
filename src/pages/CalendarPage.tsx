import { useNavigate } from 'react-router-dom'
import { RosterCalendar } from '@/components/calendar/RosterCalendar'
import { StatsBar } from '@/components/calendar/StatsBar'
import { ItineraryDetail } from '@/components/itinerary/ItineraryDetail'
import { ItineraryForm } from '@/components/itinerary/ItineraryForm'
import { Modal } from '@/components/shared/Modal'
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

  const modalTitle =
    activeSheet === 'add-itinerary'
      ? 'Add Trip'
      : activeSheet === 'edit-itinerary'
      ? 'Edit Trip'
      : 'Trip Details'

  if (!activePattern) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 20,
          padding: 32,
          textAlign: 'center',
          background: '#0d1117',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            background: 'rgba(241,103,56,0.15)',
            border: '1px solid rgba(241,103,56,0.3)',
          }}
        >
          📅
        </div>
        <div>
          <p style={{ fontWeight: 700, color: '#e6edf3', fontSize: 18, margin: '0 0 6px' }}>Set up your roster</p>
          <p style={{ fontSize: 14, color: '#484f58', margin: 0 }}>Add your FIFO swing pattern to see your schedule</p>
        </div>
        <button
          onClick={() => navigate('/settings')}
          style={{
            padding: '12px 28px',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 700,
            color: '#fff',
            background: '#f16738',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Set up roster
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0d1117' }}>
      <StatsBar />

      <div style={{ flex: 1, minHeight: 0 }}>
        <RosterCalendar />
      </div>

      {(activeSheet === 'itinerary-detail' ||
        activeSheet === 'edit-itinerary' ||
        activeSheet === 'add-itinerary') && (
        <Modal title={modalTitle} onClose={closeSheet}>
          {activeSheet === 'itinerary-detail' && selectedItinerary && (
            <ItineraryDetail itinerary={selectedItinerary} />
          )}
          {activeSheet === 'add-itinerary' && <ItineraryForm onComplete={closeSheet} />}
          {activeSheet === 'edit-itinerary' && selectedItinerary && (
            <ItineraryForm existing={selectedItinerary} onComplete={closeSheet} />
          )}
        </Modal>
      )}
    </div>
  )
}
