<template>
  <a :href="href" :target="target" :rel="rel" :class="['ds-contact-link', `ds-contact-link--${tone}`]">
    <span class="ds-contact-link__icon" aria-hidden="true">
      <img
        v-if="tone === 'whatsapp'"
        class="ds-contact-link__brand-icon"
        src="/images/whatsapp.svg"
        alt=""
      />
      <span v-else class="material-icons">{{ icon }}</span>
    </span>
    <span class="ds-contact-link__content">
      <span class="ds-contact-link__label">{{ label }}</span>
      <strong>{{ value }}</strong>
    </span>
  </a>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    href: string
    label: string
    value: string
    icon?: string
    tone?: 'default' | 'whatsapp'
    target?: string
    rel?: string
  }>(),
  {
    icon: 'arrow_forward',
    tone: 'default',
    target: undefined,
    rel: undefined,
  },
)
</script>
