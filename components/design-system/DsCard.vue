<template>
  <article :class="['ds-card', { 'ds-card--accent': accent }]">
    <div class="ds-card__body">
      <span v-if="icon" class="material-icons ds-card__icon" aria-hidden="true">{{ icon }}</span>
      <p v-if="eyebrow" class="ds-card__eyebrow">{{ eyebrow }}</p>
      <h3 v-if="title">{{ title }}</h3>
      <p v-if="description" class="ds-card__copy">{{ description }}</p>
      <slot />
    </div>
    <div v-if="$slots.actions" class="ds-card__actions">
      <slot name="actions" />
    </div>
  </article>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
    eyebrow?: string
    icon?: string
    accent?: boolean
  }>(),
  {
    title: undefined,
    description: undefined,
    eyebrow: undefined,
    icon: undefined,
    accent: false,
  },
)
</script>
