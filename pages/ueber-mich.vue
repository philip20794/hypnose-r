<template>
  <main class="page-flow">
    <DsPageHeader
      eyebrow="Über mich"
      :title="OWNER_NAME"
      description="Ich bin Runa Weiland, ausgebildete Hypnotiseurin, und biete Hypnose in meinem kleinen Studio in Frankfurt-Heddernheim an."
    >
      <template #actions>
        <DsButton to="/termin-buchen" icon="chat">Erstgespräch buchen</DsButton>
      </template>
    </DsPageHeader>

    <DsSection tone="compact">
      <DsMediaBlock
        :image="PROFILE_IMAGE"
        image-alt="Porträt von Runa Weiland"
        title="Hypnose fasziniert mich schon lange"
        description="Meine Begeisterung für Hypnose entstand während meiner Ausbildung zur Heilpraktikerin für Psychotherapie. Durch eine Hypnose-Master-Ausbildung mit Schwerpunkt Traumatherapie habe ich mein Wissen vertieft. Heute biete ich Hypnose in Frankfurt-Heddernheim mit Ruhe, Klarheit und viel persönlichem Engagement an."
      >
        <DsIconList
          :items="[
            '26 Jahre alt, jung, frisch und voller Energie',
            'In Ausbildung zur Heilpraktikerin für Psychotherapie',
            'Hypnosetherapeutin Master-Class-Fachausbildung: Schwerpunkt Traumatherapie',
            'Eigenes kleines Hypnose-Studio in Frankfurt-Heddernheim',
          ]"
        />
      </DsMediaBlock>
    </DsSection>

    <DsSection tone="compact">
      <div class="about-certificate-layout">
        <div class="about-hypnosis-reason">
          <h2>Warum ich Hypnose anbiete</h2>
          <p class="ds-section__copy">
            Hypnose fasziniert mich, weil sie Ruhe, Fokus und innere Veränderung möglich
            machen kann, wenn man sich wirklich darauf einlässt. Ich begleite Menschen gerne
            in einem ruhigen, klar geführten Rahmen und bringe dabei meine eigene frische,
            offene Art mit. Mein Ziel ist, dass du dich im Termin gut orientiert, ernst
            genommen und nicht gedrängt fühlst.
          </p>
        </div>
        <ZoomableImage
          class="certificate-image-frame"
          image-class="certificate-image"
          :src="certificateImage"
          alt="Zertifikat zur Hypnosetherapeut Master-Class von Runa Weiland"
          loading="lazy"
        />
      </div>
    </DsSection>

    <DsSection
      title="Mein Studio und der aktuelle Rahmen"
      description="Ich habe mir mein Hypnose-Studio in Frankfurt-Heddernheim so eingerichtet, wie ich es selbst mag: ruhig, warm und als kleine Entspannungsoase."
    >
      <div class="studio-current-layout">
        <ZoomableImage
          class="studio-placeholder-image-frame"
          image-class="studio-placeholder-image"
          :src="STUDIO_DETAIL_IMAGE"
          alt="Platzhalterbild für das Hypnose-Studio"
          loading="lazy"
        />
        <DsCard title="Wichtig zu wissen" icon="health_and_safety">
          <DsIconList
            :items="[
              'Aktuell biete ich Hypnose nicht therapeutisch oder heilkundlich an',
              'Mein Angebot richtet sich an Entspannung, mentale Regeneration und persönliche Zielarbeit',
              'Nach erteilter Erlaubnis als Heilpraktikerin für Psychotherapie möchte ich mein Angebot therapeutisch erweitern',
            ]"
          />
        </DsCard>
      </div>
    </DsSection>
  </main>
</template>

<script setup lang="ts">
import certificateImage from '~/assets/zertifikat.jpg'
import { OWNER_NAME, PROFILE_IMAGE, SITE_NAME, SITE_URL, STUDIO_DETAIL_IMAGE } from '~/src/constants/site'

usePageSeo({
  title: `${OWNER_NAME} - Hypnose in Frankfurt`,
  description:
    'Mehr über Runa Weiland, ihre Hypnose-Ausbildung, ihr kleines Studio und den aktuellen Rahmen für Hypnose in Frankfurt-Heddernheim.',
  path: '/ueber-mich',
  image: PROFILE_IMAGE,
  schema: {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: OWNER_NAME,
    jobTitle: 'Hypnotiseurin',
    image: `${SITE_URL}${PROFILE_IMAGE}`,
    worksFor: {
      '@type': 'ProfessionalService',
      name: SITE_NAME,
      url: SITE_URL,
    },
  },
})
</script>
