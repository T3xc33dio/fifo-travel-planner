import { format, parseISO } from 'date-fns'

export function toDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function fromDateKey(key: string): Date {
  return parseISO(key)
}

export function formatDisplay(dateStr: string): string {
  return format(parseISO(dateStr), 'EEE d MMM yyyy')
}

export function formatTime(dateStr: string): string {
  return format(parseISO(dateStr), 'h:mm a')
}

export function formatDateRange(start: string, end: string): string {
  const s = parseISO(start)
  const e = parseISO(end)
  if (format(s, 'MMM yyyy') === format(e, 'MMM yyyy')) {
    return `${format(s, 'd')} – ${format(e, 'd MMM yyyy')}`
  }
  return `${format(s, 'd MMM')} – ${format(e, 'd MMM yyyy')}`
}
