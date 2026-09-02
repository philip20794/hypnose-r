<template>
  <main class="legal-page">
    <DsPanel as="article" class="legal-document">
      <p class="ds-eyebrow">{{ eyebrow }}</p>
      <h1>{{ title }}</h1>
      <p v-if="description">{{ description }}</p>
      <slot />
    </DsPanel>
  </main>
</template>

<script setup lang="ts">
import DsPanel from '~/components/design-system/DsPanel.vue'

withDefaults(
  defineProps<{
    title: string
    description?: string
    eyebrow?: string
  }>(),
  {
    description: undefined,
    eyebrow: 'Rechtliches',
  },
)
</script>
