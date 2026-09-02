<template>
  <QCheckbox v-model="model" v-bind="$attrs" class="ds-checkbox" :disable="disabled" color="primary">
    <slot>{{ label }}</slot>
  </QCheckbox>
</template>

<script setup lang="ts">
import { QCheckbox } from 'quasar'

const model = defineModel<boolean>({ default: false })

withDefaults(
  defineProps<{
    label?: string
    disabled?: boolean
  }>(),
  {
    label: undefined,
    disabled: false,
  },
)
</script>
