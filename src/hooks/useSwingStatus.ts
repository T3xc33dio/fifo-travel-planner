import { useMemo } from 'react'
import { format, parseISO, addDays, eachDayOfInterval } from 'date-fns'
import { useRosterStore } from '@/store/rosterStore'
import { useItineraryStore } from '@/store/itineraryStore'
import { generateRosterDays } from '@/services/rosterEngine'
import type { Itinerary } from '@/types/itinerary'

export interface SwingStatus {
  currentKind: 'work' | 'rdo' | 'travel' | 'leave'
  daysRemaining: number
  nextChangeDate: string
  conflictingTrips: Itinerary[]
  nextTrip: Itinerary | null
}

export function useSwingStatus(): SwingStatus | null {
  const activePattern = useRosterStore((s) => s.activePattern)
  const overrides = useRosterStore((s) => s.overrides)
  const itineraries = useItineraryStore((s) => s.itineraries)

  return useMemo(() => {
    if (!activePattern) return null

    const today = new Date()
    const todayKey = format(today, 'yyyy-MM-dd')
    const lookAhead = addDays(today, 90)

    const rosterMap = generateRosterDays(activePattern, overrides, today, lookAhead)
    const currentKind = (rosterMap.get(todayKey) ?? 'rdo') as SwingStatus['currentKind']

    // Count days remaining in current phase
    let daysRemaining = 0
    let checkDate = today
    while (daysRemaining < 90) {
      const dk = format(checkDate, 'yyyy-MM-dd')
      if (rosterMap.get(dk) !== currentKind) break
      daysRemaining++
      checkDate = addDays(checkDate, 1)
    }
    const nextChangeDate = format(checkDate, 'yyyy-MM-dd')

    // Find trips that conflict (any day of trip overlaps a work day)
    const conflictingTrips = itineraries.filter((it) => {
      const days = eachDayOfInterval({
        start: parseISO(it.startDate),
        end: parseISO(it.endDate),
      })
      return days.some((d) => rosterMap.get(format(d, 'yyyy-MM-dd')) === 'work')
    })

    // Next upcoming trip
    const nextTrip =
      [...itineraries]
        .filter((it) => it.endDate >= todayKey)
        .sort((a, b) => a.startDate.localeCompare(b.startDate))[0] ?? null

    return { currentKind, daysRemaining, nextChangeDate, conflictingTrips, nextTrip }
  }, [activePattern, overrides, itineraries])
}
