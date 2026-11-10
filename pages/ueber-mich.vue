<template>
  <main class="page-flow">
    <DsPageHeader
      eyebrow="Über mich"
      :title="OWNER_NAME"
      description="Ich bin Runa Weiland, ausgebildete Hypnotiseurin, und begleite dich in meinem kleinen Studio in Frankfurt-Heddernheim. Aktuell biete ich ausschließlich nicht-therapeutische Hypnose für Entspannung und persönliche Zielarbeit an."
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
            '26 Jahre alt',
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
            Meine Faszination für Hypnose begleitet mich bereits seit meiner Kindheit. Schon
            damals durfte ich erste Erfahrungen mit Hypnose machen und war beeindruckt von
            den Möglichkeiten, die in unserem Inneren und unserem Unterbewusstsein verborgen
            liegen.
          </p>
          <p class="ds-section__copy">
            Während meiner Ausbildung zur Heilpraktikerin für Psychotherapie begegnete mir
            schließlich die Möglichkeit, mich intensiv im Bereich Hypnose weiterzubilden und
            einen Master in Hypnose zu absolvieren. Anfangs war es ein spontaner Gedanke:
            Warum eigentlich nicht? Doch bereits nach kurzer Zeit wurde daraus eine echte
            Leidenschaft.
          </p>
          <p class="ds-section__copy">
            Je mehr ich über Hypnose lernte, desto mehr interessierte mich die Möglichkeit,
            Menschen auf ihrem persönlichen Weg zu begleiten. Bis heute fasziniert mich
            die Verbindung aus Wissen, innerer Aufmerksamkeit und persönlichen Erfahrungen.
          </p>
          <p class="ds-section__copy">
            In meinen Sitzungen ist mir wichtig, Zeit für Fragen zu lassen und einen ruhigen,
            überschaubaren Rahmen zu schaffen. Du kannst Hypnose aus Neugier kennenlernen,
            bewusst entspannen oder dich mit einem persönlichen Ziel beschäftigen.
          </p>
          <p class="ds-section__copy">
            Ich begleite dich dabei persönlich und in deinem Tempo. Mein aktuelles Angebot
            umfasst keine Behandlung psychischer oder körperlicher Erkrankungen.
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
          class="studio-image-frame"
          image-class="studio-image"
          :src="studioImage"
          alt="Hypnose-Studio von Runa Weiland in Frankfurt-Heddernheim"
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
import studioImage from '~/assets/hypnose_studio-optimized.jpg'
import certificateImage from '~/assets/zertifikat-optimized.jpg'
import { OWNER_NAME, PROFILE_IMAGE, SITE_NAME, SITE_URL } from '~/src/constants/site'

usePageSeo({
  title: `${OWNER_NAME} – Über mich und mein Studio`,
  description:
    'Lerne Runa Weiland, ihre Hypnose-Ausbildung und ihr Studio in Frankfurt-Heddernheim kennen. Aktuell ausschließlich nicht-therapeutische Hypnose.',
  path: '/ueber-mich',
  image: PROFILE_IMAGE,
  schema: {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: OWNER_NAME,
    jobTitle: 'Hypnotiseurin',
    image: toAbsoluteImageUrl(PROFILE_IMAGE),
    worksFor: {
      '@type': 'ProfessionalService',
      name: SITE_NAME,
      url: SITE_URL,
    },
  },
})
</script>
