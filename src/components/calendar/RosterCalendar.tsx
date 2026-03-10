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

const SWING_COLORS: Record<string, { bg: string; text: string }> = {
  work:   { bg: 'rgba(59, 130, 246, 0.45)', text: '#bfdbfe' },
  rdo:    { bg: 'rgba(34, 197, 94,  0.40)', text: '#bbf7d0' },
  travel: { bg: 'rgba(245, 158, 11, 0.40)', text: '#fde68a' },
  leave:  { bg: 'rgba(168, 85, 247, 0.40)', text: '#e9d5ff' },
}

const LEGEND = [
  { color: 'rgba(59,130,246,0.6)',  label: 'Work' },
  { color: 'rgba(34,197,94,0.6)',   label: 'RDO' },
  { color: 'rgba(245,158,11,0.6)', label: 'Travel' },
  { color: '#ea580c',               label: 'Trip' },
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

  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    if (event.type === 'itinerary') {
      return {
        style: {
          backgroundColor: '#ea580c',
          color: 'white',
          border: 'none',
          fontSize: '10px',
          padding: '2px 4px',
          borderRadius: '3px',
          fontWeight: '600',
        },
      }
    }
    const colors = SWING_COLORS[event.type] ?? { bg: 'rgba(100,100,100,0.3)', text: '#ccc' }
    return {
      style: {
        backgroundColor: colors.bg,
        color: colors.text,
        border: 'none',
        fontSize: '9px',
        fontWeight: '700',
        padding: '1px 3px',
        borderRadius: '3px',
        letterSpacing: '0.06em',
        textTransform: 'uppercase' as const,
      },
    }
  }, [])

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Month navigation */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
        <button
          onClick={() => setCurrentDate((d) => addMonths(d, -1))}
          className="w-9 h-9 flex items-center justify-center rounded-full text-gray-300 text-2xl active:bg-gray-700"
        >
          ‹
        </button>
        <span className="font-semibold text-gray-100 text-base">
          {format(currentDate, 'MMMM yyyy')}
        </span>
        <button
          onClick={() => setCurrentDate((d) => addMonths(d, 1))}
          className="w-9 h-9 flex items-center justify-center rounded-full text-gray-300 text-2xl active:bg-gray-700"
        >
          ›
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-4 px-3 py-1.5">
        {LEGEND.map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
            <span className="text-xs text-gray-400">{label}</span>
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
          eventPropGetter={eventStyleGetter}
          style={{ height: '100%' }}
          toolbar={false}
        />
      </div>
    </div>
  )
}
