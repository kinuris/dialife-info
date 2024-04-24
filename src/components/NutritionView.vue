<script setup lang="ts">
import { format } from 'date-fns'

const props = defineProps<{ records: NutritionType[] }>()
</script>

<template>
  <h3>Nutrition Records (7 Days)</h3>
  <table>
    <thead>
      <tr>
        <td>Date</td>
        <td>Meal Time</td>
        <td>Foods</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="record in props.records" :key="record.nutrition_created_at">
        <td>
          {{
            `${format(new Date(Date.parse(record.nutrition_created_at)), 'MMM. dd, yyyy - hh:mm a')}`
          }}
        </td>
        <td>
          {{ record.nutrition_meal_time }}
        </td>
        <td>
          {{ record.nutrition_foods.split(',').join(', ') }}
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
