<template>
  <NuxtLink v-if="to && !disabled" v-bind="$attrs" :to="to" :class="buttonClass">
    <img v-if="iconSrc" class="ds-button__image-icon" :src="iconSrc" :alt="iconAlt" aria-hidden="true" />
    <span v-else-if="resolvedIcon" class="material-icons ds-button__icon" aria-hidden="true">
      {{ resolvedIcon }}
    </span>
    <span class="ds-button__content"><slot /></span>
  </NuxtLink>

  <a
    v-else-if="href && !disabled"
    v-bind="$attrs"
    :href="href"
    :target="target"
    :rel="rel"
    :class="buttonClass"
  >
    <img v-if="iconSrc" class="ds-button__image-icon" :src="iconSrc" :alt="iconAlt" aria-hidden="true" />
    <span v-else-if="resolvedIcon" class="material-icons ds-button__icon" aria-hidden="true">
      {{ resolvedIcon }}
    </span>
    <span class="ds-button__content"><slot /></span>
  </a>

  <button
    v-else
    v-bind="$attrs"
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClass"
    @click="$emit('click', $event)"
  >
    <img v-if="iconSrc" class="ds-button__image-icon" :src="iconSrc" :alt="iconAlt" aria-hidden="true" />
    <span v-else-if="resolvedIcon" class="material-icons ds-button__icon" aria-hidden="true">
      {{ resolvedIcon }}
    </span>
    <span class="ds-button__content"><slot /></span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DsButtonVariant } from '~/src/design-system/tokens'

const props = withDefaults(
  defineProps<{
    variant?: DsButtonVariant
    size?: 'medium' | 'large'
    type?: 'button' | 'submit' | 'reset'
    icon?: string
    iconSrc?: string
    iconAlt?: string
    disabled?: boolean
    loading?: boolean
    fullWidth?: boolean
    to?: string
    href?: string
    target?: string
    rel?: string
  }>(),
  {
    variant: 'primary',
    size: 'medium',
    type: 'button',
    icon: undefined,
    iconSrc: undefined,
    iconAlt: '',
    disabled: false,
    loading: false,
    fullWidth: false,
    to: undefined,
    href: undefined,
    target: undefined,
    rel: undefined,
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClass = computed(() => [
  'ds-button',
  `ds-button--${props.variant}`,
  `ds-button--${props.size}`,
  {
    'ds-button--full': props.fullWidth,
    'ds-button--disabled': props.disabled,
    'ds-button--loading': props.loading,
  },
])

const resolvedIcon = computed(() => (props.loading ? 'sync' : props.icon))
</script>
