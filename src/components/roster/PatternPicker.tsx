import { PRESET_PATTERNS } from '@/types/roster'

interface Props {
  onSelect: (daysOn: number, daysOff: number, label: string) => void
  selectedDaysOn?: number
  selectedDaysOff?: number
}

export function PatternPicker({ onSelect, selectedDaysOn, selectedDaysOff }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {PRESET_PATTERNS.map((preset) => {
        const active = preset.daysOn === selectedDaysOn && preset.daysOff === selectedDaysOff
        return (
          <button
            key={preset.label}
            type="button"
            onClick={() => onSelect(preset.daysOn, preset.daysOff, preset.label)}
            className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
              active
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-700 text-gray-200 border-gray-600 active:bg-gray-600'
            }`}
          >
            {preset.label}
          </button>
        )
      })}
      <button
        type="button"
        onClick={() => onSelect(0, 0, 'Custom')}
        className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
          selectedDaysOn === 0
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-gray-700 text-gray-200 border-gray-600 active:bg-gray-600'
        }`}
      >
        Custom pattern...
      </button>
    </div>
  )
}
