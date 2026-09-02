<template>
  <div class="ds-process-status" role="status" aria-live="polite" aria-atomic="true">
    <span class="ds-process-status__spinner" aria-hidden="true" />
    <div class="ds-process-status__body">
      <strong>{{ title }}</strong>
      <p>{{ currentStep }}</p>
      <span>{{ notice }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    title: string
    steps: readonly string[]
    intervalMs?: number
    notice?: string
  }>(),
  {
    intervalMs: 2400,
    notice: 'Bitte lasse diese Seite geöffnet, bis der Vorgang abgeschlossen ist.',
  },
)

const activeStepIndex = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

const currentStep = computed(() => props.steps[activeStepIndex.value] || props.steps[0] || '')

function stopTimer() {
  if (!timer) return
  clearInterval(timer)
  timer = undefined
}

function startTimer() {
  stopTimer()
  if (props.steps.length <= 1) return

  timer = setInterval(() => {
    activeStepIndex.value = (activeStepIndex.value + 1) % props.steps.length
  }, props.intervalMs)
}

watch(
  () => props.steps,
  () => {
    activeStepIndex.value = 0
    startTimer()
  },
)

onMounted(startTimer)
onUnmounted(stopTimer)
</script>
