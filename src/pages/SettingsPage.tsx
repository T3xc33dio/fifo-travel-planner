import { useState } from 'react'
import { useRosterStore } from '@/store/rosterStore'
import { useItineraryStore } from '@/store/itineraryStore'
import { RosterSetup } from '@/components/roster/RosterSetup'

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
    <div className="flex flex-col px-4 pt-4 pb-8 gap-4 min-h-full" style={{ background: '#0d1117' }}>

      <section className="rounded-xl border overflow-hidden" style={{ background: '#161b22', borderColor: '#30363d' }}>
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#30363d' }}>
          <div className="flex items-center gap-2">
            <span className="w-0.5 h-4 rounded-full" style={{ background: '#1792d8' }} />
            <h2 className="font-bold text-gray-100 text-sm uppercase tracking-wide">Roster Pattern</h2>
          </div>
          {!editingRoster && (
            <button
              onClick={() => setEditingRoster(true)}
              className="text-xs font-semibold px-3 py-1 rounded-lg"
              style={{ color: '#f16738', background: 'rgba(241,103,56,0.12)' }}
            >
              Edit
            </button>
          )}
        </div>
        {editingRoster ? (
          <RosterSetup onComplete={() => setEditingRoster(false)} />
        ) : activePattern ? (
          <div className="px-4 py-4">
            <p className="font-bold text-gray-100 mb-1">{activePattern.label}</p>
            <div className="flex gap-4 mt-2">
              <div
                className="flex flex-col items-center px-4 py-2 rounded-lg"
                style={{ background: 'rgba(23,146,216,0.1)', border: '1px solid rgba(23,146,216,0.2)' }}
              >
                <span className="text-xl font-bold" style={{ color: '#1792d8' }}>{activePattern.daysOn}</span>
                <span className="text-[10px] text-gray-500 uppercase">Days On</span>
              </div>
              <div
                className="flex flex-col items-center px-4 py-2 rounded-lg"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
              >
                <span className="text-xl font-bold text-green-400">{activePattern.daysOff}</span>
                <span className="text-[10px] text-gray-500 uppercase">Days Off</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-3">Starting {activePattern.startDate}</p>
          </div>
        ) : (
          <div className="px-4 py-3">
            <p className="text-sm text-gray-500">No roster configured</p>
          </div>
        )}
      </section>

      <section className="rounded-xl border overflow-hidden" style={{ background: '#161b22', borderColor: '#30363d' }}>
        <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: '#30363d' }}>
          <span className="w-0.5 h-4 rounded-full" style={{ background: '#1792d8' }} />
          <h2 className="font-bold text-gray-100 text-sm uppercase tracking-wide">Data</h2>
        </div>
        <div className="px-4 py-4">
          <p className="text-sm text-gray-500 mb-3">
            {itineraries.length} trip{itineraries.length !== 1 ? 's' : ''} stored locally on this device
          </p>
          <button
            onClick={handleExport}
            className="w-full py-2.5 rounded-xl text-sm font-semibold border"
            style={{ borderColor: '#30363d', color: '#8b949e' }}
          >
            Export backup (JSON)
          </button>
        </div>
      </section>

      <section className="rounded-xl border overflow-hidden" style={{ background: '#161b22', borderColor: '#30363d' }}>
        <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: '#30363d' }}>
          <span className="w-0.5 h-4 rounded-full" style={{ background: '#484f58' }} />
          <h2 className="font-bold text-gray-100 text-sm uppercase tracking-wide">Apple Calendar Sync</h2>
          <span
            className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase"
            style={{ background: 'rgba(241,103,56,0.15)', color: '#f16738' }}
          >
            Soon
          </span>
        </div>
        <div className="px-4 py-4">
          <p className="text-sm text-gray-600">
            CalDAV integration coming in a future update.
          </p>
        </div>
      </section>
    </div>
  )
}
