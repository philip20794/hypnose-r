<template>
  <section class="booking-widget" aria-labelledby="booking-title">
    <div class="booking-widget__intro">
      <p class="ds-eyebrow">Online Termin reservieren</p>
      <h1 id="booking-title">Hypnose Termin buchen</h1>
      <p>
        Reserviere ein kostenloses Erstgespräch oder eine Hypnose in Frankfurt-Heddernheim.
        Wähle dazu Terminart, Tag und freie Uhrzeit.
      </p>
    </div>

    <ClientOnly>
      <div class="booking-grid">
        <DsPanel as="section" class="slot-panel" aria-label="Freie Termine">
          <div class="panel-heading">
            <h2>Termin wählen</h2>
            <DsButton
              variant="secondary"
              icon="refresh"
              :disabled="loadingSlots"
              @click="loadSlots"
            >
              Aktualisieren
            </DsButton>
          </div>

          <div class="appointment-type-picker" role="radiogroup" aria-label="Terminart">
            <button
              v-for="option in appointmentTypeOptions"
              :key="option.value"
              type="button"
              class="appointment-type-option"
              :class="{ 'appointment-type-option--selected': appointmentType === option.value }"
              role="radio"
              :aria-checked="appointmentType === option.value"
              @click="selectAppointmentType(option.value)"
            >
              <span class="appointment-type-option__top">
                <span class="appointment-type-option__icon material-icons" aria-hidden="true">
                  {{ option.icon }}
                </span>
                <span class="appointment-type-option__meta">{{ option.meta }}</span>
              </span>
              <span class="appointment-type-option__label">{{ option.label }}</span>
              <span class="appointment-type-option__description">{{ option.description }}</span>
            </button>
          </div>

          <DsState v-if="loadingSlots">Termine werden geladen.</DsState>
          <DsState v-else-if="slotError" tone="error">{{ slotError }}</DsState>
          <DsState v-else-if="slots.length === 0">
            Für diese Terminart sind aktuell alle sichtbaren Zeiten vergeben.
          </DsState>

          <template v-else>
            <DsDatePicker v-model="selectedDate" :available-dates="availableDateKeys" />

            <div class="slot-times" aria-live="polite">
              <h3>{{ selectedDateLabel }}</h3>
              <DsState v-if="slotsForSelectedDate.length === 0">
                Bitte wähle im Kalender einen Tag mit freien Terminen.
              </DsState>
              <div v-else class="slot-list">
                <DsButton
                  v-for="slot in slotsForSelectedDate"
                  :key="slot.id"
                  type="button"
                  variant="secondary"
                  class="slot-button"
                  :class="{ 'slot-button--selected': selectedSlotId === slot.id }"
                  :aria-pressed="selectedSlotId === slot.id"
                  @click="selectedSlotId = slot.id"
                >
                  <span>{{ formatTimeRange(slot.start, slot.end) }}</span>
                  <strong>frei</strong>
                </DsButton>
              </div>
            </div>
          </template>
        </DsPanel>

        <DsPanel
          as="form"
          class="person-panel"
          :aria-busy="submitting ? 'true' : 'false'"
          @submit.prevent="submitReservation"
        >
          <div class="panel-heading">
            <h2>Deine Angaben</h2>
          </div>

          <div v-if="selectedSlot" class="ds-state ds-state--success selected-summary">
            <strong>{{ selectedAppointmentLabel }}</strong>
            <strong>{{ formatDateTime(selectedSlot.start) }}</strong>
          </div>
          <DsState v-else class="selected-summary selected-summary--empty">
            Bitte wähle zuerst einen freien Termin.
          </DsState>

          <DsTextField v-model="customer.name" label="Name" autocomplete="name" required />

          <DsTextField
            v-model="customer.email"
            label="E-Mail"
            type="email"
            autocomplete="email"
            inputmode="email"
            required
          />

          <DsTextField
            v-model="customer.phone"
            :label="phoneLabel"
            type="tel"
            autocomplete="tel"
            inputmode="tel"
            :required="isPhoneRequired"
          />

          <DsTextarea
            v-model="customer.note"
            label="Was möchtest du vorab mitteilen? (freiwillig)"
            :rows="5"
          />

          <DsCheckbox v-model="acceptedTerms">
            Ich akzeptiere die
            <NuxtLink to="/terminbedingungen">Termin- und Sitzungsbedingungen</NuxtLink>
            und habe die
            <NuxtLink to="/datenschutz">Datenschutzerklärung</NuxtLink>
            gelesen.
          </DsCheckbox>

          <DsState v-if="submitError" tone="error">{{ submitError }}</DsState>

          <DsProcessStatus
            v-if="submitting"
            title="Reservierung wird verarbeitet"
            :steps="reservationProgressSteps"
          />

          <DsButton type="submit" icon="send" :disabled="submitDisabled" :loading="submitting">
            Reservierung anfragen
          </DsButton>
        </DsPanel>
      </div>

      <template #fallback>
        <div class="booking-grid">
          <section class="ds-panel ds-panel--padded">
            <div class="panel-heading">
              <h2>Freie Termine</h2>
            </div>
            <div class="ds-state">Termine werden geladen.</div>
          </section>
        </div>
      </template>
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import DsButton from '~/components/design-system/DsButton.vue'
import DsCheckbox from '~/components/design-system/DsCheckbox.vue'
import DsDatePicker from '~/components/design-system/DsDatePicker.vue'
import DsPanel from '~/components/design-system/DsPanel.vue'
import DsProcessStatus from '~/components/design-system/DsProcessStatus.vue'
import DsState from '~/components/design-system/DsState.vue'
import DsTextField from '~/components/design-system/DsTextField.vue'
import DsTextarea from '~/components/design-system/DsTextarea.vue'
import { APPOINTMENT_TYPES } from '~/src/constants/site'
import { createReservation, fetchSlots } from '~/src/services/api'
import type { AppointmentType, Slot } from '~/src/types/booking'
import { formatDateLong, formatDateTime, formatTimeRange } from '~/src/utils/date'

