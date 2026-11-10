<template>
  <main class="page-flow">
    <BookingWidget />

    <DsSection
      title="Ablauf der Reservierung"
      description="Dein Termin für Erstgespräch oder Hypnose wird zunächst reserviert und danach per E-Mail bestätigt."
    >
      <DsSteps
        :steps="[
          'Terminart und freie Uhrzeit wählen',
          'Reservierung absenden',
          'E-Mail mit Bestätigungslink erhalten',
          'Bestätigen, dass du den Termin wahrnimmst',
        ]"
      />
    </DsSection>

    <DsSection
      tone="band"
      title="Absage oder Umbuchung"
      description="Bis 48 Stunden vor dem Termin ist Absage oder Umbuchung kostenfrei möglich. Danach gelten die Termin- und Sitzungsbedingungen."
    >
      <DsButton to="/terminbedingungen" variant="secondary" icon="description">
        Bedingungen lesen
      </DsButton>
    </DsSection>
  </main>
</template>

<script setup lang="ts">
import BookingWidget from '~/components/BookingWidget.vue'

usePageSeo({
  title: 'Termin für Hypnose oder Erstgespräch buchen',
  description:
    'Reserviere deinen Termin online: 60 Minuten Hypnose in Frankfurt-Heddernheim oder ein kostenloses telefonisches Erstgespräch. Bestätigung per E-Mail.',
  path: '/termin-buchen',
})
</script>
