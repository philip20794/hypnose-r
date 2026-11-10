<template>
  <main class="confirmation-page">
    <DsPanel as="section" class="confirmation-panel">
      <NuxtLink class="back-link" to="/termin-buchen">Zur Terminbuchung</NuxtLink>

      <DsState v-if="loading">Termin wird geladen.</DsState>
      <DsState v-else-if="errorMessage" tone="error">{{ errorMessage }}</DsState>

      <template v-else-if="reservation">
        <p class="ds-eyebrow">{{ pageEyebrow }}</p>
        <h1>{{ pageTitle }}</h1>
        <p class="confirmation-copy">{{ pageDescription }}</p>

        <DsBadge :tone="statusTone">
          {{ statusLabel }}
        </DsBadge>

        <dl class="details-list">
          <div>
            <dt>Terminart</dt>
            <dd>{{ reservation.serviceLabel }}</dd>
          </div>
          <div>
            <dt>Termin</dt>
            <dd>{{ formatDateTime(reservation.start) }} bis {{ formatTimeRange(reservation.start, reservation.end).split(' - ')[1] }}</dd>
          </div>
          <div>
            <dt>Name</dt>
            <dd>{{ reservation.customer.name }}</dd>
          </div>
          <div>
            <dt>E-Mail</dt>
            <dd>{{ reservation.customer.email }}</dd>
          </div>
          <div>
            <dt>Telefon</dt>
            <dd>{{ reservation.customer.phone }}</dd>
          </div>
          <div>
            <dt>Ort</dt>
            <dd>{{ reservation.address }}</dd>
          </div>
          <div>
            <dt>Preis</dt>
            <dd>{{ reservation.price > 0 ? `${reservation.price} EUR` : 'kostenlos' }}</dd>
          </div>
          <div>
            <dt>Zahlung</dt>
            <dd>{{ reservation.paymentMethods }}</dd>
          </div>
          <div v-if="reservation.customer.note">
            <dt>Nachricht</dt>
            <dd>{{ reservation.customer.note }}</dd>
          </div>
        </dl>

        <DsState v-if="reservation.status === 'confirmed'" tone="success" icon="check_circle">
          Der Termin ist jetzt verbindlich eingetragen. Du bekommst zusätzlich eine Bestätigung per E-Mail.
        </DsState>

        <DsState v-if="reservation.status === 'confirmed'" tone="warning" icon="mark_email_unread">
          Falls die E-Mail nicht direkt sichtbar ist, prüfe bitte auch Spam, Werbung, Promotions oder Benachrichtigungen.
        </DsState>

        <DsState v-else-if="reservation.status === 'cancelled'" tone="warning" icon="event_busy">
          Diese Reservierung ist storniert. Der Termin ist nicht mehr für dich vorgemerkt.
        </DsState>

        <div v-if="reservation.canConfirm" class="confirmation-actions">
          <p class="legal-consent">
            Mit der verbindlichen Bestätigung stimmst du den
            <NuxtLink to="/terminbedingungen" target="_blank">
              Termin- und Sitzungsbedingungen
            </NuxtLink>
            und der
            <NuxtLink to="/datenschutz" target="_blank">
              Datenschutzerklärung
            </NuxtLink>
            zu.
          </p>

          <DsProcessStatus
            v-if="actionLoading"
            :title="actionStatusTitle"
            :steps="actionStatusSteps"
          />

          <DsButton
            size="large"
            icon="check_circle"
            :disabled="actionLoading"
            :loading="actionLoading"
            full-width
            @click="confirm"
          >
            Verbindlich bestätigen
          </DsButton>
          <DsButton
            variant="secondary"
            icon="close"
            :disabled="actionLoading"
            @click="showCancelDialog = true"
          >
            Stornieren
          </DsButton>
        </div>
      </template>
    </DsPanel>

    <DsDialog v-model="showCancelDialog" title="Termin wirklich stornieren?">
      <p>Deine Reservierung wird storniert und der Termin ist danach nicht mehr für dich vorgemerkt.</p>
      <DsProcessStatus
        v-if="actionLoading"
        :title="actionStatusTitle"
        :steps="actionStatusSteps"
      />
      <template #actions>
        <DsButton variant="secondary" @click="showCancelDialog = false">
          Zurück
        </DsButton>
        <DsButton
          variant="danger"
          icon="delete"
          :disabled="actionLoading"
          :loading="actionLoading"
          @click="cancel"
        >
          Ja, stornieren
        </DsButton>
      </template>
    </DsDialog>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DsBadge from '~/components/design-system/DsBadge.vue'
