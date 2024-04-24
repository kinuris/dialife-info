<script setup lang="ts">
import { format } from 'date-fns'

const props = defineProps<{ records: GlucoseType[] }>()
</script>

<template>
  <h3>Glucose Records (7 Days)</h3>
  <table>
    <thead>
      <tr>
        <td>Date</td>
        <td>Glucose Level</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="record in props.records" :key="record.glucose_created_at">
        <td>
          {{
            `${format(new Date(Date.parse(record.glucose_created_at)), 'MMM. dd, yyyy - hh:mm a')}`
          }}
        </td>
        <td>
          {{ Number(record.blood_glucose_level).toFixed(2) }} mmol/L or
          {{ (Number(record.blood_glucose_level) * 18).toFixed(2) }} mg/dL
        </td>
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
