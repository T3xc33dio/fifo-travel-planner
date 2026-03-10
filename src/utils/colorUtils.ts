import type { CalendarEventType } from '@/types/calendar'

export const EVENT_COLORS: Record<CalendarEventType, { bg: string; text: string; dot: string }> = {
  work:      { bg: 'bg-blue-900',   text: 'text-blue-300',   dot: 'bg-blue-500' },
  rdo:       { bg: 'bg-green-900',  text: 'text-green-300',  dot: 'bg-green-500' },
  travel:    { bg: 'bg-amber-900',  text: 'text-amber-300',  dot: 'bg-amber-500' },
  leave:     { bg: 'bg-purple-900', text: 'text-purple-300', dot: 'bg-purple-500' },
  itinerary: { bg: 'bg-orange-900', text: 'text-orange-300', dot: 'bg-orange-500' },
  conflict:  { bg: 'bg-red-900',    text: 'text-red-300',    dot: 'bg-red-500' },
}

export function getEventColor(type: CalendarEventType) {
  return EVENT_COLORS[type]
}
