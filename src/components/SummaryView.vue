<script setup lang="ts">
import { getAge } from '../utils/calc'

const props = defineProps<{ patient: Patient | null; bmi: BMIType | {} }>()
</script>

<template>
  <h3>Patient's Information Summary</h3>
  <div v-if="props.patient" class="summary">
    <div>
      <p><b>Full Name:</b> {{ props.patient.name }}</p>
      <p><b>Age:</b> {{ getAge(Date.parse(props.patient.birthdate)) }}</p>
      <p><b>Sex:</b> {{ props.patient.sex }}</p>
      <p>
        <b>Address:</b> Brgy. {{ props.patient.barangay }}, {{ props.patient.municipality }},
        {{ props.patient.province }}
      </p>
    </div>
    <div>
      <p><b>Phone Number:</b> {{ props.patient.contact_number }}</p>
      <p><b>Birthday:</b> {{ props.patient.birthdate }}</p>
      <p>
        <b>BMI Level (Most Recent):</b>
        {{ JSON.stringify(bmi) !== '{}' ? (bmi as BMIType).bmi_level : '(NO RECORDS)' }}
      </p>
    </div>
  </div>
</template>

<style>
h3 {
  font-size: 20px;
}

p > b {
  margin-right: 16px;
  font-weight: bold;
}

.summary div p {
  font-size: 15px;
  margin: 8px 0;
}

.summary {
  padding: 8px;
  display: flex;
  justify-content: space-between;
  padding-right: 100px;
  border: 1px solid #707070;
  margin-top: 4px;
}
</style>
