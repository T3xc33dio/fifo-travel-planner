import type { CalendarEventType } from '@/types/calendar'

export const EVENT_COLORS: Record<CalendarEventType, { bg: string; text: string; dot: string }> = {
  work: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
  rdo: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  travel: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
  leave: { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500' },
  itinerary: { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },
}

export function getEventColor(type: CalendarEventType) {
  return EVENT_COLORS[type]
}
