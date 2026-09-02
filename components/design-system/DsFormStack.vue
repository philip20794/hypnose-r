<template>
  <form class="ds-form-stack" @submit.prevent="$emit('submit')">
    <slot />
  </form>
</template>

<script setup lang="ts">
defineEmits<{
  submit: []
}>()
</script>
