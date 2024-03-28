<script setup lang="ts">
import { format } from 'date-fns'

const props = defineProps<{ records: ActivityType[] }>()
</script>

<template>
  <h3>Activity Records (7 Days)</h3>
  <table>
    <thead>
      <tr>
        <td>Date</td>
        <td>Type</td>
        <td>Duration</td>
        <td>Frequency</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="record in props.records" :key="record.activity_created_at">
        <td>
          {{
            `${format(new Date(Date.parse(record.activity_created_at)), 'MMM. dd, yyyy - hh:mm a')}`
          }}
        </td>
        <td>{{ record.activity_type }}</td>
        <td>{{ record.activity_duration }}</td>
        <td>{{ record.activity_frequency }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
h3 {
  margin-bottom: 8px;
}

table,
td {
  border-collapse: collapse;
}

table {
  border: 1px solid #707070;
}

thead {
  font-size: 20px;
}

thead tr td {
  border-bottom: 2px solid #707070;
  padding: 0 8px;
}

tbody tr td {
  padding: 0 8px;
}

td {
  border: 1px solid #707070;
}
</style>