import DsButton from '~/components/design-system/DsButton.vue'
import DsDialog from '~/components/design-system/DsDialog.vue'
import DsPanel from '~/components/design-system/DsPanel.vue'
import DsProcessStatus from '~/components/design-system/DsProcessStatus.vue'
import DsState from '~/components/design-system/DsState.vue'
import {
  cancelReservation,
  confirmReservation,
  fetchReservation,
} from '~/src/services/api'
import type { Reservation } from '~/src/types/booking'
import { formatDateTime, formatTimeRange } from '~/src/utils/date'

const route = useRoute()
const token = computed(() => String(route.params.token || ''))
const reservation = ref<Reservation | null>(null)
const loading = ref(true)
const actionLoading = ref(false)
const actionType = ref<'cancel' | 'confirm' | null>(null)
const showCancelDialog = ref(false)
const errorMessage = ref('')

const pageEyebrow = computed(() => {
  switch (reservation.value?.status) {
    case 'confirmed':
      return 'Termin bestätigt'
    case 'cancelled':
      return 'Reservierung storniert'
    default:
      return 'Terminbestätigung'
  }
})

const pageTitle = computed(() => {
  switch (reservation.value?.status) {
    case 'confirmed':
      return 'Dein Termin ist bestätigt'
    case 'cancelled':
      return 'Diese Reservierung ist storniert'
    default:
      return 'Termin prüfen und bestätigen'
  }
})

const pageDescription = computed(() => {
  switch (reservation.value?.status) {
    case 'confirmed':
      return 'Der Termin ist verbindlich für dich gebucht. Du bekommst zusätzlich eine Bestätigung per E-Mail.'
    case 'cancelled':
      return reservation.value?.cancellationReason === 'expired'
        ? 'Die Reservierung wurde nicht innerhalb von 48 Stunden bestätigt und deshalb automatisch storniert.'
        : 'Der Termin ist nicht mehr für dich reserviert.'
    default:
      return 'Bitte prüfe deine Angaben. Erst mit der verbindlichen Bestätigung wird der Termin endgültig eingetragen.'
  }
})

const statusTone = computed<'cancelled' | 'confirmed' | 'neutral' | 'pending'>(() => {
  switch (reservation.value?.status) {
    case 'cancelled':
      return 'cancelled'
    case 'confirmed':
      return 'confirmed'
    case 'pending':
      return 'pending'
    default:
      return 'neutral'
  }
})

const statusLabel = computed(() => {
  switch (reservation.value?.status) {
    case 'pending':
      return 'Wartet auf deine Bestätigung'
    case 'confirmed':
      return 'Verbindlich bestätigt'
    case 'cancelled':
      return reservation.value?.cancellationReason === 'expired'
        ? 'Automatisch storniert'
        : 'Storniert'
    default:
      return 'Status offen'
  }
})

const actionStatusTitle = computed(() =>
  actionType.value === 'cancel'
    ? 'Stornierung wird verarbeitet'
    : 'Bestätigung wird verarbeitet',
)

const actionStatusSteps = computed(() =>
  actionType.value === 'cancel'
    ? [
        'Die Reservierung wird storniert.',
        'Der Termin ist danach nicht mehr für dich vorgemerkt.',
        'Die Storno-E-Mail wird versendet.',
        'Die Stornierung wird abgeschlossen.',
      ]
    : [
        'Der Termin wird verbindlich für dich gebucht.',
        'Deine Bestätigung wird gespeichert.',
        'Die Bestätigungs-E-Mail wird versendet.',
        'Die Bestätigung wird abgeschlossen.',
      ],
)

async function loadReservation() {
  loading.value = true
  errorMessage.value = ''

  try {
    reservation.value = await fetchReservation(token.value)
  } catch {
    errorMessage.value = 'Dieser Bestätigungslink ist ungültig oder abgelaufen.'
  } finally {
    loading.value = false
  }
}

async function confirm() {
  actionLoading.value = true
  actionType.value = 'confirm'
  errorMessage.value = ''

  try {
    reservation.value = await confirmReservation(token.value)
  } catch {
    errorMessage.value = 'Der Termin konnte nicht verbindlich bestätigt werden.'
  } finally {
    actionLoading.value = false
    actionType.value = null
  }
}

async function cancel() {
  actionLoading.value = true
  actionType.value = 'cancel'
  errorMessage.value = ''

  try {
    reservation.value = await cancelReservation(token.value)
    showCancelDialog.value = false
  } catch {
    errorMessage.value = 'Der Termin konnte nicht storniert werden.'
  } finally {
    actionLoading.value = false
    actionType.value = null
  }
}

useSeoMeta({
  title: 'Termin bestätigen | Hypnose R',
  description:
    'Bestätigung oder Stornierung einer privaten Terminreservierung bei Hypnose R in Frankfurt-Heddernheim.',
  robots: 'noindex, nofollow',
})

onMounted(loadReservation)
</script>
