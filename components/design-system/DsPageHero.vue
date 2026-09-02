<template>
  <section class="ds-hero" :aria-labelledby="titleId">
    <img class="ds-hero__image" :src="image" :alt="imageAlt" loading="eager" />
    <div class="ds-hero__shade" aria-hidden="true" />
    <div class="ds-hero__inner">
      <p v-if="eyebrow" class="ds-eyebrow">{{ eyebrow }}</p>
      <h1 :id="titleId">{{ title }}</h1>
      <p class="ds-hero__copy">{{ description }}</p>
      <div v-if="$slots.actions" class="ds-actions">
        <slot name="actions" />
      </div>
      <div v-if="$slots.meta" class="ds-hero__meta">
        <slot name="meta" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description: string
    image: string
    imageAlt: string
    eyebrow?: string
    titleId?: string
  }>(),
  {
    eyebrow: undefined,
    titleId: 'page-title',
  },
)
</script>
