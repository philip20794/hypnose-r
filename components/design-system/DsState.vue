<template>
  <div :class="['ds-state', `ds-state--${tone}`]">
    <span v-if="resolvedIcon" class="material-icons ds-state__icon" aria-hidden="true">
      {{ resolvedIcon }}
    </span>
    <div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    tone?: 'error' | 'info' | 'success' | 'warning'
    icon?: string
  }>(),
  {
    tone: 'info',
    icon: undefined,
  },
)

const fallbackIcons = {
  error: 'error',
  info: 'info',
  success: 'check_circle',
  warning: 'warning',
}

const resolvedIcon = computed(() => props.icon ?? fallbackIcons[props.tone])
</script>
