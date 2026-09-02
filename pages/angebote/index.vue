<template>
  <main class="page-flow">
    <DsPageHeader
      eyebrow="Angebot"
      title="Hypnose Angebot in Frankfurt"
      description="Bei Hypnose R kannst du ein kostenloses telefonisches Erstgespräch reservieren oder direkt eine Hypnose im Studio in Frankfurt-Heddernheim buchen."
    />

    <DsSection tone="compact">
      <OfferCards />
    </DsSection>

    <DsSection
      tone="band"
      title="So funktioniert die Reservierung"
      description="Die Terminbuchung läuft online. Nach deiner Anfrage bestätigst du den Termin per E-Mail."
    >
      <DsCardGrid>
        <DsCard
          title="Online reservieren"
          icon="event_available"
          description="Wähle im Kalender eine freie Uhrzeit für das Erstgespräch oder deine Hypnose in Frankfurt."
        />
        <DsCard
          title="E-Mail bestätigen"
          icon="mark_email_read"
          description="Bestätige den Termin über den Link in der E-Mail, damit die Reservierung verbindlich wird."
        />
        <DsCard
          title="Termin wahrnehmen"
          icon="check_circle"
          description="Zur Hypnose treffen wir uns im Studio in Frankfurt-Heddernheim. Für das Erstgespräch rufe ich dich an."
          accent
        />
      </DsCardGrid>
    </DsSection>
  </main>
</template>

<script setup lang="ts">
import { OFFER_SUMMARIES, SITE_URL } from '~/src/constants/site'

usePageSeo({
  title: 'Hypnose Angebot in Frankfurt',
  description:
    'Kostenloses Erstgespräch oder Hypnose in Frankfurt-Heddernheim buchen: ruhige Sitzung im Studio oder telefonische Orientierung bei Hypnose R.',
  path: '/angebote',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: OFFER_SUMMARIES.map((offer, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: offer.title,
      description: offer.description,
      url: `${SITE_URL}/termin-buchen?type=${offer.key}`,
    })),
  },
})
</script>
