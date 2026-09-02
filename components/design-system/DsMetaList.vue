<template>
  <dl class="ds-meta-list">
    <div v-for="item in items" :key="item.label">
      <dt>{{ item.label }}</dt>
      <dd>{{ item.value }}</dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
defineProps<{
  items: readonly {
    label: string
    value: string
  }[]
}>()
</script>
