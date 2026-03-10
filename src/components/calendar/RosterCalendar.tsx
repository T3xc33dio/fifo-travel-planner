import { useState, useCallback } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay, addMonths } from 'date-fns'
import { enAU } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useRosterDays } from '@/hooks/useRosterDays'
import { useUiStore } from '@/store/uiStore'
import { useItineraryStore } from '@/store/itineraryStore'
import { toDateKey } from '@/utils/dateUtils'
import type { CalendarEvent } from '@/types/calendar'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { 'en-AU': enAU },
})

const EVENT_STYLES: Record<string, { bg: string; text: string }> = {
  work:     { bg: 'rgba(23, 146, 216, 0.35)',  text: '#7dd3fc' },
  rdo:      { bg: 'rgba(34, 197, 94,  0.35)',  text: '#86efac' },
  travel:   { bg: 'rgba(245, 158, 11, 0.35)', text: '#fcd34d' },
  leave:    { bg: 'rgba(168, 85, 247, 0.35)', text: '#d8b4fe' },
  itinerary:{ bg: '#f16738',                  text: '#fff' },
  conflict: { bg: '#dc2626',                  text: '#fff' },
}

const LEGEND = [
  { color: 'rgba(23,146,216,0.6)',  label: 'Work swing' },
  { color: 'rgba(34,197,94,0.6)',   label: 'R&R' },
  { color: '#f16738',               label: 'Trip' },
  { color: '#dc2626',               label: 'Conflict' },
]

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

  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      if (event.itineraryId) {
        setSelectedDate(toDateKey(event.start))
        openSheet('itinerary-detail', event.itineraryId)
      }
    },
    [openSheet, setSelectedDate],
  )

  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const style = EVENT_STYLES[event.type] ?? EVENT_STYLES.rdo
    return {
      style: {
        backgroundColor: style.bg,
        color: style.text,
        border: 'none',
        fontSize: '9px',
        fontWeight: '700',
        padding: '1px 4px',
        borderRadius: '3px',
        letterSpacing: '0.05em',
        textTransform: 'uppercase' as const,
      },
    }
  }, [])

  return (
    <div className="flex flex-col h-full" style={{ background: '#0d1117' }}>
      {/* Month navigation */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ borderColor: '#30363d', background: '#161b22' }}
      >
        <button
          onClick={() => setCurrentDate((d) => addMonths(d, -1))}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 text-2xl active:bg-gray-700"
        >
          ‹
        </button>
        <span className="font-bold text-gray-100 text-base tracking-wide">
          {format(currentDate, 'MMMM yyyy').toUpperCase()}
        </span>
        <button
          onClick={() => setCurrentDate((d) => addMonths(d, 1))}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 text-2xl active:bg-gray-700"
        >
          ›
        </button>
      </div>

      {/* Legend */}
      <div
        className="flex gap-4 px-4 py-1.5 border-b"
        style={{ borderColor: '#30363d', background: '#161b22' }}
      >
        {LEGEND.map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">{label}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 px-1 pb-1 min-h-0">
        <Calendar
          localizer={localizer}
          events={events}
          date={currentDate}
          onNavigate={setCurrentDate}
          view="month"
          views={['month']}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          style={{ height: '100%' }}
          toolbar={false}
        />
      </div>
    </div>
  )
}
