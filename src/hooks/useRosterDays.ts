import { useMemo } from 'react'
import { addMonths, startOfMonth, endOfMonth, addDays, parseISO, format, eachDayOfInterval } from 'date-fns'
import { useRosterStore } from '@/store/rosterStore'
import { useItineraryStore } from '@/store/itineraryStore'
import { generateRosterDays } from '@/services/rosterEngine'
import type { CalendarEvent } from '@/types/calendar'
import type { RosterDayKind } from '@/types/roster'

function groupIntoRanges(
  rosterMap: Map<string, RosterDayKind>,
): Array<{ start: string; end: string; kind: RosterDayKind }> {
  const sorted = [...rosterMap.entries()].sort(([a], [b]) => a.localeCompare(b))
  const runs: Array<{ start: string; end: string; kind: RosterDayKind }> = []
  for (const [dateKey, kind] of sorted) {
    const last = runs[runs.length - 1]
    if (last && last.kind === kind) {
      last.end = dateKey
    } else {
      runs.push({ start: dateKey, end: dateKey, kind })
    }
  }
  return runs
}

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
      const ranges = groupIntoRanges(rosterMap)
      for (const run of ranges) {
        events.push({
          id: `roster-${run.start}`,
          title: run.kind === 'work' ? 'WORK' : run.kind === 'rdo' ? 'RDO' : run.kind === 'travel' ? 'TRAVEL' : 'LEAVE',
          start: parseISO(run.start),
          end: addDays(parseISO(run.end), 1),
          allDay: true,
          type: run.kind,
          rosterKind: run.kind,
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
