<template>
  <div class="ds-map-consent">
    <div v-if="!accepted" class="ds-map-consent__placeholder">
      <span class="material-icons" aria-hidden="true">map</span>
      <div>
        <h3>Google Maps laden</h3>
        <p>
          Die interaktive Karte wird erst nach deiner Zustimmung geladen. Dabei können
          Daten an Google übertragen werden.
        </p>
      </div>
      <DsButton type="button" variant="secondary" icon="map" @click="accepted = true">
        Karte anzeigen
      </DsButton>
    </div>
    <iframe
      v-else
      class="ds-map-consent__frame"
      title="Karte zum Studio in Frankfurt-Heddernheim"
      loading="lazy"
      allowfullscreen
      referrerpolicy="no-referrer-when-downgrade"
      :src="mapSrc"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import DsButton from '~/components/design-system/DsButton.vue'

const props = defineProps<{
  address: string
}>()

const accepted = ref(false)
const mapSrc = computed(
  () =>
    `https://www.google.com/maps?q=${encodeURIComponent(props.address)}&output=embed`,
)
</script>
