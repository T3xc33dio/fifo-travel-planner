import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { v4 as uuid } from 'uuid'
import { format } from 'date-fns'
import { useRosterStore } from '@/store/rosterStore'
import { PatternPicker } from './PatternPicker'

const FormSchema = z.object({
  label: z.string().min(1, 'Required'),
  daysOn: z.coerce.number().int().min(1).max(60),
  daysOff: z.coerce.number().int().min(1).max(60),
  startDate: z.string().min(1, 'Required'),
  cycleStartPhase: z.enum(['on', 'off']),
})
type FormValues = z.infer<typeof FormSchema>

interface Props {
  onComplete: () => void
}

export function RosterSetup({ onComplete }: Props) {
  const setPattern = useRosterStore((s) => s.setPattern)
  const activePattern = useRosterStore((s) => s.activePattern)
  const [showCustom, setShowCustom] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(FormSchema) as any,
    defaultValues: activePattern
      ? {
          label: activePattern.label,
          daysOn: activePattern.daysOn,
          daysOff: activePattern.daysOff,
          startDate: activePattern.startDate,
          cycleStartPhase: activePattern.cycleStartPhase,
        }
      : {
          startDate: format(new Date(), 'yyyy-MM-dd'),
          cycleStartPhase: 'on',
          daysOn: 14,
          daysOff: 7,
          label: '2 weeks on / 1 week off',
        },
  })

  const daysOn = watch('daysOn')
  const daysOff = watch('daysOff')

  const onSubmit = async (data: FormValues) => {
    await setPattern({
      id: activePattern?.id ?? uuid(),
      label: data.label,
      daysOn: data.daysOn,
      daysOff: data.daysOff,
      startDate: data.startDate,
      cycleStartPhase: data.cycleStartPhase,
    })
    onComplete()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Swing pattern</label>
        <PatternPicker
          selectedDaysOn={showCustom ? 0 : daysOn}
          selectedDaysOff={showCustom ? 0 : daysOff}
          onSelect={(on, off, label) => {
            if (on === 0) {
              setShowCustom(true)
            } else {
              setShowCustom(false)
              setValue('daysOn', on)
              setValue('daysOff', off)
              setValue('label', label)
            }
          }}
        />
      </div>

      {showCustom && (
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-1">Days on</label>
            <input
              type="number"
              {...register('daysOn')}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100"
              placeholder="14"
            />
            {errors.daysOn && <p className="text-red-400 text-xs mt-1">{errors.daysOn.message}</p>}
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-1">Days off</label>
            <input
              type="number"
              {...register('daysOff')}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100"
              placeholder="7"
            />
            {errors.daysOff && <p className="text-red-400 text-xs mt-1">{errors.daysOff.message}</p>}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">First day of swing</label>
        <input
          type="date"
          {...register('startDate')}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100"
        />
        {errors.startDate && <p className="text-red-400 text-xs mt-1">{errors.startDate.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">First cycle starts on a...</label>
        <div className="flex gap-3">
          {(['on', 'off'] as const).map((phase) => (
            <label key={phase} className="flex items-center gap-2 text-sm text-gray-300">
              <input type="radio" {...register('cycleStartPhase')} value={phase} />
              {phase === 'on' ? 'Work day' : 'RDO'}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium text-sm active:bg-blue-700"
      >
        Save roster
      </button>
    </form>
  )
}
