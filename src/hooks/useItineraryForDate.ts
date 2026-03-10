import { useMemo } from 'react'
import { parseISO, isWithinInterval } from 'date-fns'
import { useItineraryStore } from '@/store/itineraryStore'
import type { Itinerary } from '@/types/itinerary'

export function useItineraryForDate(dateKey: string | null): Itinerary[] {
  const itineraries = useItineraryStore((s) => s.itineraries)

  return useMemo(() => {
    if (!dateKey) return []
    const date = parseISO(dateKey)
    return itineraries.filter((it) =>
      isWithinInterval(date, { start: parseISO(it.startDate), end: parseISO(it.endDate) }),
    )
  }, [itineraries, dateKey])
}
