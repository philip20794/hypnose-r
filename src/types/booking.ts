export type Slot = {
  id: string
  start: string
  end: string
  summary: 'Frei' | '15frei'
  originalSummary?: string
  appointmentType: AppointmentType
}

export type AppointmentType = 'intro' | 'hypnosis'

export type CustomerDetails = {
  name: string
  email: string
  phone: string
  note?: string
}

export type ReservationStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'calendar_error'

export type Reservation = {
  token: string
  slotId: string
  appointmentType: AppointmentType
  serviceLabel: string
  status: ReservationStatus
  start: string
  end: string
  price: number
  address: string
  paymentMethods: string
  customer: CustomerDetails
  expiresAt?: string | null
  cancellationReason?: 'customer' | 'expired' | string | null
  canConfirm: boolean
  confirmUrl: string
}
