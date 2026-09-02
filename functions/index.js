import { onRequest } from 'firebase-functions/v2/https'
import { onSchedule } from 'firebase-functions/v2/scheduler'
import { defineSecret } from 'firebase-functions/params'
import admin from 'firebase-admin'
import { FieldValue, Timestamp, getFirestore } from 'firebase-admin/firestore'
import { google } from 'googleapis'
import fs from 'node:fs'
import crypto from 'node:crypto'
import formData from 'form-data'
import Mailgun from 'mailgun.js'

const MAILGUN_API_KEY = defineSecret('MAILGUN_API_KEY')
const SENDGRID_FROM_EMAIL = defineSecret('SENDGRID_FROM_EMAIL')

const REGION = 'us-central1'
const FREE_CALENDAR_ID = process.env.HYPNOSE_FREE_CALENDAR_ID || 'herrin.r.2000@gmail.com'
const BOOKED_CALENDAR_ID = process.env.HYPNOSE_BOOKED_CALENDAR_ID || 'runaundphilip@gmail.com'
const SITE_URL = trimTrailingSlash(process.env.PUBLIC_SITE_URL || 'https://hypnose-r.web.app')
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || 'hypnose-r.de'
const MAILGUN_API_URL = trimTrailingSlash(process.env.MAILGUN_API_URL || 'https://api.eu.mailgun.net')
const PRICE_EUR = Number(process.env.HYPNOSE_PRICE_EUR || 120)
const ADDRESS = process.env.HYPNOSE_ADDRESS || 'Alt-Heddernheim 43, 60439 Frankfurt am Main'
const INTRO_DURATION_MINUTES = 15
const RESERVATION_EXPIRATION_MS = 48 * 60 * 60 * 1000
const PAYMENT_METHODS = 'Zahlung vor Ort oder per Rechnung'

const APPOINTMENT_TYPES = {
  intro: {
    serviceLabel: 'Kostenloses Erstgespräch',
    durationMinutes: 15,
    price: 0,
    address: 'Telefonisch',
    paymentMethods: 'Kostenlos',
  },
  hypnosis: {
    serviceLabel: 'Hypnose',
    durationMinutes: 60,
    price: PRICE_EUR,
    address: ADDRESS,
    paymentMethods: PAYMENT_METHODS,
  },
}

const EMAIL_TEMPLATES = {
  reservationCustomer: 'hypnose termin bestaetigungslink',
  reservationOwner: 'me - hypnose termin reserviert',
  confirmationCustomer: 'hypnose termin bestaetigt',
  confirmationOwner: 'me - hypnose termin bestaetigt',
  cancellationCustomer: 'hypnose termin storniert',
  cancellationOwner: 'me - hypnose termin storniert',
}

const corsOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'https://hypnose-r.de',
  'https://hypnose-r.web.app',
  'https://hypnose-r.firebaseapp.com',
]

if (!admin.apps.length) {
  admin.initializeApp()
}

const db = getFirestore()
const calendar = google.calendar({ version: 'v3' })
const serviceAccount = JSON.parse(fs.readFileSync('./service-account.json', 'utf8'))
const authClient = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/calendar'],
})

const reservationsCollection = db.collection('hypnoseReservations')
const slotLocksCollection = db.collection('hypnoseSlotLocks')

function trimTrailingSlash(value) {
  return String(value || '').replace(/\/+$/, '')
}

function normalizeSummary(summary) {
  return String(summary || '').trim().toLowerCase()
}

function isFreeSummary(summary) {
  const normalized = normalizeSummary(summary)
  return normalized === 'frei' || normalized === 'freix'
}

function isIntroSummary(summary) {
  return normalizeSummary(summary) === '15frei'
}

function normalizeAppointmentType(value) {
  const normalized = cleanText(value || 'hypnosis').toLowerCase()
  if (normalized === 'intro' || normalized === 'hypnosis') {
    return normalized
  }

  const error = new Error('invalid-appointment-type')
  error.status = 400
  throw error
}

function addMinutes(value, minutes) {
  return new Date(new Date(value).getTime() + minutes * 60 * 1000).toISOString()
}

function isAfter(left, right) {
  return new Date(left).getTime() > new Date(right).getTime()
}

