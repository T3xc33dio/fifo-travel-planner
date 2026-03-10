import { format, parseISO } from 'date-fns'
import { useSwingStatus } from '@/hooks/useSwingStatus'

const KIND_LABEL: Record<string, string> = {
  work: 'ON SWING',
  rdo: 'R&R',
  travel: 'TRAVEL',
  leave: 'LEAVE',
}

const KIND_ACCENT: Record<string, string> = {
  work:   '#1792d8',
  rdo:    '#22c55e',
  travel: '#f59e0b',
  leave:  '#a855f7',
}

export function StatsBar() {
  const status = useSwingStatus()
  if (!status) return null

  const accent = KIND_ACCENT[status.currentKind] ?? '#8b949e'
  const conflictCount = status.conflictingTrips.length

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 8,
        padding: '10px 12px',
        background: '#161b22',
        borderBottom: '1px solid #21262d',
        flexShrink: 0,
      }}
    >
      {/* Status */}
      <div
        style={{
          background: '#0d1117',
          borderRadius: 12,
          padding: '10px 12px',
          border: `1px solid ${accent}40`,
          borderLeft: `3px solid ${accent}`,
        }}
      >
        <p style={{ fontSize: 9, fontWeight: 600, color: '#484f58', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>Status</p>
        <p style={{ fontSize: 12, fontWeight: 800, color: accent, margin: 0, lineHeight: 1 }}>
          {KIND_LABEL[status.currentKind]}
        </p>
      </div>

      {/* Days remaining */}
      <div
        style={{
          background: '#0d1117',
          borderRadius: 12,
          padding: '10px 12px',
          border: '1px solid #21262d',
        }}
      >
        <p style={{ fontSize: 9, fontWeight: 600, color: '#484f58', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>Days left</p>
        <p style={{ fontSize: 12, fontWeight: 800, color: '#e6edf3', margin: '0 0 2px', lineHeight: 1 }}>
          {status.daysRemaining}d
        </p>
        <p style={{ fontSize: 9, color: '#484f58', margin: 0 }}>
          until {format(parseISO(status.nextChangeDate), 'd MMM')}
        </p>
      </div>

      {/* Next trip */}
      <div
        style={{
          background: '#0d1117',
          borderRadius: 12,
          padding: '10px 12px',
          border: '1px solid #21262d',
        }}
      >
        <p style={{ fontSize: 9, fontWeight: 600, color: '#484f58', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>Next trip</p>
        {status.nextTrip ? (
          <>
            <p style={{ fontSize: 12, fontWeight: 800, color: '#f16738', margin: '0 0 2px', lineHeight: 1 }}>
              {format(parseISO(status.nextTrip.startDate), 'd MMM')}
            </p>
            <p style={{ fontSize: 9, color: '#484f58', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {status.nextTrip.label}
            </p>
          </>
        ) : (
          <p style={{ fontSize: 12, color: '#30363d', margin: 0 }}>None</p>
        )}
      </div>

      {/* Conflicts */}
      <div
        style={{
          background: conflictCount > 0 ? 'rgba(220,38,38,0.1)' : '#0d1117',
          borderRadius: 12,
          padding: '10px 12px',
          border: conflictCount > 0 ? '1px solid rgba(220,38,38,0.4)' : '1px solid #21262d',
          borderLeft: conflictCount > 0 ? '3px solid #dc2626' : '1px solid #21262d',
        }}
      >
        <p style={{ fontSize: 9, fontWeight: 600, color: conflictCount > 0 ? '#f87171' : '#484f58', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>
          Conflicts
        </p>
        <p style={{ fontSize: 12, fontWeight: 800, color: conflictCount > 0 ? '#f87171' : '#30363d', margin: 0, lineHeight: 1 }}>
          {conflictCount === 0 ? 'None' : `${conflictCount}`}
        </p>
        {conflictCount > 0 && (
          <p style={{ fontSize: 9, color: '#dc2626', margin: '2px 0 0' }}>trip{conflictCount > 1 ? 's' : ''} overlap</p>
        )}
      </div>
    </div>
  )
}
