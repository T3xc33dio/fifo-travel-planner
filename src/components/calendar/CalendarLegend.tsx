import { EVENT_COLORS } from '@/utils/colorUtils'
import type { CalendarEventType } from '@/types/calendar'

const LEGEND: Array<{ type: CalendarEventType; label: string }> = [
  { type: 'work', label: 'Work' },
  { type: 'rdo', label: 'RDO' },
  { type: 'travel', label: 'Travel' },
  { type: 'leave', label: 'Leave' },
  { type: 'itinerary', label: 'Trip' },
]

export function CalendarLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 px-4 py-2 text-xs">
      {LEGEND.map(({ type, label }) => (
        <div key={type} className="flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${EVENT_COLORS[type].dot}`} />
          <span className="text-gray-600">{label}</span>
        </div>
      ))}
    </div>
  )
}
