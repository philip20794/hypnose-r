<template>
  <QDialog v-model="model">
    <QCard class="ds-dialog">
      <QCardSection>
        <h2>{{ title }}</h2>
        <slot />
      </QCardSection>
      <QCardActions class="ds-dialog__actions" align="right">
        <slot name="actions" />
      </QCardActions>
    </QCard>
  </QDialog>
</template>

<script setup lang="ts">
import { QCard, QCardActions, QCardSection, QDialog } from 'quasar'

defineProps<{
  title: string
}>()

const model = defineModel<boolean>({ required: true })
</script>
