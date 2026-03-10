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
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Top header */}
      <header className="flex items-center justify-between px-2 bg-gray-800 border-b border-gray-700 shrink-0" style={{ height: '50px' }}>
        <button
          onClick={() => setOpen(true)}
          className="w-10 h-10 flex items-center justify-center text-gray-300 text-2xl active:bg-gray-700 rounded-lg"
          aria-label="Open menu"
        >
          ☰
        </button>
        <span className="font-semibold text-gray-100 text-base">{currentLabel}</span>
        <div className="w-10" />
      </header>

      <OfflineBanner />

      <main className="flex-1 overflow-y-auto min-h-0">
        {children}
      </main>

      {/* Sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative w-72 bg-gray-800 h-full flex flex-col shadow-2xl border-r border-gray-700">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
              <span className="font-bold text-gray-100 text-lg">FIFO Planner</span>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 text-xl rounded-lg active:bg-gray-700"
              >
                ✕
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              {NAV_ITEMS.map((item) => {
                const active = location.pathname === item.path
                return (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setOpen(false) }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      active ? 'bg-blue-600 text-white' : 'text-gray-300 active:bg-gray-700'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
