import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { useItineraryStore } from '@/store/itineraryStore'
import { useUiStore } from '@/store/uiStore'
import { ItineraryCard } from '@/components/itinerary/ItineraryCard'
import { ItineraryDetail } from '@/components/itinerary/ItineraryDetail'
import { ItineraryForm } from '@/components/itinerary/ItineraryForm'
import { EmptyState } from '@/components/shared/EmptyState'
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

  return (
    <div className="flex flex-col h-full" style={{ background: '#0d1117' }}>
      {/* Header row */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ background: '#161b22', borderColor: '#30363d' }}
      >
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Scheduled</p>
          <p className="font-bold text-gray-100">{itineraries.length} trip{itineraries.length !== 1 ? 's' : ''}</p>
        </div>
        {status && status.conflictingTrips.length > 0 && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)' }}
          >
            <span className="text-red-400 text-xs font-bold">
              ⚠ {status.conflictingTrips.length} conflict{status.conflictingTrips.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
        <button
          onClick={() => openSheet('add-itinerary')}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-white text-xl font-bold"
          style={{ background: '#f16738' }}
        >
          +
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {itineraries.length === 0 ? (
          <EmptyState
            title="No trips planned"
            description="Tap + to add your first itinerary"
            action={{ label: 'Add trip', onClick: () => openSheet('add-itinerary') }}
          />
        ) : (
          Array.from(grouped.entries()).map(([month, trips]) => (
            <div key={month} className="mb-6">
              <p
                className="text-[10px] font-bold uppercase tracking-widest mb-2"
                style={{ color: '#484f58' }}
              >
                {month}
              </p>
              <div className="flex flex-col gap-2">
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
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: '#30363d' }} />
            </div>
            <div
              className="flex items-center justify-between px-4 pb-3 border-b"
              style={{ borderColor: '#30363d' }}
            >
              <h2 className="font-bold text-gray-100">
                {activeSheet === 'add-itinerary' ? 'Add Trip' : activeSheet === 'edit-itinerary' ? 'Edit Trip' : 'Trip Details'}
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
