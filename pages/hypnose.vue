<template>
  <main class="page-flow">
    <DsPageHeader
      eyebrow="Hypnose verstehen"
      title="Was ist Hypnose?"
    >
    </DsPageHeader>

    <DsSection tone="compact">
      <div class="hypnosis-answer-block">
        <p>
          Hypnose ist ein natürlicher Zustand tiefer Entspannung und gleichzeitig
          fokussierter Aufmerksamkeit. In diesem Zustand tritt der bewusste, oft sehr
          aktive Verstand etwas in den Hintergrund, während der Zugang zu inneren
          Ressourcen, Gefühlen und unbewussten Denk- und Verhaltensmustern erleichtert
          werden kann.
        </p>
        <p>
          Dabei behalten Sie jederzeit die Kontrolle und nehmen wahr, was um Sie herum
          geschieht. Hypnose bedeutet weder Bewusstlosigkeit noch Willenlosigkeit –
          vielmehr ist sie ein Zustand konzentrierter Aufmerksamkeit, den viele Menschen
          als angenehm, ruhig und entspannend erleben.
        </p>
        <p>
          Durch gezielte Suggestionen und innere Vorstellungen können neue Perspektiven
          entwickelt und positive Veränderungen unterstützt werden. Hypnose kann dabei
          helfen, sich selbst besser zu verstehen, innere Blockaden zu lösen und
          vorhandene Ressourcen zu aktivieren.
        </p>
      </div>
    </DsSection>

    <DsSection tone="compact">
      <DsCardGrid columns="two">
        <DsCard title="Hypnose ist" icon="self_improvement">
          <DsIconList
            :items="[
              'Zustand fokussierter Aufmerksamkeit',
              'Körperliche und mentale Entspannung',
              'Aktive Mitwirkung der Person',
              'Individuelle Wahrnehmung',
              'Ruhiger, geführter Ablauf',
            ]"
          />
        </DsCard>
        <DsCard title="Hypnose ist nicht" icon="block">
          <DsIconList
            icon="block"
            :items="[
              'Kein Kontrollverlust',
              'Kein Bewusstlossein',
              'Kein willenloser Zustand',
              'Kein Erzwingen von Veränderung',
              'Kein Ersatz für medizinische oder psychotherapeutische Behandlung',
            ]"
          />
        </DsCard>
      </DsCardGrid>
    </DsSection>

    <DsSection tone="compact">
      <div class="hypnosis-answer-block">
        <h2>Wie sich Hypnose anfühlen kann</h2>
        <p>
          Jeder Mensch erlebt Hypnose auf seine eigene Weise. Manche Menschen spüren
          eine angenehme Schwere oder Leichtigkeit im Körper, andere nehmen eine tiefe
          innere Ruhe wahr. Gedanken können langsamer werden, während die Aufmerksamkeit
          nach innen gerichtet ist. Für viele fühlt es sich ähnlich an wie der Zustand
          kurz vor dem Einschlafen oder dem Aufwachen – man ist entspannt und
          gleichzeitig bewusst bei sich.
        </p>
        <p>
          Manche Menschen erleben innere Bilder, Farben oder Erinnerungen besonders
          intensiv, während andere vor allem ein Gefühl von Ruhe und Geborgenheit
          wahrnehmen. Auch ein Gefühl von Wärme, Kribbeln oder einer angenehmen
          körperlichen Entspannung kann auftreten. Es gibt dabei jedoch kein „richtig“
          oder „falsch“. Jeder Mensch nimmt Hypnose auf seine ganz persönliche Art wahr.
        </p>
      </div>
    </DsSection>

    <DsSection tone="compact">
      <div class="hypnosis-answer-block">
        <h2>Kann ich Hypnose einfach einmal ausprobieren?</h2>
        <p>
          Ja. Du brauchst kein konkretes Veränderungsziel, um Hypnose kennenzulernen.
          Wenn du neugierig bist, wie sich eine geführte Hypnose anfühlt, kannst du eine
          nicht-therapeutische Sitzung in meinem Studio in Frankfurt-Heddernheim buchen.
          Vorab besprechen wir den Ablauf und deine Erwartungen. Deine Teilnahme ist
          freiwillig und setzt deine aktive Mitwirkung voraus. Du entscheidest selbst,
          wie weit du dich darauf einlassen möchtest. Bei Unsicherheit kannst du deine
          Fragen zunächst in einem kostenlosen telefonischen Erstgespräch klären.
        </p>
        <div class="ds-actions">
          <DsButton to="/termin-buchen?type=hypnosis" icon="calendar_month">
            Hypnose kennenlernen und buchen
          </DsButton>
          <DsButton to="/termin-buchen?type=intro" variant="secondary" icon="phone_in_talk">
            Kostenloses Erstgespräch
          </DsButton>
        </div>
      </div>
    </DsSection>

    <DsSection
      title="Wofür Hypnose genutzt werden kann"
      description="Mein Angebot richtet sich an Menschen, die sich bewusst Zeit für innere Ruhe, Fokus und persönliche Entwicklung nehmen möchten."
    >
      <DsCardGrid columns="two">
        <DsCard
          id="entspannung"
          class="hypnosis-topic"
          title="Entspannung und Regeneration"
          icon="spa"
          description="Hypnose kann einen Rahmen schaffen, in dem Körper und Gedanken zur Ruhe kommen und neue Kraft entstehen kann."
        />
        <DsCard
          id="zielarbeit"
          class="hypnosis-topic"
          title="Persönliche Zielarbeit"
          icon="track_changes"
          description="In der Sitzung kann ein persönliches Anliegen fokussiert werden, ohne Druck und ohne etwas erzwingen zu müssen."
          accent
        />
      </DsCardGrid>
    </DsSection>

    <DsSection
      title="So läuft eine Sitzung ab"
      description="Eine Hypnose in Frankfurt-Heddernheim beginnt mit einem kurzen Vorgespräch. Der Ablauf wird vorab erklärt und Fragen sind jederzeit möglich."
    >
      <DsSteps
        :steps="[
          'Kurzes Vorgespräch und Klärung des Anliegens',
          'Vorbereitung auf die Hypnose und offene Fragen',
          'Geführte Hypnosephase in ruhiger Atmosphäre',
          'Rücknahme und kurze Nachbesprechung',
        ]"
      />
    </DsSection>

    <DsSection tone="band" title="Häufige Fragen">
      <DsFaq :items="HYPNOSE_FAQS" />
    </DsSection>

    <DsCtaBand
      title="Noch unsicher?"
      description="Im kostenlosen Erstgespräch kannst du Fragen zur Hypnose klären, bevor du einen Termin in Frankfurt-Heddernheim buchst."
    >
      <DsButton to="/termin-buchen" icon="event_available">Erstgespräch buchen</DsButton>
    </DsCtaBand>
  </main>
</template>

<script setup lang="ts">
import { HYPNOSE_FAQS } from '~/src/constants/site'

usePageSeo({
  title: 'Was ist Hypnose? Ablauf und Erlebnis',
  description:
    'Wie fühlt sich Hypnose an? Erfahre, wie eine Sitzung abläuft und wie du Hypnose in Frankfurt-Heddernheim selbst kennenlernen kannst.',
  path: '/hypnose',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HYPNOSE_FAQS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  },
})
</script>

<style scoped>
.hypnosis-topic {
  /* Leave room for the sticky header, even when the mobile header reappears. */
  scroll-margin-top: 112px;
}

@media (max-width: 840px) {
  .hypnosis-topic {
    scroll-margin-top: 96px;
  }
}
</style>
