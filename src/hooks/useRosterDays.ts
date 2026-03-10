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

    // Build roster map
    const rosterMap = activePattern
      ? generateRosterDays(activePattern, overrides, rangeStart, rangeEnd)
      : new Map<string, RosterDayKind>()

    // Swing block events (one event per consecutive run)
    if (activePattern) {
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

    // Itinerary events — detect conflicts with work days
    for (const itinerary of itineraries) {
      const startDate = parseISO(itinerary.startDate)
      const endDate = parseISO(itinerary.endDate)

      if (endDate < rangeStart || startDate > rangeEnd) continue

      // Check if any day in this itinerary falls on a work day
      const days = eachDayOfInterval({ start: startDate, end: endDate })
      const hasConflict = days.some((day) => {
        const dk = format(day, 'yyyy-MM-dd')
        return rosterMap.get(dk) === 'work'
      })

      events.push({
        id: `itin-${itinerary.id}`,
        title: hasConflict ? `⚠ ${itinerary.label}` : itinerary.label,
        start: startDate,
        end: addDays(endDate, 1),
        allDay: true,
        type: hasConflict ? 'conflict' : 'itinerary',
        itineraryId: itinerary.id,
      })
    }

    return events
  }, [activePattern, overrides, itineraries, currentDate])
}
