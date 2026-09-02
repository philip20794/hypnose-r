<template>
  <QChip
    v-bind="$attrs"
    :class="['ds-badge', `ds-badge--${tone}`]"
    square
  >
    <slot />
  </QChip>
</template>

<script setup lang="ts">
import { QChip } from 'quasar'

withDefaults(
  defineProps<{
    tone?: 'cancelled' | 'confirmed' | 'neutral' | 'pending'
  }>(),
  {
    tone: 'neutral',
  },
)
</script>
