import type { AppointmentType } from '../types/booking'

export const SITE_NAME = 'Hypnose R'
export const SITE_URL = 'https://hypnose-r.de'
export const SITE_DESCRIPTION =
  'Hypnose in Frankfurt-Heddernheim bei Runa Weiland: ruhige Sitzungen für Entspannung, mentale Regeneration und persönliche Zielarbeit.'
export const OWNER_NAME = 'Runa Weiland'
export const BOOKING_ADDRESS = 'Alt-Heddernheim 43, 60439 Frankfurt am Main'
export const CONTACT_EMAIL = 'info@hypnose-r.de'
export const CONTACT_PHONE = '+49 1523 3542001'
export const WHATSAPP_NUMBER = '+4915233542001'
export const WHATSAPP_DISPLAY_NUMBER = '+49 1523 3542001'
export const SOCIAL_IMAGE = '/images/preview-1200x630.png'
export const PROFILE_IMAGE = '/images/runa-weiland-portrait.jpg'
export const HYPNOSIS_PRICE_EUR = 120

export type SeoRoute = {
  path: string
  priority: number
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
}

export const MAIN_NAV_ITEMS = [
  { label: 'Startseite', to: '/' },
  { label: 'Angebot', to: '/angebote' },
  { label: 'Hypnose', to: '/hypnose' },
  { label: 'Über mich', to: '/ueber-mich' },
  { label: 'Preise', to: '/preise' },
  { label: 'Kontakt', to: '/kontakt' },
] as const

export const FOOTER_NAV_ITEMS = [
  { label: 'Impressum', to: '/impressum' },
  { label: 'Datenschutz', to: '/datenschutz' },
  { label: 'Termin- und Sitzungsbedingungen', to: '/terminbedingungen' },
] as const

export const APPOINTMENT_TYPES: Record<
  AppointmentType,
  {
    title: string
    shortTitle: string
    description: string
    duration: string
    price: string
    icon: string
    location: string
    phoneRequired: boolean
    calendarSummary: '15frei' | 'Frei'
  }
> = {
  intro: {
    title: 'Kostenloses Erstgespräch',
    shortTitle: 'Erstgespräch',
    description:
      'Ein kostenloses Telefonat für Fragen zu Hypnose in Frankfurt-Heddernheim, zum Ablauf und für eine erste Orientierung. Ich rufe dich zum gebuchten Zeitpunkt an.',
    duration: '15 Minuten',
    price: '0 EUR',
    icon: 'phone_in_talk',
    location: 'Telefonisch',
    phoneRequired: true,
    calendarSummary: '15frei',
  },
  hypnosis: {
    title: 'Hypnose',
    shortTitle: 'Hypnose',
    description:
      'Eine ruhige Hypnosesitzung im Studio in Frankfurt-Heddernheim für Entspannung, mentale Regeneration und persönliche Zielarbeit.',
    duration: '60 Minuten',
    price: `${HYPNOSIS_PRICE_EUR} EUR`,
    icon: 'self_improvement',
    location: BOOKING_ADDRESS,
    phoneRequired: false,
    calendarSummary: 'Frei',
  },
}

export const OFFER_SUMMARIES = [
  {
    key: 'intro',
    title: APPOINTMENT_TYPES.intro.title,
    icon: APPOINTMENT_TYPES.intro.icon,
    description: APPOINTMENT_TYPES.intro.description,
  },
  {
    key: 'hypnosis',
    title: APPOINTMENT_TYPES.hypnosis.title,
    icon: APPOINTMENT_TYPES.hypnosis.icon,
    description: APPOINTMENT_TYPES.hypnosis.description,
  },
] as const

export const SESSION_STEPS = [
  'Anliegen und Erwartungen an die Hypnose kurz klären',
  'Ablauf und Fragen besprechen',
  'Geführte Hypnose- beziehungsweise Entspannungsphase',
  'Ruhige Rücknahme und kurze Nachbesprechung',
] as const

export const PRICE_ITEMS = [
  {
    title: APPOINTMENT_TYPES.intro.title,
    details: '15 Minuten, telefonisch',
    price: APPOINTMENT_TYPES.intro.price,
    bookingType: 'intro',
    note: 'Ich rufe dich zum gebuchten Zeitpunkt an.',
  },
  {
    title: APPOINTMENT_TYPES.hypnosis.title,
    details: '60 Minuten im Studio in Frankfurt-Heddernheim',
    price: APPOINTMENT_TYPES.hypnosis.price,
    bookingType: 'hypnosis',
    note: 'Bei mir im Studio.',
  },
] as const

export const HOME_FAQS = [] as const

export const HYPNOSE_FAQS = [
  {
    question: 'Kann jeder hypnotisiert werden?',
    answer:
      'Ja, grundsätzlich schon. Hypnose funktioniert jedoch nicht gegen den eigenen Willen und erfordert die Bereitschaft, sich darauf einzulassen.',
  },
  {
    question: 'Was passiert, wenn ich nicht entspannen kann?',
    answer:
      'Viele Menschen brauchen etwas Zeit, um zur Ruhe zu kommen. Das ist ganz normal. Ich begleite dich Schritt für Schritt, sodass du dich in deinem eigenen Tempo auf die Hypnose einlassen kannst.',
  },
  {
    question: 'Bin ich während der Hypnose ansprechbar?',
    answer:
      'Ja, du bleibst während der Hypnose ansprechbar und kannst jederzeit reagieren. Meistens geschieht das jedoch nur durch ein Nicken, ein kurzes Wort oder eine kleine Bewegung.',
  },
  {
    question: 'Muss ich persönliche Dinge erzählen?',
    answer:
      'Nur so viel, wie für den Rahmen sinnvoll ist und du freiwillig mitteilen möchtest.',
  },
  {
    question: 'Wo findet die Hypnose statt?',
    answer:
      'Die Hypnosesitzung findet im Studio von Hypnose R in Frankfurt-Heddernheim statt. Das kostenlose Erstgespräch ist telefonisch.',
  },
] as const

export const SEO_ROUTES: readonly SeoRoute[] = [
  { path: '/', priority: 1, changefreq: 'weekly' },
  { path: '/angebote', priority: 0.85, changefreq: 'monthly' },
  { path: '/hypnose', priority: 0.8, changefreq: 'monthly' },
  { path: '/ueber-mich', priority: 0.7, changefreq: 'monthly' },
  { path: '/preise', priority: 0.85, changefreq: 'monthly' },
  { path: '/termin-buchen', priority: 0.95, changefreq: 'weekly' },
  { path: '/kontakt', priority: 0.8, changefreq: 'monthly' },
  { path: '/impressum', priority: 0.4, changefreq: 'yearly' },
  { path: '/datenschutz', priority: 0.4, changefreq: 'yearly' },
  { path: '/terminbedingungen', priority: 0.45, changefreq: 'yearly' },
  { path: '/allgemeinegeschaeftsbedingungen', priority: 0.4, changefreq: 'yearly' },
] as const

export function getWhatsappUrl() {
  if (!WHATSAPP_NUMBER) return ''

  const digits = WHATSAPP_NUMBER.replace(/\D/g, '')
  const normalizedNumber = digits.startsWith('00')
    ? digits.slice(2)
    : digits.startsWith('0')
      ? `49${digits.slice(1)}`
      : digits
  const phoneNumber = `+${normalizedNumber}`
  const message = encodeURIComponent('Hallo')

  return `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`
}
