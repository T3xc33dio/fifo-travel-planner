import { useState } from 'react'
import { useRosterStore } from '@/store/rosterStore'
import { useItineraryStore } from '@/store/itineraryStore'
import { RosterSetup } from '@/components/roster/RosterSetup'
import { Modal } from '@/components/shared/Modal'

export function SettingsPage() {
  const activePattern = useRosterStore((s) => s.activePattern)
  const itineraries = useItineraryStore((s) => s.itineraries)
  const [editingRoster, setEditingRoster] = useState(!activePattern)

  const handleExport = () => {
    const data = { pattern: activePattern, itineraries, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fifo-planner-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: '16px',
        minHeight: '100%',
        background: '#0d1117',
      }}
    >
      {/* ── Roster Pattern card ── */}
      <section
        style={{
          borderRadius: 16,
          border: '1px solid #21262d',
          background: '#161b22',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            borderBottom: '1px solid #21262d',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 18, borderRadius: 2, background: '#1792d8' }} />
            <h2 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#e6edf3', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Roster Pattern
            </h2>
          </div>
          {activePattern && (
            <button
              onClick={() => setEditingRoster(true)}
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#f16738',
                background: 'rgba(241,103,56,0.12)',
                border: '1px solid rgba(241,103,56,0.25)',
                borderRadius: 8,
                padding: '5px 12px',
                cursor: 'pointer',
              }}
            >
              Edit
            </button>
          )}
        </div>

        {activePattern ? (
          <div style={{ padding: '16px' }}>
            <p style={{ fontWeight: 700, color: '#e6edf3', margin: '0 0 12px', fontSize: 15 }}>
              {activePattern.label}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: 12,
                  background: 'rgba(23,146,216,0.08)',
                  border: '1px solid rgba(23,146,216,0.2)',
                }}
              >
                <span style={{ fontSize: 28, fontWeight: 800, color: '#1792d8', lineHeight: 1 }}>
                  {activePattern.daysOn}
                </span>
                <span style={{ fontSize: 10, color: '#484f58', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>
                  Days On
                </span>
              </div>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: 12,
                  background: 'rgba(34,197,94,0.08)',
                  border: '1px solid rgba(34,197,94,0.2)',
                }}
              >
                <span style={{ fontSize: 28, fontWeight: 800, color: '#22c55e', lineHeight: 1 }}>
                  {activePattern.daysOff}
                </span>
                <span style={{ fontSize: 10, color: '#484f58', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>
                  Days Off
                </span>
              </div>
            </div>
            <p style={{ fontSize: 12, color: '#484f58', margin: '12px 0 0' }}>
              Starting {activePattern.startDate} · Cycle begins{' '}
              {activePattern.cycleStartPhase === 'on' ? 'on a work day' : 'on R&R'}
            </p>
          </div>
        ) : (
          <div style={{ padding: '16px' }}>
            <p style={{ fontSize: 14, color: '#484f58', margin: '0 0 12px' }}>No roster configured</p>
            <button
              onClick={() => setEditingRoster(true)}
              style={{
                padding: '10px 20px',
                borderRadius: 10,
                background: '#f16738',
                border: 'none',
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Set up roster
            </button>
          </div>
        )}
      </section>

      {/* ── Data card ── */}
      <section
        style={{
          borderRadius: 16,
          border: '1px solid #21262d',
          background: '#161b22',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '14px 16px',
            borderBottom: '1px solid #21262d',
          }}
        >
          <div style={{ width: 3, height: 18, borderRadius: 2, background: '#1792d8' }} />
          <h2 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#e6edf3', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Data
          </h2>
        </div>
        <div style={{ padding: '16px' }}>
          <p style={{ fontSize: 13, color: '#484f58', margin: '0 0 12px' }}>
            {itineraries.length} trip{itineraries.length !== 1 ? 's' : ''} stored locally on this device
          </p>
          <button
            onClick={handleExport}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: 10,
              background: 'none',
              border: '1px solid #30363d',
              color: '#8b949e',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Export backup (JSON)
          </button>
        </div>
      </section>

      {/* ── Apple Calendar card ── */}
      <section
        style={{
          borderRadius: 16,
          border: '1px solid #21262d',
          background: '#161b22',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '14px 16px',
            borderBottom: '1px solid #21262d',
          }}
        >
          <div style={{ width: 3, height: 18, borderRadius: 2, background: '#484f58' }} />
          <h2 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#e6edf3', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Apple Calendar Sync
          </h2>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: '#f16738',
              background: 'rgba(241,103,56,0.15)',
              border: '1px solid rgba(241,103,56,0.25)',
              borderRadius: 20,
              padding: '2px 8px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Soon
          </span>
        </div>
        <div style={{ padding: '16px' }}>
          <p style={{ fontSize: 13, color: '#484f58', margin: 0 }}>
            CalDAV integration coming in a future update.
          </p>
        </div>
      </section>

      {/* ── Roster edit modal ── */}
      {editingRoster && (
        <Modal
          title={activePattern ? 'Edit Roster' : 'Set Up Roster'}
          onClose={() => {
            if (activePattern) setEditingRoster(false)
          }}
        >
          <RosterSetup onComplete={() => setEditingRoster(false)} />
        </Modal>
      )}
    </div>
  )
}
