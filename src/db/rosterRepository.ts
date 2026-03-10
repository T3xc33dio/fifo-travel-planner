import { getDb } from './client'
import type { SwingPattern, RosterDayOverride } from '@/types/roster'

export async function savePattern(pattern: SwingPattern): Promise<void> {
  const db = await getDb()
  await db.put('rosters', pattern)
}

export async function loadPattern(): Promise<SwingPattern | undefined> {
  const db = await getDb()
  const all = await db.getAll('rosters')
  return all[0]
}

export async function saveOverride(override: RosterDayOverride): Promise<void> {
  const db = await getDb()
  await db.put('overrides', override)
}

export async function loadOverrides(): Promise<RosterDayOverride[]> {
  const db = await getDb()
  return db.getAll('overrides')
}

export async function deleteOverride(date: string): Promise<void> {
  const db = await getDb()
  await db.delete('overrides', date)
}
