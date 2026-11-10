<template>
  <main class="page-flow">
    <DsPageHero
      eyebrow=""
      title="Hypnose in Frankfurt"
      description="Erlebe ruhige Hypnosesitzungen in Frankfurt-Heddernheim – für Entspannung, mentale Regeneration und persönliche Zielarbeit. Oder einfach, um Hypnose kennenzulernen."
      :image="studioImage"
      image-alt="Hypnose-Studio in Frankfurt-Heddernheim"
      :image-width="1448"
      :image-height="1086"
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
        description="Ich bin Runa Weiland, ausgebildete Hypnotiseurin. In meinem kleinen Studio in Frankfurt-Heddernheim nehme ich mir Zeit für deine Fragen und begleite dich ruhig und persönlich durch die Sitzung."
      >
        <DsIconList
          :items="[
            'Persönliche Begleitung mit einem klaren, ruhigen Ablauf',
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

    <DsSection tone="compact" title="Wofür interessierst du dich?">
      <DsCardGrid columns="three">
        <NuxtLink to="/hypnose#entspannung" class="interest-link">
          <DsCard
            title="Entspannung erleben"
            icon="spa"
            description="Bewusst zur Ruhe kommen und sich Zeit für eine geführte Entspannung nehmen."
          />
        </NuxtLink>
        <NuxtLink to="/hypnose" class="interest-link">
          <DsCard
            title="Hypnose kennenlernen"
            icon="explore"
            description="Erfahren, wie sich Hypnose anfühlen kann und was während einer Sitzung passiert."
          />
        </NuxtLink>
        <NuxtLink to="/hypnose#zielarbeit" class="interest-link">
          <DsCard
            title="Persönliche Zielarbeit"
            icon="track_changes"
            description="Ein individuelles Anliegen in einer ruhigen, geführten Sitzung aufgreifen."
          />
        </NuxtLink>
      </DsCardGrid>
    </DsSection>

    <DsSection
      eyebrow="Meine Leistungen"
      title="Hypnose und Erstgespräch"
      description="Du kannst zuerst telefonisch Fragen klären oder direkt eine Hypnose in Frankfurt-Heddernheim buchen. Mein Angebot ist ausschließlich nicht-therapeutisch."
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
import studioImage from '~/assets/hypnose_studio-optimized.jpg'
import {
  OWNER_NAME,
  PROFILE_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from '~/src/constants/site'

usePageSeo({
  title: 'Hypnose Frankfurt-Heddernheim',
  description: 'Hypnose in Frankfurt-Heddernheim erleben: Entspannung, Hypnose kennenlernen und persönliche Zielarbeit. 60 Minuten vor Ort. Kostenloses Erstgespräch.',
  path: '/',
  image: studioImage,
  schema: [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      image: toAbsoluteImageUrl(studioImage),
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

<style scoped>
.interest-link {
  display: block;
  height: 100%;
  border-radius: var(--ds-radius-md);
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}

.interest-link:hover :deep(.ds-card),
.interest-link:focus-visible :deep(.ds-card) {
  border-color: var(--ds-color-primary);
}

.interest-link:focus-visible {
  outline: 2px solid var(--ds-color-primary);
  outline-offset: 4px;
}
</style>
