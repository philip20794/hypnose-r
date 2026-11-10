<template>
  <main class="page-flow">
    <DsPageHeader
      eyebrow="Kontakt"
      title="Kontakt für Hypnose in Frankfurt"
      description="Hypnose R findest du in Alt-Heddernheim 43 in Frankfurt am Main. Für Fragen erreichst du mich per WhatsApp oder E-Mail, Termine reservierst du direkt online."
    >
      <template #actions>
        <DsButton
          v-if="whatsappUrl"
          class="contact-whatsapp-button"
          :href="whatsappUrl"
          target="_blank"
          rel="noopener"
          icon-src="/images/whatsapp.svg"
        >
          WhatsApp
        </DsButton>
        <DsButton to="/termin-buchen" variant="secondary" icon="event_available">
          Termin buchen
        </DsButton>
      </template>
    </DsPageHeader>

    <DsSection tone="compact">
      <div class="contact-layout">
        <DsPanel class="contact-panel">
          <p class="ds-eyebrow">Direktkontakt</p>
          <h2>Fragen zu Hypnose R</h2>

          <div class="contact-links">
            <DsContactLink
              v-if="whatsappUrl"
              :href="whatsappUrl"
              target="_blank"
              rel="noopener"
              tone="whatsapp"
              label="WhatsApp"
              :value="WHATSAPP_DISPLAY_NUMBER"
            />
            <DsContactLink
              :href="`mailto:${CONTACT_EMAIL}`"
              icon="mail"
              label="E-Mail"
              :value="CONTACT_EMAIL"
            />
          </div>

          <p class="contact-note">
            Anrufe werden nicht entgegengenommen. Wenn du telefonieren möchtest, buch bitte ein kostenloses Erstgespräch.
          </p>
        </DsPanel>

        <DsPanel class="contact-panel">
          <p class="ds-eyebrow">Studio</p>
          <h2>Hypnose in Frankfurt-Heddernheim</h2>
          <DsMetaList
            :items="[
              { label: 'Name', value: SITE_NAME },
              { label: 'Adresse', value: BOOKING_ADDRESS },
              { label: 'U-Bahn-Station', value: 'Heddernheim (U1, U2, U3, U8), dann ca. 10 Min. zu Fuß' },
            ]"
          />
          <div class="ds-actions">
            <ClientOnly>
              <DsMapConsent :address="BOOKING_ADDRESS" />
              <template #fallback>
                <DsState>Karte wird geladen.</DsState>
              </template>
            </ClientOnly>
          </div>
        </DsPanel>
      </div>
    </DsSection>

  </main>
</template>

<script setup lang="ts">
import studioImage from '~/assets/hypnose_studio-optimized.jpg'
import {
  BOOKING_ADDRESS,
  CONTACT_EMAIL,
  SITE_NAME,
  SITE_URL,
  WHATSAPP_DISPLAY_NUMBER,
  getWhatsappUrl,
} from '~/src/constants/site'

const whatsappUrl = getWhatsappUrl()

usePageSeo({
  title: 'Kontakt und Anfahrt Hypnose Frankfurt',
  description:
    'Kontakt, WhatsApp, Adresse und Anfahrt für Hypnose R in Frankfurt-Heddernheim: Alt-Heddernheim 43, 60439 Frankfurt am Main.',
  path: '/kontakt',
  image: studioImage,
  schema: {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE_NAME,
    url: SITE_URL,
    email: CONTACT_EMAIL,
    telephone: WHATSAPP_DISPLAY_NUMBER,
    areaServed: 'Frankfurt am Main',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Alt-Heddernheim 43',
      postalCode: '60439',
      addressLocality: 'Frankfurt am Main',
      addressCountry: 'DE',
    },
  },
})
</script>
