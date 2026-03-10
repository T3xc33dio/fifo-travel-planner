import { format, parseISO } from 'date-fns'
import { useSwingStatus } from '@/hooks/useSwingStatus'

const KIND_LABEL: Record<string, string> = {
  work: 'ON SWING',
  rdo: 'R&R',
  travel: 'TRAVEL',
  leave: 'LEAVE',
}

const KIND_COLOR: Record<string, { dot: string; text: string; bg: string }> = {
  work:   { dot: 'bg-blue-500',   text: 'text-blue-400',  bg: 'border-blue-800' },
  rdo:    { dot: 'bg-green-500',  text: 'text-green-400', bg: 'border-green-800' },
  travel: { dot: 'bg-amber-500',  text: 'text-amber-400', bg: 'border-amber-800' },
  leave:  { dot: 'bg-purple-500', text: 'text-purple-400',bg: 'border-purple-800' },
}

export function StatsBar() {
  const status = useSwingStatus()

  if (!status) return null

  const colors = KIND_COLOR[status.currentKind] ?? KIND_COLOR.rdo
  const conflictCount = status.conflictingTrips.length

  return (
    <div className="grid grid-cols-4 gap-2 px-3 py-2 bg-[#161b22] border-b border-[#30363d]">
      {/* Current phase */}
      <div className={`flex flex-col gap-0.5 bg-[#0d1117] rounded-lg px-3 py-2 border ${colors.bg}`}>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Status</span>
        </div>
        <span className={`text-sm font-bold ${colors.text}`}>
          {KIND_LABEL[status.currentKind]}
        </span>
      </div>

      {/* Days remaining */}
      <div className="flex flex-col gap-0.5 bg-[#0d1117] rounded-lg px-3 py-2 border border-[#30363d]">
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Days left</span>
        <span className="text-sm font-bold text-gray-100">{status.daysRemaining}d</span>
        <span className="text-[9px] text-gray-600 truncate">
          until {format(parseISO(status.nextChangeDate), 'd MMM')}
        </span>
      </div>

      {/* Next trip */}
      <div className="flex flex-col gap-0.5 bg-[#0d1117] rounded-lg px-3 py-2 border border-[#30363d]">
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Next trip</span>
        {status.nextTrip ? (
          <>
            <span className="text-sm font-bold text-[#f16738] truncate leading-tight">
              {format(parseISO(status.nextTrip.startDate), 'd MMM')}
            </span>
            <span className="text-[9px] text-gray-600 truncate">{status.nextTrip.label}</span>
          </>
        ) : (
          <span className="text-sm text-gray-600">None</span>
        )}
      </div>

      {/* Conflicts */}
      <div className={`flex flex-col gap-0.5 rounded-lg px-3 py-2 border ${
        conflictCount > 0
          ? 'bg-red-950 border-red-800'
          : 'bg-[#0d1117] border-[#30363d]'
      }`}>
        <span className={`text-[10px] font-semibold uppercase tracking-wide ${
          conflictCount > 0 ? 'text-red-400' : 'text-gray-500'
        }`}>Conflicts</span>
        <span className={`text-sm font-bold ${conflictCount > 0 ? 'text-red-400' : 'text-gray-600'}`}>
          {conflictCount === 0 ? 'None' : `${conflictCount} trip${conflictCount > 1 ? 's' : ''}`}
        </span>
        {conflictCount > 0 && (
          <span className="text-[9px] text-red-600">Travel vs work day</span>
        )}
      </div>
    </div>
  )
}
