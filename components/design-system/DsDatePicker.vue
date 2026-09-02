<template>
  <QDate
    v-model="model"
    class="ds-date-picker"
    :options="isSelectableDate"
    :locale="locale"
    mask="YYYY/MM/DD"
    minimal
    flat
    today-btn
    color="primary"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { QDate } from 'quasar'

const model = defineModel<string>({ default: '' })

const props = defineProps<{
  availableDates: readonly string[]
}>()

const availableDateSet = computed(() => new Set(props.availableDates))

const locale = {
  days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
  daysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  months: [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ],
  monthsShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
  firstDayOfWeek: 1,
}

function isSelectableDate(date: string) {
  return availableDateSet.value.has(date)
}
</script>
