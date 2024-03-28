<script setup lang="ts">
import { format } from 'date-fns'

const props = defineProps<{ records: MedicationType[] }>()
</script>

<template>
  <h3>Medicine Records (7 Days)</h3>
  <table>
    <thead>
      <tr>
        <td>Date Taken</td>
        <td>Medicine Name</td>
        <td>Medicine Form</td>
        <td>Medicine Route</td>
        <td>Medicine Dosage</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="record in props.records" :key="record.medicine_taken_at">
        <td>
          {{
            `${format(new Date(Date.parse(record.medicine_taken_at)), 'MMM. dd, yyyy - hh:mm a')}`
          }}
        </td>
        <td>{{ record.medicine_name }}</td>
        <td>{{ record.medicine_form }}</td>
        <td>{{ record.medicine_route }}</td>
        <td>{{ record.medicine_dosage }} grams</td>
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
