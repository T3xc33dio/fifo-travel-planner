import { type ReactNode } from 'react'
import { BottomNav } from './BottomNav'
import { OfflineBanner } from '@/components/shared/OfflineBanner'

interface Props {
  children: ReactNode
}

export function AppShell({ children }: Props) {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <OfflineBanner />
      <main className="flex-1 overflow-y-auto pb-[calc(56px+env(safe-area-inset-bottom))]">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
