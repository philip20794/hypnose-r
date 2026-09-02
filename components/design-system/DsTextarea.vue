<template>
  <QInput
    v-model="model"
    v-bind="$attrs"
    class="ds-field"
    :label="label"
    :rows="rows"
    :disable="disabled"
    type="textarea"
    outlined
    color="primary"
  />
</template>

<script setup lang="ts">
import { QInput } from 'quasar'

defineProps<{
  label: string
  rows?: number
  disabled?: boolean
}>()

const model = defineModel<string>({ default: '' })
</script>
