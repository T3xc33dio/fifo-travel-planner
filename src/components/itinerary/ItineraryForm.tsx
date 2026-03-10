import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { v4 as uuid } from 'uuid'
import { format } from 'date-fns'
import { useItineraryStore } from '@/store/itineraryStore'
import { useUiStore } from '@/store/uiStore'
import type { Itinerary } from '@/types/itinerary'

const FlightLegFormSchema = z.object({
  id: z.string(),
  departureAirport: z.string().min(3, 'Min 3 chars').max(4),
  arrivalAirport: z.string().min(3, 'Min 3 chars').max(4),
  departureDateTime: z.string().min(1, 'Required'),
  arrivalDateTime: z.string().min(1, 'Required'),
  airline: z.string().min(1, 'Required'),
  flightNumber: z.string().min(1, 'Required'),
  bookingReference: z.string().optional(),
  seatNumber: z.string().optional(),
})

const FormSchema = z.object({
  label: z.string().min(1, 'Required'),
  tripType: z.enum(['fly_in', 'fly_out', 'personal', 'other']),
  startDate: z.string().min(1, 'Required'),
  endDate: z.string().min(1, 'Required'),
  flightLegs: z.array(FlightLegFormSchema),
  notes: z.string().optional(),
})
type FormValues = z.infer<typeof FormSchema>

interface Props {
  existing?: Itinerary
  onComplete: () => void
}

const inputClass = 'w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500'
const smallInputClass = 'w-full bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-sm text-gray-100 placeholder-gray-500'

export function ItineraryForm({ existing, onComplete }: Props) {
  const addItinerary = useItineraryStore((s) => s.addItinerary)
  const updateItinerary = useItineraryStore((s) => s.updateItinerary)
  const closeSheet = useUiStore((s) => s.closeSheet)
  const selectedDate = useUiStore((s) => s.selectedDate)

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: existing
      ? {
          label: existing.label,
          tripType: existing.tripType,
          startDate: existing.startDate,
          endDate: existing.endDate,
          flightLegs: existing.flightLegs,
          notes: existing.notes ?? '',
        }
      : {
          tripType: 'fly_in',
          startDate: selectedDate ?? format(new Date(), 'yyyy-MM-dd'),
          endDate: selectedDate ?? format(new Date(), 'yyyy-MM-dd'),
          flightLegs: [],
          notes: '',
          label: '',
        },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'flightLegs' })

  const onSubmit = async (data: FormValues) => {
    const now = new Date().toISOString()
    const itinerary: Itinerary = {
      id: existing?.id ?? uuid(),
      label: data.label,
      tripType: data.tripType,
      startDate: data.startDate,
      endDate: data.endDate,
      flightLegs: data.flightLegs.map((leg) => ({ ...leg, terminal: undefined })),
      accommodations: existing?.accommodations ?? [],
      transfers: existing?.transfers ?? [],
      notes: data.notes,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    }
    if (existing) {
      await updateItinerary(itinerary)
    } else {
      await addItinerary(itinerary)
    }
    onComplete()
    closeSheet()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 pb-8">
      <div>
        <label className="block text-xs text-gray-400 mb-1">Trip name</label>
        <input
          {...register('label')}
          placeholder="e.g. Fly to site — March swing"
          className={inputClass}
        />
        {errors.label && <p className="text-red-400 text-xs mt-1">{errors.label.message}</p>}
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Trip type</label>
        <select {...register('tripType')} className={inputClass}>
          <option value="fly_in">Fly In</option>
          <option value="fly_out">Fly Out</option>
          <option value="personal">Personal</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs text-gray-400 mb-1">Start date</label>
          <input type="date" {...register('startDate')} className={inputClass} />
          {errors.startDate && <p className="text-red-400 text-xs mt-1">{errors.startDate.message}</p>}
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-400 mb-1">End date</label>
          <input type="date" {...register('endDate')} className={inputClass} />
          {errors.endDate && <p className="text-red-400 text-xs mt-1">{errors.endDate.message}</p>}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-300">Flights</label>
          <button
            type="button"
            onClick={() =>
              append({
                id: uuid(),
                departureAirport: '',
                arrivalAirport: '',
                departureDateTime: '',
                arrivalDateTime: '',
                airline: '',
                flightNumber: '',
              })
            }
            className="text-xs text-blue-400 font-medium"
          >
            + Add flight
          </button>
        </div>
        {fields.map((field, index) => (
          <div key={field.id} className="bg-gray-900 rounded-xl p-3 mb-3 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-400">Flight {index + 1}</span>
              <button type="button" onClick={() => remove(index)} className="text-xs text-red-400">
                Remove
              </button>
            </div>
            <div className="flex gap-2 mb-2">
              <div className="flex-1">
                <input
                  {...register(`flightLegs.${index}.departureAirport`)}
                  placeholder="DEP"
                  className={smallInputClass + ' uppercase'}
                  maxLength={4}
                />
              </div>
              <span className="self-center text-gray-500">→</span>
              <div className="flex-1">
                <input
                  {...register(`flightLegs.${index}.arrivalAirport`)}
                  placeholder="ARR"
                  className={smallInputClass + ' uppercase'}
                  maxLength={4}
                />
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              <div className="flex-1">
                <input
                  {...register(`flightLegs.${index}.airline`)}
                  placeholder="Airline"
                  className={smallInputClass}
                />
              </div>
              <div className="flex-1">
                <input
                  {...register(`flightLegs.${index}.flightNumber`)}
                  placeholder="QF123"
                  className={smallInputClass}
                />
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              <div className="flex-1">
                <label className="text-xs text-gray-500">Departs</label>
                <input
                  type="datetime-local"
                  {...register(`flightLegs.${index}.departureDateTime`)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-xs text-gray-100"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500">Arrives</label>
                <input
                  type="datetime-local"
                  {...register(`flightLegs.${index}.arrivalDateTime`)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-xs text-gray-100"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <input
                {...register(`flightLegs.${index}.bookingReference`)}
                placeholder="Booking ref"
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-xs text-gray-100 placeholder-gray-500"
              />
              <input
                {...register(`flightLegs.${index}.seatNumber`)}
                placeholder="Seat"
                className="w-16 bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-xs text-gray-100 placeholder-gray-500"
              />
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Notes</label>
        <textarea
          {...register('notes')}
          rows={3}
          placeholder="Any additional details..."
          className={inputClass + ' resize-none'}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium text-sm active:bg-blue-700"
      >
        {existing ? 'Update trip' : 'Save trip'}
      </button>
    </form>
  )
}
