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
            Je tiefer ich in dieses Wissen eintauchte, desto mehr begeisterte mich die Arbeit
            mit Hypnose. Ich begann, das Wissen förmlich aufzusaugen und erkannte immer mehr,
            welches Potenzial diese Methode in sich trägt. Bis heute fasziniert mich die
            Verbindung aus fundiertem Wissen, innerer Arbeit und der Möglichkeit, Menschen
            auf ihrem persönlichen Weg zu begleiten.
          </p>
          <p class="ds-section__copy">
            Besonders erfüllend ist für mich der Moment, wenn ich sehe, dass meine Arbeit
            einem Menschen wirklich weiterhelfen kann. Zu erleben, wie sich neue Perspektiven
            eröffnen, innere Prozesse in Bewegung kommen und Veränderungen möglich werden,
            schenkt auch mir unglaublich viel Energie und Motivation.
          </p>
          <p class="ds-section__copy">
            Für mich ist Hypnose weit mehr als nur eine spannende Methode. Sie ist eine
            Möglichkeit, Menschen auf einer tieferen Ebene zu begegnen und sie dabei zu
            unterstützen, ihre eigenen Ressourcen und Lösungen wiederzuentdecken. Ich schätze
            besonders, dass Hypnose einen direkten und zugleich individuellen Zugang zu
            persönlichen Themen ermöglichen kann.
          </p>
          <p class="ds-section__copy">
            Genau diese Verbindung aus Faszination, Wirksamkeit und der Freude daran,
            Menschen ein Stück auf ihrem Weg begleiten zu dürfen, ist der Grund, warum
            Hypnose heute ein so wichtiger Teil meiner Arbeit ist.
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
