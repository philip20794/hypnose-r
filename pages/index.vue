<template>
  <main class="page-flow">
    <DsPageHero
      eyebrow=""
      title="Hypnose in Frankfurt"
      description="Hypnose R bietet ruhige Hypnosesitzungen in Frankfurt-Heddernheim für Entspannung, mentale Regeneration und persönliche Zielarbeit. Für erste Fragen kannst du ein kostenloses Erstgespräch reservieren."
      :image="HERO_IMAGE"
      image-alt="Ruhiger Sitzungsraum für Hypnose in Frankfurt-Heddernheim"
    >
      <template #actions>
        <DsButton to="/termin-buchen?type=intro" icon="event_available" size="large">
          Kostenloses Erstgespräch
        </DsButton>
        <DsButton to="/termin-buchen?type=hypnosis" variant="secondary" icon="calendar_month" size="large">
          Hypnose buchen
        </DsButton>
      </template>
    </DsPageHero>

    <DsSection tone="band">
      <DsMediaBlock
        :image="PROFILE_IMAGE"
        image-alt="Porträt von Runa Weiland"
        eyebrow="Über mich"
        :title="OWNER_NAME"
        description="Ich bin 26 Jahre alt, ausgebildete Hypnotiseurin und begleite dich in meinem kleinen Studio in Frankfurt-Heddernheim mit einem ruhigen, klar geführten Ablauf."
      >
        <DsIconList
          :items="[
            'Jung, frisch und voller Energie',
            'Kleines Studio für Hypnose in Frankfurt-Heddernheim',
          ]"
        />
        <div class="ds-actions">
          <DsButton to="/ueber-mich" variant="secondary" icon="arrow_forward">
            Mehr über mich
          </DsButton>
        </div>
      </DsMediaBlock>
    </DsSection>

    <DsSection
      eyebrow="Meine Leistungen"
      title="Hypnose und Erstgespräch"
      description="Du kannst zuerst telefonisch Fragen klären oder direkt eine Hypnose in Frankfurt-Heddernheim buchen."
    >
      <OfferCards />
    </DsSection>

    <DsSection tone="compact">
      <div class="hypnosis-answer-block hypnosis-answer-block--action">
        <p class="ds-eyebrow">Hypnose verstehen</p>
        <h2>Was ist Hypnose?</h2>
        <p>Hier erfährst du, was Hypnose bedeutet, wie eine Sitzung abläuft und welche Grenzen für mein Angebot in Frankfurt-Heddernheim gelten.</p>
        <div class="ds-actions">
          <DsButton to="/hypnose" variant="secondary" icon="arrow_forward">
            Mehr über Hypnose erfahren
          </DsButton>
        </div>
      </div>
    </DsSection>

    <DsCtaBand
      title="Bereit für den nächsten Schritt?"
      description="Wähle einen freien Termin für ein kostenloses Erstgespräch oder eine Hypnose vor Ort in Frankfurt-Heddernheim."
    >
      <DsButton to="/termin-buchen?type=intro" icon="event_available">
        Kostenloses Erstgespräch
      </DsButton>
      <DsButton to="/termin-buchen?type=hypnosis" variant="secondary" icon="calendar_month">
        Hypnose buchen
      </DsButton>
    </DsCtaBand>
  </main>
</template>

<script setup lang="ts">
import {
  HERO_IMAGE,
  OWNER_NAME,
  PROFILE_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from '~/src/constants/site'

usePageSeo({
  title: 'Hypnose Frankfurt-Heddernheim',
  description: SITE_DESCRIPTION,
  path: '/',
  image: HERO_IMAGE,
  schema: [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      image: `${SITE_URL}${HERO_IMAGE}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Alt-Heddernheim 43',
        postalCode: '60439',
        addressLocality: 'Frankfurt am Main',
        addressCountry: 'DE',
      },
      areaServed: 'Frankfurt am Main und Frankfurt-Heddernheim',
      priceRange: '0 EUR-120 EUR',
    },
  ],
})
</script>
