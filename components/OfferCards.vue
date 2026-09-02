<template>
  <DsCardGrid columns="two">
    <DsCard
      v-for="offer in OFFER_SUMMARIES"
      :key="offer.key"
      class="offer-card"
      :title="offer.title"
      :description="offer.description"
      :icon="offer.icon"
      :accent="offer.key === 'hypnosis'"
    >
      <DsMetaList :items="getOfferMetaItems(offer.key)" />
      <template #actions>
        <DsButton :to="`/termin-buchen?type=${offer.key}`" variant="ghost" icon="event_available">
          Termin w&auml;hlen
        </DsButton>
      </template>
    </DsCard>
  </DsCardGrid>
</template>

<script setup lang="ts">
import type { AppointmentType } from '~/src/types/booking'
import { APPOINTMENT_TYPES, OFFER_SUMMARIES } from '~/src/constants/site'

function getOfferMetaItems(key: AppointmentType) {
  return [
    { label: 'Dauer', value: APPOINTMENT_TYPES[key].duration },
    { label: 'Preis', value: APPOINTMENT_TYPES[key].price },
    { label: 'Ort', value: APPOINTMENT_TYPES[key].location },
  ] as const
}
</script>
