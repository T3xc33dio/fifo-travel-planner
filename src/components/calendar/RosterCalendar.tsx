import { useState, useCallback } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enAU } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useRosterDays } from '@/hooks/useRosterDays'
import { useUiStore } from '@/store/uiStore'
import { useItineraryStore } from '@/store/itineraryStore'
import { toDateKey } from '@/utils/dateUtils'
import { CalendarLegend } from './CalendarLegend'
import type { CalendarEvent } from '@/types/calendar'
import { EVENT_COLORS } from '@/utils/colorUtils'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { 'en-AU': enAU },
})

export function RosterCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const events = useRosterDays(currentDate)
  const openSheet = useUiStore((s) => s.openSheet)
  const setSelectedDate = useUiStore((s) => s.setSelectedDate)
  const itineraries = useItineraryStore((s) => s.itineraries)

  const handleSelectSlot = useCallback(
    ({ start }: { start: Date }) => {
      const dateKey = toDateKey(start)
      setSelectedDate(dateKey)
      const hasItinerary = itineraries.some(
        (it) => it.startDate <= dateKey && it.endDate >= dateKey,
      )
      openSheet(hasItinerary ? 'itinerary-detail' : 'add-itinerary')
    },
    [itineraries, openSheet, setSelectedDate],
  )

  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const colors = EVENT_COLORS[event.type]
    return {
      style: {
        backgroundColor: event.type === 'itinerary' ? '#f97316' : 'transparent',
        color: event.type === 'itinerary' ? 'white' : 'transparent',
        border: 'none',
        fontSize: '10px',
        padding: '1px 3px',
        borderRadius: '3px',
      },
      className: event.type !== 'itinerary' ? `${colors.dot} opacity-0` : '',
    }
  }, [])

  const dayPropGetter = useCallback(
    (date: Date) => {
      const dateKey = toDateKey(date)
      const rosterEvent = events.find((e) => e.rosterKind && toDateKey(e.start) === dateKey)
      if (!rosterEvent) return {}
      const colors = EVENT_COLORS[rosterEvent.type]
      return { className: colors.bg }
    },
    [events],
  )

  return (
    <div className="flex flex-col h-full">
      <CalendarLegend />
      <div className="flex-1 px-2">
        <Calendar
          localizer={localizer}
          events={events.filter((e) => e.type === 'itinerary')}
          date={currentDate}
          onNavigate={setCurrentDate}
          view="month"
          views={['month']}
          selectable
          onSelectSlot={handleSelectSlot}
          eventPropGetter={eventStyleGetter}
          dayPropGetter={dayPropGetter}
          style={{ height: '100%' }}
          toolbar={false}
        />
      </div>
    </div>
  )
}
