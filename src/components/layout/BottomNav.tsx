import { useLocation, useNavigate } from 'react-router-dom'

const TABS = [
  { path: '/', label: 'Calendar', icon: '📅' },
  { path: '/trips', label: 'Trips', icon: '✈️' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
]

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex pb-[env(safe-area-inset-bottom)]">
      {TABS.map((tab) => {
        const active = location.pathname === tab.path
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-xs min-h-[56px] touch-manipulation ${
              active ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
