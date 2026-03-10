import { z } from 'zod'

export const FlightLegSchema = z.object({
  id: z.string().uuid(),
  departureAirport: z.string().min(3).max(4),
  arrivalAirport: z.string().min(3).max(4),
  departureDateTime: z.string(),
  arrivalDateTime: z.string(),
  airline: z.string().min(1).max(80),
  flightNumber: z.string().min(1).max(10),
  bookingReference: z.string().optional(),
  seatNumber: z.string().optional(),
  terminal: z.string().optional(),
})
export type FlightLeg = z.infer<typeof FlightLegSchema>

export const AccommodationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(120),
  checkIn: z.string(),
  checkOut: z.string(),
  address: z.string().optional(),
  confirmationNumber: z.string().optional(),
  notes: z.string().optional(),
})
export type Accommodation = z.infer<typeof AccommodationSchema>

export const TransferSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['bus', 'car', 'train', 'taxi', 'other']),
  pickupDateTime: z.string(),
  pickupLocation: z.string(),
  dropoffLocation: z.string(),
  bookingReference: z.string().optional(),
  notes: z.string().optional(),
})
export type Transfer = z.infer<typeof TransferSchema>

export const ItinerarySchema = z.object({
  id: z.string().uuid(),
  label: z.string().min(1).max(120),
  tripType: z.enum(['fly_in', 'fly_out', 'personal', 'other']),
  startDate: z.string(),
  endDate: z.string(),
  flightLegs: z.array(FlightLegSchema),
  accommodations: z.array(AccommodationSchema),
  transfers: z.array(TransferSchema),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type Itinerary = z.infer<typeof ItinerarySchema>
