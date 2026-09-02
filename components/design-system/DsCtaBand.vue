<template>
  <section class="ds-cta-band" :aria-labelledby="titleId">
    <div class="ds-cta-band__content">
      <p v-if="eyebrow" class="ds-eyebrow">{{ eyebrow }}</p>
      <h2 :id="titleId">{{ title }}</h2>
      <p v-if="description">{{ description }}</p>
    </div>
    <div class="ds-actions ds-actions--right">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description?: string
    eyebrow?: string
    titleId?: string
  }>(),
  {
    description: undefined,
    eyebrow: undefined,
    titleId: 'cta-title',
  },
)
</script>
