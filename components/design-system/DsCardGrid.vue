<template>
  <div :class="['ds-card-grid', `ds-card-grid--${columns}`]">
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    columns?: 'two' | 'three'
  }>(),
  {
    columns: 'three',
  },
)
</script>
