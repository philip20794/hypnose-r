<template>
  <div class="ds-price-table">
    <table>
      <thead>
        <tr>
          <th>Angebot</th>
          <th>Inhalt</th>
          <th>Preis</th>
          <th aria-label="Termin buchen"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.title">
          <td data-label="Angebot">
            <strong>{{ item.title }}</strong>
            <span>{{ item.note }}</span>
          </td>
          <td data-label="Inhalt">{{ item.details }}</td>
          <td data-label="Preis">{{ item.price }}</td>
          <td class="ds-price-table__action">
            <DsButton
              :to="`/termin-buchen?type=${item.bookingType}`"
              variant="ghost"
              icon="event_available"
            >
              Termin wählen
            </DsButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: readonly {
    title: string
    details: string
    price: string
    note: string
    bookingType: 'intro' | 'hypnosis'
  }[]
}>()
</script>
