import { useState } from 'react'
import { useRosterStore } from '@/store/rosterStore'
import { useItineraryStore } from '@/store/itineraryStore'
import { RosterSetup } from '@/components/roster/RosterSetup'

export function SettingsPage() {
  const activePattern = useRosterStore((s) => s.activePattern)
  const itineraries = useItineraryStore((s) => s.itineraries)
  const [editingRoster, setEditingRoster] = useState(!activePattern)

  const handleExport = () => {
    const data = {
      pattern: activePattern,
      itineraries,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fifo-planner-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col px-4 pt-4 pb-8 gap-6 bg-gray-900 min-h-full">
      <section className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h2 className="font-semibold text-gray-100">Roster pattern</h2>
          {!editingRoster && (
            <button onClick={() => setEditingRoster(true)} className="text-sm text-blue-400">
              Edit
            </button>
          )}
        </div>
        {editingRoster ? (
          <RosterSetup onComplete={() => setEditingRoster(false)} />
        ) : activePattern ? (
          <div className="px-4 py-3">
            <p className="font-medium text-gray-100">{activePattern.label}</p>
            <p className="text-sm text-gray-400 mt-0.5">
              {activePattern.daysOn} days on / {activePattern.daysOff} days off
            </p>
            <p className="text-sm text-gray-400">Starting {activePattern.startDate}</p>
          </div>
        ) : (
          <div className="px-4 py-3">
            <p className="text-sm text-gray-400">No roster configured</p>
          </div>
        )}
      </section>

      <section className="bg-gray-800 rounded-2xl border border-gray-700">
        <div className="px-4 py-3 border-b border-gray-700">
          <h2 className="font-semibold text-gray-100">Data</h2>
        </div>
        <div className="px-4 py-3">
          <p className="text-sm text-gray-400 mb-3">
            {itineraries.length} trip{itineraries.length !== 1 ? 's' : ''} saved locally
          </p>
          <button
            onClick={handleExport}
            className="w-full py-2.5 rounded-xl border border-gray-600 text-sm text-gray-300"
          >
            Export backup (JSON)
          </button>
        </div>
      </section>

      <section className="bg-gray-800 rounded-2xl border border-gray-700">
        <div className="px-4 py-3 border-b border-gray-700">
          <h2 className="font-semibold text-gray-100">Apple Calendar sync</h2>
          <p className="text-xs text-gray-500 mt-0.5">Coming soon</p>
        </div>
        <div className="px-4 py-3">
          <p className="text-sm text-gray-400">
            Apple Calendar integration via CalDAV will be available in a future update.
          </p>
        </div>
      </section>
    </div>
  )
}
