import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { useItineraryStore } from '@/store/itineraryStore'
import { useUiStore } from '@/store/uiStore'
import { ItineraryCard } from '@/components/itinerary/ItineraryCard'
import { ItineraryDetail } from '@/components/itinerary/ItineraryDetail'
import { ItineraryForm } from '@/components/itinerary/ItineraryForm'
import { EmptyState } from '@/components/shared/EmptyState'
import { Modal } from '@/components/shared/Modal'
import { useSwingStatus } from '@/hooks/useSwingStatus'

export function TripsPage() {
  const itineraries = useItineraryStore((s) => s.itineraries)
  const activeSheet = useUiStore((s) => s.activeSheet)
  const selectedItineraryId = useUiStore((s) => s.selectedItineraryId)
  const openSheet = useUiStore((s) => s.openSheet)
  const closeSheet = useUiStore((s) => s.closeSheet)
  const status = useSwingStatus()

  const selectedItinerary = itineraries.find((i) => i.id === selectedItineraryId)
  const conflictIds = new Set(status?.conflictingTrips.map((t) => t.id) ?? [])

  const grouped = useMemo(() => {
    const sorted = [...itineraries].sort((a, b) => a.startDate.localeCompare(b.startDate))
    const map = new Map<string, typeof itineraries>()
    for (const it of sorted) {
      const key = format(parseISO(it.startDate), 'MMMM yyyy')
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(it)
    }
    return map
  }, [itineraries])

  const modalTitle =
    activeSheet === 'add-itinerary'
      ? 'Add Trip'
      : activeSheet === 'edit-itinerary'
      ? 'Edit Trip'
      : 'Trip Details'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0d1117' }}>
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: '#161b22',
          borderBottom: '1px solid #21262d',
          flexShrink: 0,
        }}
      >
        <div>
          <p style={{ fontSize: 10, color: '#484f58', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
            Scheduled
          </p>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#e6edf3', margin: '2px 0 0' }}>
            {itineraries.length} trip{itineraries.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {status && status.conflictingTrips.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 10px',
                borderRadius: 8,
                background: 'rgba(220,38,38,0.15)',
                border: '1px solid rgba(220,38,38,0.3)',
              }}
            >
              <span style={{ color: '#f87171', fontSize: 12, fontWeight: 700 }}>
                ⚠ {status.conflictingTrips.length} conflict{status.conflictingTrips.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
          <button
            onClick={() => openSheet('add-itinerary')}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#f16738',
              border: 'none',
              color: '#fff',
              fontSize: 22,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            +
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        {itineraries.length === 0 ? (
          <EmptyState
            title="No trips planned"
            description="Tap + to add your first itinerary"
            action={{ label: 'Add trip', onClick: () => openSheet('add-itinerary') }}
          />
        ) : (
          Array.from(grouped.entries()).map(([month, trips]) => (
            <div key={month} style={{ marginBottom: 24 }}>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: '#484f58',
                  marginBottom: 8,
                }}
              >
                {month}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {trips.map((trip) => (
                  <ItineraryCard
                    key={trip.id}
                    itinerary={trip}
                    isConflict={conflictIds.has(trip.id)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
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
