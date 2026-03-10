import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { CalendarPage } from '@/pages/CalendarPage'
import { TripsPage } from '@/pages/TripsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { useItineraryStore } from '@/store/itineraryStore'

export default function App() {
  const hydrate = useItineraryStore((s) => s.hydrate)

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<CalendarPage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
