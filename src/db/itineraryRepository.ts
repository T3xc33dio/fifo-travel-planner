import { getDb } from './client'
import type { Itinerary } from '@/types/itinerary'

export async function getAllItineraries(): Promise<Itinerary[]> {
  const db = await getDb()
  return db.getAll('itineraries')
}

export async function saveItinerary(itinerary: Itinerary): Promise<void> {
  const db = await getDb()
  await db.put('itineraries', itinerary)
}

export async function deleteItinerary(id: string): Promise<void> {
  const db = await getDb()
  await db.delete('itineraries', id)
}
