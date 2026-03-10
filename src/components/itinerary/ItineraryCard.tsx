import type { Itinerary } from '@/types/itinerary'
import { formatDateRange } from '@/utils/dateUtils'
import { useUiStore } from '@/store/uiStore'

interface Props {
  itinerary: Itinerary
}

const TRIP_TYPE_LABELS: Record<Itinerary['tripType'], string> = {
  fly_in: 'Fly In',
  fly_out: 'Fly Out',
  personal: 'Personal',
  other: 'Other',
}

export function ItineraryCard({ itinerary }: Props) {
  const openSheet = useUiStore((s) => s.openSheet)

  return (
    <button
      onClick={() => openSheet('itinerary-detail', itinerary.id)}
      className="w-full text-left bg-gray-800 rounded-2xl p-4 border border-gray-700 active:bg-gray-750"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-100 truncate">{itinerary.label}</p>
          <p className="text-sm text-gray-400 mt-0.5">
            {formatDateRange(itinerary.startDate, itinerary.endDate)}
          </p>
        </div>
        <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded-full shrink-0">
          {TRIP_TYPE_LABELS[itinerary.tripType]}
        </span>
      </div>
      {itinerary.flightLegs.length > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          {itinerary.flightLegs.map((l) => `${l.departureAirport}→${l.arrivalAirport}`).join(', ')}
        </p>
      )}
    </button>
  )
}
