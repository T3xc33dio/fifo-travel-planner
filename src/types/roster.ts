import { z } from 'zod'

export const SwingPatternSchema = z.object({
  id: z.string().uuid(),
  label: z.string().min(1).max(60),
  daysOn: z.number().int().min(1).max(60),
  daysOff: z.number().int().min(1).max(60),
  startDate: z.string(),
  cycleStartPhase: z.enum(['on', 'off']),
})
export type SwingPattern = z.infer<typeof SwingPatternSchema>

export const RosterDayKindSchema = z.enum(['work', 'rdo', 'travel', 'leave'])
export type RosterDayKind = z.infer<typeof RosterDayKindSchema>

export const RosterDayOverrideSchema = z.object({
  date: z.string(),
  kind: RosterDayKindSchema,
  note: z.string().optional(),
})
export type RosterDayOverride = z.infer<typeof RosterDayOverrideSchema>

export const PRESET_PATTERNS: Array<{ label: string; daysOn: number; daysOff: number }> = [
  { label: '2 weeks on / 1 week off', daysOn: 14, daysOff: 7 },
  { label: '2 weeks on / 2 weeks off', daysOn: 14, daysOff: 14 },
  { label: '4 weeks on / 1 week off', daysOn: 28, daysOff: 7 },
  { label: '3 weeks on / 1 week off', daysOn: 21, daysOff: 7 },
  { label: '8 days on / 6 days off', daysOn: 8, daysOff: 6 },
]
