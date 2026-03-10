import { useItineraryStore } from '@/store/itineraryStore'
import { useUiStore } from '@/store/uiStore'
import { formatDisplay, formatTime, formatDateRange } from '@/utils/dateUtils'
import type { Itinerary } from '@/types/itinerary'

interface Props {
  itinerary: Itinerary
}

export function ItineraryDetail({ itinerary }: Props) {
  const deleteItinerary = useItineraryStore((s) => s.deleteItinerary)
  const openSheet = useUiStore((s) => s.openSheet)

  return (
    <div className="flex flex-col gap-4 p-4 pb-8">
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {itinerary.tripType.replace('_', ' ')}
        </p>
        <h2 className="text-xl font-bold text-gray-900">{itinerary.label}</h2>
        <p className="text-sm text-gray-500">{formatDateRange(itinerary.startDate, itinerary.endDate)}</p>
      </div>

      {itinerary.flightLegs.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Flights</h3>
          <div className="flex flex-col gap-3">
            {itinerary.flightLegs.map((leg) => (
              <div key={leg.id} className="bg-blue-50 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-blue-800">{leg.departureAirport}</span>
                  <span className="text-gray-400 text-sm">→</span>
                  <span className="font-bold text-lg text-blue-800">{leg.arrivalAirport}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {leg.airline} {leg.flightNumber} · {formatDisplay(leg.departureDateTime)}
                </p>
                <p className="text-xs text-gray-500">
                  Departs {formatTime(leg.departureDateTime)} · Arrives {formatTime(leg.arrivalDateTime)}
                </p>
                {leg.bookingReference && (
                  <p className="text-xs text-gray-500 mt-1">Ref: {leg.bookingReference}</p>
                )}
                {leg.seatNumber && <p className="text-xs text-gray-500">Seat: {leg.seatNumber}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {itinerary.accommodations.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Accommodation</h3>
          <div className="flex flex-col gap-3">
            {itinerary.accommodations.map((acc) => (
              <div key={acc.id} className="bg-purple-50 rounded-xl p-3">
                <p className="font-medium text-gray-900">{acc.name}</p>
                <p className="text-xs text-gray-600">
                  Check-in: {formatDisplay(acc.checkIn)} · Check-out: {formatDisplay(acc.checkOut)}
                </p>
                {acc.confirmationNumber && (
                  <p className="text-xs text-gray-500">Conf: {acc.confirmationNumber}</p>
                )}
                {acc.address && <p className="text-xs text-gray-500">{acc.address}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {itinerary.notes && (
        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Notes</h3>
          <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">{itinerary.notes}</p>
        </section>
      )}

      <div className="flex gap-3 mt-2">
        <button
          onClick={() => openSheet('edit-itinerary', itinerary.id)}
          className="flex-1 py-2.5 rounded-xl border border-blue-600 text-blue-600 text-sm font-medium"
        >
          Edit
        </button>
        <button
          onClick={() => {
            void deleteItinerary(itinerary.id)
          }}
          className="flex-1 py-2.5 rounded-xl border border-red-500 text-red-500 text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
