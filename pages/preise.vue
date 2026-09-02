<template>
  <main class="page-flow">
    <DsPageHeader
      eyebrow="Preise"
      title="Preise für Hypnose in Frankfurt"
      description="Das telefonische Erstgespräch ist kostenlos. Die Hypnose im Studio in Frankfurt-Heddernheim dauert 60 Minuten und kostet 120 EUR."
    >
    </DsPageHeader>

    <DsSection tone="compact">
      <DsPriceTable :items="PRICE_ITEMS" />
    </DsSection>

    <DsSection
      tone="band"
      title="Zahlung und Bestätigung"
      description="Die Buchung wird erst nach deiner E-Mail-Bestätigung verbindlich. Bezahlt wird nicht im Voraus über die Website."
    >
      <DsCardGrid columns="two">
        <DsCard title="Zahlung" icon="payments">
          <p class="ds-card__copy">
            Vor Ort kannst du kontaktlos oder in bar bezahlen. Alternativ scannst du einen
            QR-Code und zahlst über Stripe, zum Beispiel mit Amazon Pay, Apple Pay, Google Pay,
            PayPal, Klarna, Link, SEPA-Lastschrift, Banküberweisung und weiteren Zahlungsarten.
          </p>
        </DsCard>
        <DsCard title="Bestätigung per E-Mail" icon="mark_email_read" accent>
          <p class="ds-card__copy">
            Nach der Reservierung bekommst du eine E-Mail. Der Termin wird erst verbindlich,
            wenn du bestätigst, dass du ihn wahrnimmst.
          </p>
        </DsCard>
      </DsCardGrid>
    </DsSection>
  </main>
</template>

<script setup lang="ts">
import { PRICE_ITEMS, SITE_URL } from '~/src/constants/site'

usePageSeo({
  title: 'Hypnose Preise Frankfurt',
  description:
    'Preise für Hypnose in Frankfurt-Heddernheim: kostenloses Erstgespräch und 60 Minuten Hypnose im Studio bei Hypnose R.',
  path: '/preise',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'Hypnose Preise Frankfurt-Heddernheim',
    itemListElement: PRICE_ITEMS.map((item) => ({
      '@type': 'Offer',
      name: item.title,
      description: `${item.details}. ${item.note}`,
      url: `${SITE_URL}/termin-buchen?type=${item.bookingType}`,
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'EUR',
        price: item.price.replace(' EUR', ''),
      },
    })),
  },
})
</script>
