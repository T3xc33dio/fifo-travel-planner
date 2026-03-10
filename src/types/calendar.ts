export type CalendarEventType = 'work' | 'rdo' | 'travel' | 'leave' | 'itinerary'

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  allDay: boolean
  type: CalendarEventType
  itineraryId?: string
  rosterKind?: string
}
