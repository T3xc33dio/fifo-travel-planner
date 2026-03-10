import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { useItineraryStore } from '@/store/itineraryStore'
import { useUiStore } from '@/store/uiStore'
import { ItineraryCard } from '@/components/itinerary/ItineraryCard'
import { ItineraryDetail } from '@/components/itinerary/ItineraryDetail'
import { ItineraryForm } from '@/components/itinerary/ItineraryForm'
import { EmptyState } from '@/components/shared/EmptyState'

export function TripsPage() {
  const itineraries = useItineraryStore((s) => s.itineraries)
  const activeSheet = useUiStore((s) => s.activeSheet)
  const selectedItineraryId = useUiStore((s) => s.selectedItineraryId)
  const openSheet = useUiStore((s) => s.openSheet)
  const closeSheet = useUiStore((s) => s.closeSheet)

  const selectedItinerary = itineraries.find((i) => i.id === selectedItineraryId)

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
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-gray-900">Trips</h1>
        <button
          onClick={() => openSheet('add-itinerary')}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 text-white text-xl"
        >
          +
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {itineraries.length === 0 ? (
          <EmptyState
            title="No trips yet"
            description="Tap + to add your first itinerary"
            action={{ label: 'Add trip', onClick: () => openSheet('add-itinerary') }}
          />
        ) : (
          Array.from(grouped.entries()).map(([month, trips]) => (
            <div key={month} className="mb-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{month}</p>
              <div className="flex flex-col gap-3">
                {trips.map((trip) => (
                  <ItineraryCard key={trip.id} itinerary={trip} />
                ))}
              </div>
            </div>
          ))
        )}
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
