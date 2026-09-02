<template>
  <div class="ds-faq">
    <details v-for="item in items" :key="item.question" class="ds-faq__item">
      <summary class="ds-faq__question">
        <span>{{ item.question }}</span>
        <span class="material-icons ds-faq__icon" aria-hidden="true">add</span>
      </summary>
      <div class="ds-faq__answer">
        {{ item.answer }}
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: readonly {
    question: string
    answer: string
  }[]
}>()
</script>
