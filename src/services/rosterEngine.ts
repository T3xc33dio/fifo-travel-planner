import { addDays, differenceInCalendarDays, format, parseISO } from 'date-fns'
import type { RosterDayKind, RosterDayOverride, SwingPattern } from '@/types/roster'

export function generateRosterDays(
  pattern: SwingPattern,
  overrides: RosterDayOverride[],
  startDate: Date,
  endDate: Date,
): Map<string, RosterDayKind> {
  const result = new Map<string, RosterDayKind>()
  const patternStart = parseISO(pattern.startDate)
  const cycleLength = pattern.daysOn + pattern.daysOff

  let current = startDate
  while (current <= endDate) {
    const key = format(current, 'yyyy-MM-dd')
    const offset = differenceInCalendarDays(current, patternStart)
    const positionInCycle = ((offset % cycleLength) + cycleLength) % cycleLength

    let kind: RosterDayKind
    if (pattern.cycleStartPhase === 'on') {
      kind = positionInCycle < pattern.daysOn ? 'work' : 'rdo'
    } else {
      kind = positionInCycle < pattern.daysOff ? 'rdo' : 'work'
    }

    result.set(key, kind)
    current = addDays(current, 1)
  }

  for (const override of overrides) {
    if (result.has(override.date)) {
      result.set(override.date, override.kind)
    }
  }

  return result
}
