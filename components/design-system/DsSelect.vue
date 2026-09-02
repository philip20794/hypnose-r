<template>
  <QSelect
    v-model="model"
    v-bind="$attrs"
    class="ds-field"
    :label="label"
    :options="options"
    :disable="disabled"
    outlined
    emit-value
    map-options
    color="primary"
    popup-content-class="ds-select-menu"
  />
</template>

<script setup lang="ts">
import { QSelect } from 'quasar'

const model = defineModel<string>({ default: '' })

withDefaults(
  defineProps<{
    label: string
    options: readonly {
      label: string
      value: string
    }[]
    disabled?: boolean
  }>(),
  {
    disabled: false,
  },
)
</script>
