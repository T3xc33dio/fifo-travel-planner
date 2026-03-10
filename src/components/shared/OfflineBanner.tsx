import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export function OfflineBanner() {
  const isOnline = useOnlineStatus()
  if (isOnline) return null
  return (
    <div className="bg-amber-500 text-white text-sm text-center py-1 px-4">
      You're offline — your data is saved locally
    </div>
  )
}
