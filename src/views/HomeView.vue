<script setup lang="ts">
import SummaryCardView from '../components/SummaryCardView.vue'

import type { VueCookies } from 'vue-cookies'

import { RouterLink } from 'vue-router'
import { inject, onMounted, ref } from 'vue'
import { jwtDecode } from 'jwt-decode'

const $cookies = inject<VueCookies>('$cookies') as VueCookies
const claims = jwtDecode($cookies.get('jwt')) as any

const loaded = ref(false)

const patients = ref<Patient[]>()
onMounted(async () => {
  const response = await fetch(`/dialife-api/doctor/of/${claims['id']}`)
  const data = await response.json()

  patients.value = data
  loaded.value = true
})
</script>

<template>
  <div class="container">
    <div class="home">
      <h3>Dashboard</h3>
      <div class="summary-container">
        <template v-if="!patients?.length">
          <h5>(No Patients)</h5>
          <RouterLink class="no-data" to="/records">Add Patient</RouterLink>
        </template>
        <SummaryCardView v-for="patient in patients" :patient :key="patient.patient_id" />
      </div>
    </div>
  </div>
</template>

<style scoped>
h5 {
  font-family: Montserrat;
  font-size: 16px;
}

a.no-data {
  text-decoration: none;
  padding: 4px 8px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  color: #294249;
  background-color: #ececec;
}

h3 {
  font-family: Montserrat;
}

.summary-container {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}

.home {
  background-color: white;
  margin: 20px;
  padding: 12px;
  height: calc(100% - 40px);
  overflow: scroll;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  color: #b7b4b4;
}

.container {
  display: flex;
  flex-direction: column;
  background-color: #ececec;
  height: 100%;
}
</style>
