import { useRuntimeConfig } from '#app'
import { $fetch } from 'ofetch'
import type { AppointmentType, CustomerDetails, Reservation, Slot } from '~/src/types/booking'

function apiUrl(path: string) {
  const config = useRuntimeConfig()
  const base = String(config.public.apiBase || '').replace(/\/$/, '')
  return `${base}${path}`
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

function isSlot(value: unknown): value is Slot {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.start === 'string' &&
    typeof value.end === 'string' &&
    (value.appointmentType === 'intro' || value.appointmentType === 'hypnosis')
  )
}

function parseSlotsResponse(response: unknown): Slot[] {
  if (!Array.isArray(response) || !response.every(isSlot)) {
    throw new Error('invalid-slots-response')
  }

  return response
}

export async function fetchSlots(appointmentType: AppointmentType) {
  const response = await $fetch<unknown>(
    apiUrl(`/api/slots?type=${encodeURIComponent(appointmentType)}`),
  )
  return parseSlotsResponse(response)
}

export function createReservation(payload: {
  slotId: string
  appointmentType: AppointmentType
  customer: CustomerDetails
}) {
  return $fetch<Reservation>(apiUrl('/api/reservations'), {
    method: 'POST',
    body: payload,
  })
}

export function fetchReservation(token: string) {
  return $fetch<Reservation>(apiUrl(`/api/reservation?token=${encodeURIComponent(token)}`))
}

export function confirmReservation(token: string) {
  return $fetch<Reservation>(apiUrl('/api/reservation/confirm'), {
    method: 'POST',
    body: { token },
  })
}

export function cancelReservation(token: string) {
  return $fetch<Reservation>(apiUrl('/api/reservation/cancel'), {
    method: 'POST',
    body: { token },
  })
}