function isBookableSummaryForAppointment(summary, appointmentType) {
  if (appointmentType === 'intro') {
    return isIntroSummary(summary) || isFreeSummary(summary)
  }

  return isFreeSummary(summary)
}

function cleanText(value, fallback = '') {
  return String(value ?? fallback).trim()
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function toIsoDate(input) {
  const date = new Date(input)
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${input}`)
  }
  return date.toISOString()
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Europe/Berlin',
  }).format(new Date(value))
}

function formatTime(value) {
  return new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Berlin',
  }).format(new Date(value))
}

function timestampToDate(value) {
  if (!value) return null
  if (typeof value.toDate === 'function') return value.toDate()

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function timestampToMillis(value) {
  const date = timestampToDate(value)
  return date ? date.getTime() : 0
}

function createToken() {
  return crypto.randomBytes(32).toString('hex')
}

function getConfirmUrl(token) {
  return `${SITE_URL}/bestaetigen/${token}`
}

function getCancellationUrl(token) {
  return `${SITE_URL}/bestaetigen/${token}`
}

function getConfiguredFromEmail() {
  return cleanText(SENDGRID_FROM_EMAIL.value())
}

function getSenderEmail(configuredFromEmail) {
  const configuredDomain = configuredFromEmail.split('@').pop()?.toLowerCase()
  const mailgunDomain = MAILGUN_DOMAIN.toLowerCase()

  if (configuredFromEmail && configuredDomain === mailgunDomain) {
    return configuredFromEmail
  }

  return `postmaster@${MAILGUN_DOMAIN}`
}

function getOwnerEmail(fallbackEmail) {
  return cleanText(process.env.HYPNOSE_OWNER_EMAIL) || fallbackEmail
}

function createMailClient() {
  const mailgun = new Mailgun(formData)
  return mailgun.client({
    username: 'api',
    key: MAILGUN_API_KEY.value(),
    url: MAILGUN_API_URL,
  })
}

async function sendTemplateMail({ to, subject, template, variables, fromName = 'Hypnose R' }) {
  if (!validateEmail(to)) {
    const error = new Error('invalid-mail-recipient')
    error.status = 400
    throw error
  }

  const configuredFromEmail = getConfiguredFromEmail()
  const fromEmail = getSenderEmail(configuredFromEmail)
  const mg = createMailClient()

  await mg.messages.create(MAILGUN_DOMAIN, {
    from: `${fromName} <${fromEmail}>`,
    to,
    subject,
    template,
    't:variables': JSON.stringify(variables),
  })
}

async function sendOptionalTemplateMail(mail) {
  try {
    await sendTemplateMail(mail)
  } catch (error) {
    console.error(`Optional mail failed for ${mail.to}:`, error)
  }
}

function textMail(lines) {
  return lines.filter(Boolean).join('\n')
}

function renderEmail() {
  return ''
}

async function sendMail(mail) {
  await sendTemplateMail(mail)
}

async function sendOptionalMail(mail) {
  await sendOptionalTemplateMail(mail)
}

function createVariables(reservation, token) {
  const appointmentDate = formatDateTime(reservation.start)
  const appointmentEnd = formatTime(reservation.end)
  const expiresAtDate = timestampToDate(reservation.expiresAt)
  const confirmUrl = getConfirmUrl(token)
  const cancelUrl = getCancellationUrl(token)

  return {
    siteName: 'Hypnose R',
    service: reservation.serviceLabel || 'Hypnose',
    name: reservation.customer.name,
    email: reservation.customer.email,
    phone: reservation.customer.phone,
    note: reservation.customer.note,
    appointmentDate,
    appointmentEnd,
    date: appointmentDate,
    datum: appointmentDate,
    price: reservation.price,
    priceLabel: reservation.price > 0 ? `${reservation.price} EUR` : 'kostenlos',
    restbetrag: reservation.price > 0 ? `${reservation.price} EUR` : '0 EUR',
    address: reservation.address,
    paymentMethods: reservation.paymentMethods,
    expiresAt: expiresAtDate ? expiresAtDate.toISOString() : '',
    expiresAtLabel: expiresAtDate ? formatDateTime(expiresAtDate.toISOString()) : '',
    cancellationReason: reservation.cancellationReason || '',
    cancellationReasonLabel:
      reservation.cancellationReason === 'expired'
        ? 'Die Reservierung wurde nicht innerhalb von 48 Stunden bestätigt.'
        : 'Die Reservierung wurde storniert.',
    confirmUrl,
    cancelUrl,
    status: reservation.status,
    token,
    slotId: reservation.slotId,
  }
}

function buildCalendarDescription(reservation, statusLabel, token) {
  const lines = [
    `Status: ${statusLabel}`,
    `Name: ${reservation.customer.name}`,
    `E-Mail: ${reservation.customer.email}`,
    `Telefon: ${reservation.customer.phone || '-'}`,
    `Termin: ${formatDateTime(reservation.start)} bis ${formatTime(reservation.end)}`,
    `Preis: ${reservation.price > 0 ? `${reservation.price} EUR` : 'kostenlos'}`,
    `Zahlung: ${reservation.paymentMethods}`,
    `Adresse: ${reservation.address}`,
    '__________',
    'Notizen:',
    reservation.customer.note || '-',
  ]

  return lines.join('\n')
}

function serializeReservation(snapshot) {
  const data = snapshot.data()
  return {
    token: snapshot.id,
    slotId: data.slotId,
    appointmentType: data.appointmentType || 'hypnosis',
    serviceLabel: data.serviceLabel || 'Hypnose',
    status: data.status,
    start: data.start,
    end: data.end,
    price: data.price,
    address: data.address,
    paymentMethods: data.paymentMethods,
    customer: data.customer,
    expiresAt: timestampToDate(data.expiresAt)?.toISOString() || null,
    cancellationReason: data.cancellationReason || null,
    canConfirm: data.status === 'pending',
    confirmUrl: getConfirmUrl(snapshot.id),
  }
}

async function getReservationSnapshot(token) {
  if (!token) {
    const error = new Error('missing-token')
    error.status = 400
    throw error
  }

  const snapshot = await reservationsCollection.doc(token).get()
  if (!snapshot.exists) {
    const error = new Error('reservation-not-found')
    error.status = 404
    throw error
  }

  return snapshot
}

function handleError(res, error) {
  const status = error.status || (error.message === 'slot-not-free' ? 409 : 500)
  console.error(error)
  res.status(status).json({ error: error.message || 'internal-error' })
}

async function authorizeCalendar() {
  await authClient.authorize()
}

async function getCalendarEvent(eventId) {
  const response = await calendar.events.get({
    auth: authClient,
    calendarId: FREE_CALENDAR_ID,
    eventId,
  })

  return response.data
}

async function createIntroRemainderSlots({ originalEnd, reservedEnd }) {
  const createdIds = []
  let cursor = reservedEnd

  while (isAfter(originalEnd, cursor)) {
    const next = isAfter(addMinutes(cursor, INTRO_DURATION_MINUTES), originalEnd)
      ? originalEnd
      : addMinutes(cursor, INTRO_DURATION_MINUTES)

    if (!isAfter(next, cursor)) break

    const inserted = await calendar.events.insert({
      auth: authClient,
      calendarId: FREE_CALENDAR_ID,
      requestBody: {
        summary: '15frei',
        start: { dateTime: cursor },
        end: { dateTime: next },
      },
    })

    if (inserted.data.id) {
      createdIds.push(inserted.data.id)
    }

    cursor = next
  }

  return createdIds
}

async function deleteFreeCalendarEvents(eventIds) {
  await Promise.allSettled(
    eventIds.map((eventId) =>
      calendar.events.delete({
        auth: authClient,
        calendarId: FREE_CALENDAR_ID,
        eventId,
      }),
    ),
  )
}

async function restoreFreeCalendarReservation(reservation) {
  const splitSlotIds = Array.isArray(reservation.splitSlotIds)
    ? reservation.splitSlotIds.filter(Boolean)
    : []
  let restoreOriginalBlock = true

  if (splitSlotIds.length) {
    const splitEvents = await Promise.all(
      splitSlotIds.map(async (eventId) => {
        try {
          return await getCalendarEvent(eventId)
        } catch {
          return null
        }
      }),
    )
    restoreOriginalBlock = splitEvents.every((event) => event && isIntroSummary(event.summary))

    if (restoreOriginalBlock) {
      await deleteFreeCalendarEvents(splitSlotIds)
    }
  }

  await calendar.events.patch({
    auth: authClient,
    calendarId: FREE_CALENDAR_ID,
    eventId: reservation.slotId,
    requestBody: {
      summary: restoreOriginalBlock ? reservation.originalSummary || 'Frei' : '15frei',
      start: {
        dateTime: restoreOriginalBlock
          ? reservation.originalStart || reservation.start
          : reservation.start,
      },
      end: {
        dateTime: restoreOriginalBlock
          ? reservation.originalEnd || reservation.end
          : reservation.end,
      },
      description: '',
    },
  })
}

async function cancelPendingReservation(token, reservation, cancellationReason = 'customer') {
  if (reservation.status !== 'pending') {
    const error = new Error(`reservation-${reservation.status}`)
    error.status = 409
    throw error
  }

  await authorizeCalendar()
  await restoreFreeCalendarReservation(reservation)

  await reservationsCollection.doc(token).update({
    status: 'cancelled',
    cancellationReason,
    cancelledAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })
  await slotLocksCollection.doc(reservation.slotId).delete()

  const cancelledSnapshot = await reservationsCollection.doc(token).get()
  await sendCancellationEmails(cancelledSnapshot.data(), token)

  return cancelledSnapshot
}

function isExpiredPendingReservation(reservation) {
  if (reservation.status !== 'pending') return false

  const expiresAtMs = timestampToMillis(reservation.expiresAt)
  if (expiresAtMs) return expiresAtMs <= Date.now()

  const createdAtMs = timestampToMillis(reservation.createdAt)
  return Boolean(createdAtMs && createdAtMs + RESERVATION_EXPIRATION_MS <= Date.now())
}

async function sendReservationEmails(reservation, token) {
  const fromEmail = getConfiguredFromEmail()
  const ownerEmail = getOwnerEmail(fromEmail)
  const variables = createVariables(reservation, token)
  const rows = [
    { label: 'Terminart', value: variables.service },
    { label: 'Datum', value: `${variables.appointmentDate} bis ${variables.appointmentEnd}` },
    { label: 'Ort', value: variables.address },
    { label: 'Preis', value: variables.priceLabel },
  ]

  await sendMail({
    to: reservation.customer.email,
    subject: 'Bitte bestätige deinen Termin bei Hypnose R',
    template: EMAIL_TEMPLATES.reservationCustomer,
    variables,
    text: textMail([
      `Hallo ${variables.name},`,
      '',
      `dein Termin ist für ${variables.appointmentDate} bis ${variables.appointmentEnd} reserviert.`,
      `Terminart: ${variables.service}`,
      `Ort: ${variables.address}`,
      `Preis: ${variables.priceLabel}`,
      '',
      'Bitte bestätige den Termin über diesen Link:',
      variables.confirmUrl,
      '',
      'Wenn du den Termin doch nicht wahrnehmen kannst, kannst du ihn hier absagen:',
      variables.cancelUrl,
      '',
      'Viele Grüße',
      'Hypnose R',
    ]),
    html: renderEmail({
      title: 'Bitte bestätige deinen Termin',
      intro: `Hallo ${variables.name}, dein Termin ist reserviert. Bitte bestätige kurz, dass du ihn wahrnimmst.`,
      rows,
      paragraphs: ['Wenn du den Termin doch nicht wahrnehmen kannst, kannst du ihn über denselben Link absagen.'],
      cta: { label: 'Termin bestätigen', href: variables.confirmUrl },
    }),
  })

  await sendOptionalMail({
    to: ownerEmail,
    fromName: 'Hypnose R Buchung',
    subject: `Neue Terminreservierung: ${variables.service}`,
    template: EMAIL_TEMPLATES.reservationOwner,
    variables,
    text: textMail([
      'Neue Terminreservierung wartet auf Bestätigung.',
      '',
      `Terminart: ${variables.service}`,
      `Datum: ${variables.appointmentDate} bis ${variables.appointmentEnd}`,
      `Name: ${variables.name}`,
      `E-Mail: ${variables.email}`,
      `Telefon: ${variables.phone || '-'}`,
      `Notiz: ${variables.note || '-'}`,
      `Token: ${variables.token}`,
    ]),
    html: renderEmail({
      title: 'Neue Terminreservierung',
      intro: 'Eine neue Terminreservierung wartet auf Bestätigung.',
      rows: [
        ...rows,
        { label: 'Name', value: variables.name },
        { label: 'E-Mail', value: variables.email },
        { label: 'Telefon', value: variables.phone || '-' },
        { label: 'Notiz', value: variables.note || '-' },
      ],
    }),
  })
}

async function sendConfirmationEmails(reservation, token) {
  const fromEmail = getConfiguredFromEmail()
  const ownerEmail = getOwnerEmail(fromEmail)
  const variables = createVariables(reservation, token)
  const rows = [
    { label: 'Terminart', value: variables.service },
    { label: 'Datum', value: `${variables.appointmentDate} bis ${variables.appointmentEnd}` },
    { label: 'Ort', value: variables.address },
    { label: 'Preis', value: variables.priceLabel },
  ]

  await Promise.all([
    sendOptionalMail({
      to: reservation.customer.email,
      subject: 'Dein Termin bei Hypnose R ist bestätigt',
      template: EMAIL_TEMPLATES.confirmationCustomer,
      variables,
      text: textMail([
        `Hallo ${variables.name},`,
        '',
        'dein Termin ist bestätigt.',
        '',
        `Terminart: ${variables.service}`,
        `Datum: ${variables.appointmentDate} bis ${variables.appointmentEnd}`,
        `Ort: ${variables.address}`,
        '',
        'Viele Grüße',
        'Hypnose R',
      ]),
      html: renderEmail({
        title: 'Dein Termin ist bestätigt',
        intro: `Hallo ${variables.name}, dein Termin ist verbindlich eingetragen.`,
        rows,
      }),
    }),
    sendOptionalMail({
      to: ownerEmail,
      fromName: 'Hypnose R Buchung',
      subject: `Termin bestätigt: ${variables.service}`,
      template: EMAIL_TEMPLATES.confirmationOwner,
      variables,
      text: textMail([
        'Ein Termin wurde bestätigt.',
        '',
        `Terminart: ${variables.service}`,
        `Datum: ${variables.appointmentDate} bis ${variables.appointmentEnd}`,
        `Name: ${variables.name}`,
        `E-Mail: ${variables.email}`,
        `Telefon: ${variables.phone || '-'}`,
      ]),
      html: renderEmail({
        title: 'Termin bestätigt',
        intro: 'Ein Termin wurde verbindlich bestätigt.',
        rows: [
          ...rows,
          { label: 'Name', value: variables.name },
          { label: 'E-Mail', value: variables.email },
          { label: 'Telefon', value: variables.phone || '-' },
        ],
      }),
    }),
  ])
}

async function sendCancellationEmails(reservation, token) {
  const fromEmail = getConfiguredFromEmail()
  const ownerEmail = getOwnerEmail(fromEmail)
  const variables = createVariables(reservation, token)
  const rows = [
    { label: 'Terminart', value: variables.service },
    { label: 'Datum', value: `${variables.appointmentDate} bis ${variables.appointmentEnd}` },
    { label: 'Ort', value: variables.address },
  ]

  await Promise.all([
    sendOptionalMail({
      to: reservation.customer.email,
      subject: 'Deine Terminreservierung wurde storniert',
      template: EMAIL_TEMPLATES.cancellationCustomer,
      variables,
      text: textMail([
        `Hallo ${variables.name},`,
        '',
        'deine Terminreservierung wurde storniert.',
        '',
        `Terminart: ${variables.service}`,
        `Datum: ${variables.appointmentDate} bis ${variables.appointmentEnd}`,
        '',
        'Viele Grüße',
        'Hypnose R',
      ]),
      html: renderEmail({
        title: 'Terminreservierung storniert',
        intro: `Hallo ${variables.name}, deine Terminreservierung wurde storniert.`,
        rows,
      }),
    }),
    sendOptionalMail({
      to: ownerEmail,
      fromName: 'Hypnose R Buchung',
      subject: `Termin storniert: ${variables.service}`,
      template: EMAIL_TEMPLATES.cancellationOwner,
      variables,
      text: textMail([
        'Eine Terminreservierung wurde storniert.',
        '',
        `Terminart: ${variables.service}`,
        `Datum: ${variables.appointmentDate} bis ${variables.appointmentEnd}`,
        `Name: ${variables.name}`,
        `E-Mail: ${variables.email}`,
        `Telefon: ${variables.phone || '-'}`,
      ]),
      html: renderEmail({
        title: 'Termin storniert',
        intro: 'Eine Terminreservierung wurde storniert.',
        rows: [
          ...rows,
          { label: 'Name', value: variables.name },
          { label: 'E-Mail', value: variables.email },
          { label: 'Telefon', value: variables.phone || '-' },
        ],
      }),
    }),
  ])
}

export const hypnoseGetAvailableSlots = onRequest(
  {
    region: REGION,
    cors: corsOrigins,
  },
  async (req, res) => {
    try {
      const appointmentType = normalizeAppointmentType(req.query.type)
      await authorizeCalendar()

      const response = await calendar.events.list({
        auth: authClient,
        calendarId: FREE_CALENDAR_ID,
        timeMin: new Date().toISOString(),
        timeMax: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      })

      const slots = (response.data.items || [])
        .filter((event) => event.id && event.summary && event.start && event.end)
        .flatMap((event) => {
          const originalStart = toIsoDate(event.start.dateTime || event.start.date)
          const originalEnd = toIsoDate(event.end.dateTime || event.end.date)

          if (appointmentType === 'intro') {
            if (isIntroSummary(event.summary)) {
              return [
                {
                  id: event.id,
                  start: originalStart,
                  end: originalEnd,
                  summary: '15frei',
                  originalSummary: event.summary,
                  appointmentType,
                },
              ]
            }

            if (isFreeSummary(event.summary)) {
              const introEnd = addMinutes(originalStart, INTRO_DURATION_MINUTES)
              if (isAfter(introEnd, originalEnd)) return []

              return [
                {
                  id: event.id,
                  start: originalStart,
                  end: introEnd,
                  summary: '15frei',
                  originalSummary: event.summary,
                  appointmentType,
                },
              ]
            }

            return []
          }

          if (!isFreeSummary(event.summary)) return []

          return [
            {
              id: event.id,
              start: originalStart,
              end: originalEnd,
              summary: 'Frei',
              originalSummary: event.summary,
              appointmentType,
            },
          ]
        })

      res.status(200).json(slots)
    } catch (error) {
      handleError(res, error)
    }
  },
)

export const hypnoseCreateReservation = onRequest(
  {
    region: REGION,
    cors: corsOrigins,
    secrets: [MAILGUN_API_KEY, SENDGRID_FROM_EMAIL],
  },
  async (req, res) => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'method-not-allowed' })
    }

    try {
      const slotId = cleanText(req.body?.slotId)
      const appointmentType = normalizeAppointmentType(req.body?.appointmentType)
      const appointmentConfig = APPOINTMENT_TYPES[appointmentType]
      const customer = {
        name: cleanText(req.body?.customer?.name),
        email: cleanText(req.body?.customer?.email).toLowerCase(),
        phone: cleanText(req.body?.customer?.phone),
        note: cleanText(req.body?.customer?.note),
      }

      if (
        !slotId ||
        !customer.name ||
        !validateEmail(customer.email) ||
        (appointmentType === 'intro' && !customer.phone)
      ) {
        return res.status(400).json({ error: 'invalid-reservation-data' })
      }

      await authorizeCalendar()
      const calendarEvent = await getCalendarEvent(slotId)

      if (!isBookableSummaryForAppointment(calendarEvent.summary, appointmentType)) {
        const error = new Error('slot-not-free')
        error.status = 409
        throw error
      }

      const token = createToken()
      const originalStart = toIsoDate(calendarEvent.start.dateTime || calendarEvent.start.date)
      const originalEnd = toIsoDate(calendarEvent.end.dateTime || calendarEvent.end.date)
      const reservationEnd =
        appointmentType === 'intro' ? addMinutes(originalStart, INTRO_DURATION_MINUTES) : originalEnd

      if (isAfter(reservationEnd, originalEnd)) {
        const error = new Error('slot-too-short')
        error.status = 409
        throw error
      }

      const reservation = {
        slotId,
        appointmentType,
        serviceLabel: appointmentConfig.serviceLabel,
        originalSummary: calendarEvent.summary || 'Frei',
        originalStart,
        originalEnd,
        status: 'pending',
        start: originalStart,
        end: reservationEnd,
        price: appointmentConfig.price,
        address: appointmentConfig.address,
        paymentMethods: appointmentConfig.paymentMethods,
        customer,
        expiresAt: Timestamp.fromMillis(Date.now() + RESERVATION_EXPIRATION_MS),
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      }

      await db.runTransaction(async (transaction) => {
        const lockRef = slotLocksCollection.doc(slotId)
        const lockSnapshot = await transaction.get(lockRef)
        const lockStatus = lockSnapshot.exists ? lockSnapshot.data()?.status : null

        if (lockStatus === 'pending' || lockStatus === 'confirmed') {
          const error = new Error('slot-already-reserved')
          error.status = 409
          throw error
        }

        transaction.set(reservationsCollection.doc(token), reservation)
        transaction.set(lockRef, {
          token,
          status: 'pending',
          expiresAt: reservation.expiresAt,
          updatedAt: FieldValue.serverTimestamp(),
        })
      })

      const confirmUrl = getConfirmUrl(token)
      const description = buildCalendarDescription(reservation, 'Reserviert - wartet auf Kundenbestätigung', token)
      let createdRemainderSlotIds = []

      try {
        const patchBody = {
          summary: 'Reserviert',
          description,
        }

        if (appointmentType === 'intro') {
          patchBody.start = { dateTime: reservation.start }
          patchBody.end = { dateTime: reservation.end }
        }

        await calendar.events.patch({
          auth: authClient,
          calendarId: FREE_CALENDAR_ID,
          eventId: slotId,
          requestBody: patchBody,
        })

        if (appointmentType === 'intro' && isFreeSummary(calendarEvent.summary)) {
          createdRemainderSlotIds = await createIntroRemainderSlots({
            originalEnd,
            reservedEnd: reservationEnd,
          })

          if (createdRemainderSlotIds.length) {
            reservation.splitSlotIds = createdRemainderSlotIds
            await reservationsCollection.doc(token).update({
              splitSlotIds: createdRemainderSlotIds,
              updatedAt: FieldValue.serverTimestamp(),
            })
          }
        }
      } catch (error) {
        if (createdRemainderSlotIds.length) {
          await deleteFreeCalendarEvents(createdRemainderSlotIds)
        }
        await reservationsCollection.doc(token).update({
          status: 'calendar_error',
          updatedAt: FieldValue.serverTimestamp(),
        })
        await slotLocksCollection.doc(slotId).delete()
        throw error
      }

      try {
        await sendReservationEmails(reservation, token)
      } catch (error) {
        if (createdRemainderSlotIds.length) {
          await deleteFreeCalendarEvents(createdRemainderSlotIds)
        }
        await calendar.events.patch({
          auth: authClient,
          calendarId: FREE_CALENDAR_ID,
          eventId: slotId,
          requestBody: {
            summary: reservation.originalSummary || 'Frei',
            start: { dateTime: reservation.originalStart },
            end: { dateTime: reservation.originalEnd },
            description: '',
          },
        })
        await reservationsCollection.doc(token).delete()
        await slotLocksCollection.doc(slotId).delete()
        throw error
      }

      res.status(201).json({
        ...reservation,
        token,
        confirmUrl,
        createdAt: undefined,
        updatedAt: undefined,
      })
    } catch (error) {
      handleError(res, error)
    }
  },
)

export const hypnoseGetReservation = onRequest(
  {
    region: REGION,
    cors: corsOrigins,
  },
  async (req, res) => {
    try {
      const token = cleanText(req.query.token || req.body?.token)
      const snapshot = await getReservationSnapshot(token)
      res.status(200).json(serializeReservation(snapshot))
    } catch (error) {
      handleError(res, error)
    }
  },
)

export const hypnoseConfirmReservation = onRequest(
  {
    region: REGION,
    cors: corsOrigins,
    secrets: [MAILGUN_API_KEY, SENDGRID_FROM_EMAIL],
  },
  async (req, res) => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'method-not-allowed' })
    }

    let insertedEventId = null

    try {
      const token = cleanText(req.body?.token)
      const snapshot = await getReservationSnapshot(token)
      const reservation = snapshot.data()

      if (reservation.status === 'confirmed') {
        return res.status(200).json(serializeReservation(snapshot))
      }

      if (reservation.status !== 'pending') {
        const error = new Error(`reservation-${reservation.status}`)
        error.status = 409
        throw error
      }

      await authorizeCalendar()
      await getCalendarEvent(reservation.slotId)

      const description = buildCalendarDescription(reservation, 'Verbindlich bestätigt', token)
      const inserted = await calendar.events.insert({
        auth: authClient,
        calendarId: BOOKED_CALENDAR_ID,
        requestBody: {
          summary: `${reservation.serviceLabel || 'Termin'} - ${reservation.customer.name}`,
          start: { dateTime: reservation.start },
          end: { dateTime: reservation.end },
          description,
        },
      })
      insertedEventId = inserted.data.id

      await calendar.events.delete({
        auth: authClient,
        calendarId: FREE_CALENDAR_ID,
        eventId: reservation.slotId,
      })

      await reservationsCollection.doc(token).update({
        status: 'confirmed',
        bookedEventId: insertedEventId,
        confirmedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      })
      await slotLocksCollection.doc(reservation.slotId).set(
        {
          token,
          status: 'confirmed',
          bookedEventId: insertedEventId,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      )

      const confirmedSnapshot = await reservationsCollection.doc(token).get()
      await sendConfirmationEmails(confirmedSnapshot.data(), token)

      res.status(200).json(serializeReservation(confirmedSnapshot))
    } catch (error) {
      if (insertedEventId) {
        try {
          await calendar.events.delete({
            auth: authClient,
            calendarId: BOOKED_CALENDAR_ID,
            eventId: insertedEventId,
          })
        } catch (cleanupError) {
          console.error('Failed to clean up inserted booked event:', cleanupError)
        }
      }

      handleError(res, error)
    }
  },
)

export const hypnoseCancelReservation = onRequest(
  {
    region: REGION,
    cors: corsOrigins,
    secrets: [MAILGUN_API_KEY, SENDGRID_FROM_EMAIL],
  },
  async (req, res) => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'method-not-allowed' })
    }

    try {
      const token = cleanText(req.body?.token)
      const snapshot = await getReservationSnapshot(token)
      const reservation = snapshot.data()

      if (reservation.status === 'cancelled') {
        return res.status(200).json(serializeReservation(snapshot))
      }

      if (reservation.status !== 'pending') {
        const error = new Error('only-pending-reservations-can-be-cancelled')
        error.status = 409
        throw error
      }

      const cancelledSnapshot = await cancelPendingReservation(token, reservation, 'customer')

      res.status(200).json(serializeReservation(cancelledSnapshot))
    } catch (error) {
      handleError(res, error)
    }
  },
)

export const hypnoseExpirePendingReservations = onSchedule(
  {
    region: REGION,
    schedule: 'every 30 minutes',
    timeZone: 'Europe/Berlin',
    secrets: [MAILGUN_API_KEY, SENDGRID_FROM_EMAIL],
  },
  async () => {
    const snapshot = await reservationsCollection.where('status', '==', 'pending').limit(100).get()
    const expiredDocs = snapshot.docs.filter((doc) => isExpiredPendingReservation(doc.data()))

    for (const doc of expiredDocs) {
      try {
        const latestSnapshot = await doc.ref.get()
        if (!latestSnapshot.exists) continue

        const reservation = latestSnapshot.data()
        if (!isExpiredPendingReservation(reservation)) continue

        await cancelPendingReservation(doc.id, reservation, 'expired')
      } catch (error) {
        console.error(`Failed to expire reservation ${doc.id}:`, error)
      }
    }

    console.log(`Expired ${expiredDocs.length} pending reservations.`)
  },
)
