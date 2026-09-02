<template>
  <ol class="ds-steps">
    <li v-for="(step, index) in steps" :key="step" class="ds-step">
      <span class="ds-step__number">{{ index + 1 }}</span>
      <span>{{ step }}</span>
    </li>
  </ol>
</template>

<script setup lang="ts">
defineProps<{
  steps: readonly string[]
}>()
</script>