const route = useRoute()

const appointmentType = ref<AppointmentType>(normalizeAppointmentType(route.query.type))
const slots = ref<Slot[]>([])
const selectedDate = ref('')
const selectedSlotId = ref('')
const loadingSlots = ref(true)
const submitting = ref(false)
const slotError = ref('')
const submitError = ref('')
const acceptedTerms = ref(false)

const reservationProgressSteps = [
  'Der Termin wird vorläufig reserviert.',
  'Die Bestätigungs-E-Mail wird vorbereitet.',
  'Die Reservierung wird abgeschlossen.',
  'Du wirst gleich weitergeleitet.',
] as const

const appointmentTypeOptions: Array<{
  label: string
  value: AppointmentType
  icon: string
  meta: string
  description: string
}> = [
  {
    label: APPOINTMENT_TYPES.intro.shortTitle,
    value: 'intro',
    icon: APPOINTMENT_TYPES.intro.icon,
    meta: `${APPOINTMENT_TYPES.intro.duration} · ${APPOINTMENT_TYPES.intro.price}`,
    description: 'Kostenloses Telefonat für Fragen und erste Orientierung.',
  },
  {
    label: APPOINTMENT_TYPES.hypnosis.title,
    value: 'hypnosis',
    icon: APPOINTMENT_TYPES.hypnosis.icon,
    meta: `${APPOINTMENT_TYPES.hypnosis.duration} · ${APPOINTMENT_TYPES.hypnosis.price}`,
    description: 'Ruhige Sitzung im Studio in Frankfurt-Heddernheim.',
  },
]

const customer = reactive({
  name: '',
  email: '',
  phone: '',
  note: '',
})

const selectedSlot = computed(() => slots.value.find((slot) => slot.id === selectedSlotId.value))
const selectedAppointmentLabel = computed(() => APPOINTMENT_TYPES[appointmentType.value].title)
const isPhoneRequired = computed(() => APPOINTMENT_TYPES[appointmentType.value].phoneRequired)
const phoneLabel = computed(() => (isPhoneRequired.value ? 'Telefon' : 'Telefon (optional)'))
const availableDateKeys = computed(() =>
  Array.from(new Set(slots.value.map((slot) => formatDateKey(slot.start)))),
)
const slotsForSelectedDate = computed(() =>
  slots.value.filter((slot) => formatDateKey(slot.start) === selectedDate.value),
)
const selectedDateLabel = computed(() => {
  const slot = slotsForSelectedDate.value[0]
  return slot ? formatDateLong(slot.start) : 'Freie Uhrzeiten'
})
const customerReady = computed(
  () =>
    Boolean(customer.name.trim()) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim()) &&
    (!isPhoneRequired.value || Boolean(customer.phone.trim())) &&
    acceptedTerms.value,
)
const submitDisabled = computed(() => submitting.value || !selectedSlot.value || !customerReady.value)

function normalizeAppointmentType(value: unknown): AppointmentType {
  const candidate = Array.isArray(value) ? value[0] : value
  return candidate === 'hypnosis' ? 'hypnosis' : 'intro'
}

function formatDateKey(value: string) {
  const parts = new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Europe/Berlin',
  }).formatToParts(new Date(value))
  const year = parts.find((part) => part.type === 'year')?.value || ''
  const month = parts.find((part) => part.type === 'month')?.value || ''
  const day = parts.find((part) => part.type === 'day')?.value || ''
  return `${year}/${month}/${day}`
}

function selectAppointmentType(type: AppointmentType) {
  if (appointmentType.value === type) return
  appointmentType.value = type
}

async function loadSlots() {
  loadingSlots.value = true
  slotError.value = ''
  selectedSlotId.value = ''

  try {
    slots.value = await fetchSlots(appointmentType.value)
    selectedDate.value = availableDateKeys.value[0] || ''
    selectedSlotId.value = slotsForSelectedDate.value[0]?.id || ''
  } catch {
    slotError.value = 'Termine konnten nicht geladen werden.'
    slots.value = []
    selectedDate.value = ''
  } finally {
    loadingSlots.value = false
  }
}

async function submitReservation() {
  if (!selectedSlot.value) return

  submitting.value = true
  submitError.value = ''

  try {
    const reservation = await createReservation({
      slotId: selectedSlot.value.id,
      appointmentType: appointmentType.value,
      customer: {
        name: customer.name.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim(),
        note: customer.note.trim(),
      },
    })

    await navigateTo(`/termin-reserviert?token=${encodeURIComponent(reservation.token)}`)
  } catch {
    submitError.value =
      'Die Reservierung konnte nicht gespeichert werden. Bitte wähle einen anderen Termin oder versuche es erneut.'
  } finally {
    submitting.value = false
  }
}

watch(appointmentType, loadSlots)

watch(
  () => route.query.type,
  (value) => {
    const nextType = normalizeAppointmentType(value)
    if (appointmentType.value !== nextType) {
      appointmentType.value = nextType
    }
  },
)

watch(selectedDate, () => {
  if (!slotsForSelectedDate.value.some((slot) => slot.id === selectedSlotId.value)) {
    selectedSlotId.value = slotsForSelectedDate.value[0]?.id || ''
  }
})

onMounted(loadSlots)
</script>
