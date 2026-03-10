import type { Itinerary } from '@/types/itinerary'
import { formatDateRange } from '@/utils/dateUtils'
import { useUiStore } from '@/store/uiStore'

interface Props {
  itinerary: Itinerary
  isConflict?: boolean
}

const TRIP_TYPE_LABELS: Record<Itinerary['tripType'], string> = {
  fly_in: 'Fly In',
  fly_out: 'Fly Out',
  personal: 'Personal',
  other: 'Other',
}

export function ItineraryCard({ itinerary, isConflict = false }: Props) {
  const openSheet = useUiStore((s) => s.openSheet)

  return (
    <button
      onClick={() => openSheet('itinerary-detail', itinerary.id)}
      className="w-full text-left rounded-xl p-3 border transition-colors"
      style={{
        background: isConflict ? 'rgba(220,38,38,0.08)' : '#161b22',
        borderColor: isConflict ? 'rgba(220,38,38,0.4)' : '#30363d',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {isConflict && (
              <span className="text-red-400 text-xs font-bold shrink-0">⚠</span>
            )}
            <p className="font-semibold truncate" style={{ color: isConflict ? '#f87171' : '#e6edf3' }}>
              {itinerary.label}
            </p>
          </div>
          <p className="text-xs mt-0.5" style={{ color: '#484f58' }}>
            {formatDateRange(itinerary.startDate, itinerary.endDate)}
          </p>
          {isConflict && (
            <p className="text-xs text-red-500 mt-1 font-medium">Overlaps with work swing</p>
          )}
        </div>
        <span
          className="text-[10px] px-2 py-1 rounded-full shrink-0 font-semibold"
          style={{
            background: isConflict ? 'rgba(220,38,38,0.2)' : 'rgba(241,103,56,0.15)',
            color: isConflict ? '#f87171' : '#f16738',
          }}
        >
          {TRIP_TYPE_LABELS[itinerary.tripType]}
        </span>
      </div>
      {itinerary.flightLegs.length > 0 && (
        <p className="text-xs mt-2" style={{ color: '#30363d' }}>
          {itinerary.flightLegs.map((l) => `${l.departureAirport}→${l.arrivalAirport}`).join('  ·  ')}
        </p>
      )}
    </button>
  )
}
