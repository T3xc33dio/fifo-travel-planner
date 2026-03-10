import { useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { OfflineBanner } from '@/components/shared/OfflineBanner'

const NAV_ITEMS = [
  { path: '/', label: 'Calendar', icon: '📅' },
  { path: '/trips', label: 'Trips', icon: '✈️' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
]

interface Props {
  children: ReactNode
}

export function AppShell({ children }: Props) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const currentLabel = NAV_ITEMS.find((n) => n.path === location.pathname)?.label ?? 'FIFO Planner'

  return (
    <div className="flex flex-col h-screen" style={{ background: '#0d1117' }}>
      {/* Top header — PeopleTray-style with orange accent stripe */}
      <header
        className="flex items-center justify-between px-3 shrink-0 border-b"
        style={{ height: '50px', background: '#161b22', borderColor: '#30363d' }}
      >
        <button
          onClick={() => setOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 text-xl active:bg-gray-800"
          aria-label="Open menu"
        >
          ☰
        </button>

        {/* Logo / title with orange accent */}
        <div className="flex items-center gap-2">
          <span
            className="w-1 h-6 rounded-full"
            style={{ background: '#f16738' }}
          />
          <span className="font-bold text-gray-100 text-sm tracking-widest uppercase">
            FIFO Planner
          </span>
        </div>

        {/* Current page label */}
        <span
          className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded"
          style={{ color: '#f16738', background: 'rgba(241,103,56,0.12)' }}
        >
          {currentLabel}
        </span>
      </header>

      <OfflineBanner />

      <main className="flex-1 overflow-y-auto min-h-0">
        {children}
      </main>

      {/* Sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div
            className="relative w-72 h-full flex flex-col shadow-2xl border-r"
            style={{ background: '#161b22', borderColor: '#30363d' }}
          >
            {/* Sidebar header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: '#30363d' }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-1 h-5 rounded-full"
                  style={{ background: '#f16738' }}
                />
                <span className="font-bold text-gray-100 text-base tracking-widest uppercase">
                  FIFO Planner
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-500 text-xl rounded-lg active:bg-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex flex-col gap-1 p-4">
              {NAV_ITEMS.map((item) => {
                const active = location.pathname === item.path
                return (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setOpen(false) }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                    style={
                      active
                        ? { background: '#f16738', color: '#fff' }
                        : { color: '#8b949e' }
                    }
                  >
                    <span className="text-xl">{item.icon}</span>
                    {item.label}
                  </button>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="mt-auto px-5 py-4 border-t" style={{ borderColor: '#30363d' }}>
              <p className="text-xs text-gray-600">FIFO Travel Planner</p>
              <p className="text-xs text-gray-700">v1.0 · Data stored locally</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
