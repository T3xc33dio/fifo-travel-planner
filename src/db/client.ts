import { openDB, type IDBPDatabase } from 'idb'
import type { SwingPattern, RosterDayOverride } from '@/types/roster'
import type { Itinerary } from '@/types/itinerary'

interface FifoDb {
  rosters: {
    key: string
    value: SwingPattern
  }
  overrides: {
    key: string
    value: RosterDayOverride
  }
  itineraries: {
    key: string
    value: Itinerary
  }
}

let dbInstance: IDBPDatabase<FifoDb> | null = null

export async function getDb(): Promise<IDBPDatabase<FifoDb>> {
  if (dbInstance) return dbInstance
  try {
    dbInstance = await openDB<FifoDb>('fifo-planner', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('rosters')) db.createObjectStore('rosters', { keyPath: 'id' })
        if (!db.objectStoreNames.contains('overrides')) db.createObjectStore('overrides', { keyPath: 'date' })
        if (!db.objectStoreNames.contains('itineraries')) db.createObjectStore('itineraries', { keyPath: 'id' })
      },
    })
    return dbInstance
  } catch {
    throw new Error('IndexedDB unavailable. Data will not persist across sessions.')
  }
}
