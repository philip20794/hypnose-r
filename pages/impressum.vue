<template>
  <DsLegalDocument
    title="Impressum"
    description="Anbieterangaben und Kontakt zu Hypnose R in Frankfurt-Heddernheim."
  >
    <h2>Anbieter</h2>
    <p>
      {{ SITE_NAME }}<br />
      {{ OWNER_NAME }}<br />
      {{ BOOKING_ADDRESS }}
    </p>
    <h2>Kontakt</h2>
    <p>
      E-Mail: {{ CONTACT_EMAIL }}<br />
      Telefon: {{ CONTACT_PHONE }}
    </p>
  </DsLegalDocument>
</template>

<script setup lang="ts">
import {
  BOOKING_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  OWNER_NAME,
  SITE_NAME,
} from '~/src/constants/site'

usePageSeo({
  title: 'Impressum Hypnose R Frankfurt',
  description: 'Impressum, Anbieterangaben und Kontaktinformationen von Hypnose R in Frankfurt-Heddernheim.',
  path: '/impressum',
})
</script>
