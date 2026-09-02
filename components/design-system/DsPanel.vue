<template>
  <component
    :is="as"
    v-bind="$attrs"
    :class="['ds-panel', { 'ds-panel--padded': padded }]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    as?: 'article' | 'aside' | 'div' | 'form' | 'section'
    padded?: boolean
  }>(),
  {
    as: 'section',
    padded: true,
  },
)
</script>
