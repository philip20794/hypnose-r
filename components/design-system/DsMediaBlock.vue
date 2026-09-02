<template>
  <div :class="['ds-media-block', { 'ds-media-block--reverse': reverse }]">
    <ZoomableImage
      class="ds-media-block__image-frame"
      :image-class="['ds-media-block__image', `ds-media-block__image--${imageFit}`].join(' ')"
      :src="image"
      :alt="imageAlt"
      loading="lazy"
    />
    <div class="ds-media-block__content">
      <p v-if="eyebrow" class="ds-eyebrow">{{ eyebrow }}</p>
      <h2 v-if="title">{{ title }}</h2>
      <p v-if="description" class="ds-section__copy">{{ description }}</p>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    image: string
    imageAlt: string
    title?: string
    description?: string
    eyebrow?: string
    reverse?: boolean
    imageFit?: 'cover' | 'contain'
  }>(),
  {
    title: undefined,
    description: undefined,
    eyebrow: undefined,
    reverse: false,
    imageFit: 'cover',
  },
)
</script>
