<template>
  <ul class="ds-icon-list">
    <li v-for="item in items" :key="item">
      <span class="material-icons" aria-hidden="true">{{ icon }}</span>
      <span>{{ item }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    items: readonly string[]
    icon?: string
  }>(),
  {
    icon: 'check_circle',
  },
)
</script>
