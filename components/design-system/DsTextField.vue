<template>
  <QInput
    v-model="model"
    v-bind="$attrs"
    class="ds-field"
    :label="label"
    :type="type"
    :autocomplete="autocomplete"
    :inputmode="inputmode"
    :disable="disabled"
    :rules="rules"
    :lazy-rules="Boolean(rules)"
    outlined
    color="primary"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { QInput } from 'quasar'

const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    label: string
    type?: 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url'
    autocomplete?: string
    inputmode?: 'decimal' | 'email' | 'none' | 'numeric' | 'search' | 'tel' | 'text' | 'url'
    required?: boolean
    disabled?: boolean
  }>(),
  {
    type: 'text',
    autocomplete: undefined,
    inputmode: undefined,
    required: false,
    disabled: false,
  },
)

const rules = computed(() =>
  props.required
    ? [(value: string) => Boolean(String(value || '').trim()) || `${props.label} ist erforderlich.`]
    : undefined,
)
</script>
