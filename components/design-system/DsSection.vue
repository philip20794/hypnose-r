<template>
  <section :class="['ds-section', `ds-section--${tone}`]" :aria-labelledby="title ? titleId : undefined">
    <div class="ds-section__inner">
      <div v-if="eyebrow || title || description || $slots.actions" class="ds-section__header">
        <div>
          <p v-if="eyebrow" class="ds-eyebrow">{{ eyebrow }}</p>
          <h2 v-if="title" :id="titleId">{{ title }}</h2>
          <p v-if="description" class="ds-section__copy">{{ description }}</p>
        </div>
        <div v-if="$slots.actions" class="ds-actions ds-actions--right">
          <slot name="actions" />
        </div>
      </div>
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    title?: string
    description?: string
    titleId?: string
    tone?: 'default' | 'band' | 'compact'
  }>(),
  {
    eyebrow: undefined,
    title: undefined,
    description: undefined,
    titleId: undefined,
    tone: 'default',
  },
)
</script>
