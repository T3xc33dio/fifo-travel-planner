import { useMemo } from 'react'
import { addMonths, startOfMonth, endOfMonth } from 'date-fns'
import { useRosterStore } from '@/store/rosterStore'
import { useItineraryStore } from '@/store/itineraryStore'
import { generateRosterDays } from '@/services/rosterEngine'
import type { CalendarEvent } from '@/types/calendar'
import { parseISO, format, eachDayOfInterval } from 'date-fns'

export function useRosterDays(currentDate: Date): CalendarEvent[] {
  const activePattern = useRosterStore((s) => s.activePattern)
  const overrides = useRosterStore((s) => s.overrides)
  const itineraries = useItineraryStore((s) => s.itineraries)

  return useMemo(() => {
    const rangeStart = startOfMonth(addMonths(currentDate, -1))
    const rangeEnd = endOfMonth(addMonths(currentDate, 1))
    const events: CalendarEvent[] = []

    if (activePattern) {
      const rosterMap = generateRosterDays(activePattern, overrides, rangeStart, rangeEnd)
      for (const [dateKey, kind] of rosterMap) {
        const date = parseISO(dateKey)
        events.push({
          id: `roster-${dateKey}`,
          title: kind === 'work' ? 'Work' : kind === 'rdo' ? 'RDO' : kind === 'travel' ? 'Travel' : 'Leave',
          start: date,
          end: date,
          allDay: true,
          type: kind,
          rosterKind: kind,
        })
      }
    }

    for (const itinerary of itineraries) {
      const days = eachDayOfInterval({
        start: parseISO(itinerary.startDate),
        end: parseISO(itinerary.endDate),
      })
      for (const day of days) {
        const dateKey = format(day, 'yyyy-MM-dd')
        if (day >= rangeStart && day <= rangeEnd) {
          events.push({
            id: `itin-${itinerary.id}-${dateKey}`,
            title: itinerary.label,
            start: day,
            end: day,
            allDay: true,
            type: 'itinerary',
            itineraryId: itinerary.id,
          })
        }
      }
    }

    return events
  }, [activePattern, overrides, itineraries, currentDate])
}
