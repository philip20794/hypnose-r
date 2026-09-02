<template>
  <main>
    <DsPageHeader
      eyebrow="Reservierung angekommen"
      title="Bitte bestätige deinen Termin per E-Mail"
      description="Dein Termin bei Hypnose R ist vorläufig reserviert. Öffne die E-Mail und bestätige den Termin über den Link. Erst danach ist die Reservierung verbindlich eingetragen."
    >
      <template #actions>
        <DsButton to="/" variant="secondary" icon="home">Zur Startseite</DsButton>
        <DsButton to="/termin-buchen" variant="ghost" icon="event">Weitere Termine</DsButton>
      </template>
    </DsPageHeader>

    <DsSection title="So geht es weiter" variant="band">
      <DsState tone="warning" icon="mark_email_unread" class="mail-hint">
        Die E-Mail kann je nach Postfach auch im Spam-Ordner, unter Werbung, Promotions oder Benachrichtigungen landen.
      </DsState>

      <DsSteps
        :steps="[
          'E-Mail-Postfach öffnen',
          'Bestätigungslink in der Mail anklicken',
          'Termin verbindlich bestätigen',
          'Ohne Bestätigung wird die Reservierung nach 48 Stunden automatisch storniert',
        ]"
      />
    </DsSection>

    <DsSection title="Deine Reservierung" compact>
      <DsState v-if="loading">Reservierung wird geladen.</DsState>
      <DsState v-else-if="errorMessage" tone="warning">{{ errorMessage }}</DsState>

      <DsPanel v-else-if="reservation" class="reservation-summary">
        <DsBadge tone="pending">Wartet auf Bestätigung</DsBadge>
        <dl class="details-list">
          <div>
            <dt>Terminart</dt>
            <dd>{{ reservation.serviceLabel }}</dd>
          </div>
          <div>
            <dt>Termin</dt>
            <dd>{{ formatDateTime(reservation.start) }} bis {{ endTime }}</dd>
          </div>
          <div>
            <dt>Name</dt>
            <dd>{{ reservation.customer.name }}</dd>
          </div>
          <div>
            <dt>E-Mail</dt>
            <dd>{{ reservation.customer.email }}</dd>
          </div>
          <div v-if="reservation.customer.phone">
            <dt>Telefon</dt>
            <dd>{{ reservation.customer.phone }}</dd>
          </div>
          <div>
            <dt>Ort</dt>
            <dd>{{ reservation.address }}</dd>
          </div>
          <div v-if="expiresAtLabel">
            <dt>Bestätigen bis</dt>
            <dd>{{ expiresAtLabel }}</dd>
          </div>
        </dl>
      </DsPanel>

      <DsState v-else tone="warning">
        Die Reservierung wurde gespeichert. Bitte prüfe dein E-Mail-Postfach und bestätige den Termin dort.
      </DsState>
    </DsSection>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DsBadge from '~/components/design-system/DsBadge.vue'
import DsButton from '~/components/design-system/DsButton.vue'
import DsPageHeader from '~/components/design-system/DsPageHeader.vue'
import DsPanel from '~/components/design-system/DsPanel.vue'
import DsSection from '~/components/design-system/DsSection.vue'
import DsState from '~/components/design-system/DsState.vue'
import DsSteps from '~/components/design-system/DsSteps.vue'
import { fetchReservation } from '~/src/services/api'
import type { Reservation } from '~/src/types/booking'
import { formatDateTime, formatTimeRange } from '~/src/utils/date'

const route = useRoute()
const token = computed(() => String(route.query.token || ''))
const reservation = ref<Reservation | null>(null)
const loading = ref(Boolean(token.value))
const errorMessage = ref('')

const endTime = computed(() => {
  if (!reservation.value) return ''
  return formatTimeRange(reservation.value.start, reservation.value.end).split(' - ')[1] || ''
})

const expiresAtLabel = computed(() => {
  if (!reservation.value?.expiresAt) return ''
  return formatDateTime(reservation.value.expiresAt)
})

async function loadReservation() {
  if (!token.value) return

  loading.value = true
  errorMessage.value = ''

  try {
    reservation.value = await fetchReservation(token.value)
  } catch {
    errorMessage.value =
      'Die Reservierung wurde gespeichert, aber die Detailansicht konnte gerade nicht geladen werden. Bitte prüfe trotzdem dein E-Mail-Postfach.'
  } finally {
    loading.value = false
  }
}

useSeoMeta({
  title: 'Reservierung angekommen | Hypnose R',
  description:
    'Die Reservierung für Erstgespräch oder Hypnose bei Hypnose R ist angekommen und wird per E-Mail bestätigt.',
  robots: 'noindex, nofollow',
})

onMounted(loadReservation)
</script>
