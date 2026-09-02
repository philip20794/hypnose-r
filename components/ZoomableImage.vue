<template>
  <button
    v-bind="$attrs"
    type="button"
    class="zoomable-image"
    :aria-label="zoomLabel"
    @click="openImage"
  >
    <img :class="imageClass" :src="src" :alt="alt" :loading="loading" />
    <span class="zoomable-image__control" aria-hidden="true">
      <span class="material-icons">zoom_in</span>
    </span>
  </button>

  <Teleport to="body">
    <div
      v-if="imageOpen"
      ref="dialogElement"
      class="image-lightbox"
      role="dialog"
      aria-modal="true"
      :aria-label="alt || 'Bildansicht'"
      tabindex="-1"
      @click.self="closeImage"
      @keydown.esc="closeImage"
    >
      <button
        class="image-lightbox__close"
        type="button"
        aria-label="Bild schliessen"
        @click="closeImage"
      >
        <span class="material-icons" aria-hidden="true">close</span>
      </button>
      <img class="image-lightbox__image" :src="src" :alt="alt" />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    src: string
    alt: string
    imageClass?: string
    loading?: 'lazy' | 'eager'
  }>(),
  {
    imageClass: undefined,
    loading: 'lazy',
  },
)

const imageOpen = ref(false)
const dialogElement = ref<HTMLElement | null>(null)
let previousBodyOverflow = ''

const zoomLabel = computed(() => (
  props.alt ? `Bild vergroessern: ${props.alt}` : 'Bild vergroessern'
))

function openImage() {
  imageOpen.value = true
}

function closeImage() {
  imageOpen.value = false
}

watch(imageOpen, async (isOpen) => {
  if (!import.meta.client) {
    return
  }

  if (isOpen) {
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    await nextTick()
    dialogElement.value?.focus()
    return
  }

  document.body.style.overflow = previousBodyOverflow
})

onBeforeUnmount(() => {
  if (import.meta.client && imageOpen.value) {
    document.body.style.overflow = previousBodyOverflow
  }
})
</script>
