<template>
  <header class="ds-page-header" :aria-labelledby="titleId">
    <p v-if="eyebrow" class="ds-eyebrow">{{ eyebrow }}</p>
    <h1 :id="titleId">{{ title }}</h1>
    <p v-if="description" class="ds-page-header__copy">{{ description }}</p>
    <div v-if="$slots.actions" class="ds-actions">
      <slot name="actions" />
    </div>
  </header>
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
    titleId: 'page-title',
  },
)
</script>
