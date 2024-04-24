<script setup lang="ts">
import { delay } from '@/utils/calc'
import LoadingView from '../components/reusable/LoadingView.vue'
import { jwtDecode } from 'jwt-decode'
import { inject, onMounted, ref } from 'vue'
import type { VueCookies } from 'vue-cookies'

const patients = ref<Patient[]>()
const allPatients = ref<Patient[]>()

const search = ref<string>('')
const loading = ref(false)
const searchFocused = ref(false)

const $cookies = inject<VueCookies>('$cookies') as VueCookies
const claims = jwtDecode($cookies.get('jwt')) as any

async function handleAddConnection(name: string, id: string) {
  if (!confirm(`Are you sure you want to ADD patient NAME: ${name}?`)) {
    return
  }

  loading.value = true
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [result, _] = await Promise.all([
    fetch(`/dialife-api/patient/assign`, {
      method: 'POST',
      body: JSON.stringify({
        patient_id: id,
        doctor_id: claims['id']
      })
    }),
    delay(200)
  ])

  await result.json()
  await refresh()

  loading.value = false
  searchFocused.value = false
}

async function handleRemoveConnection(id: string) {
  if (!confirm(`Are you sure you want to REMOVE patient ID: ${id}?`)) {
    return
  }

  loading.value = true
  const [result, _] = await Promise.all([
    fetch(`/dialife-api/patient/revoke`, {
      method: 'POST',
      body: JSON.stringify({
        patient_id: id,
        doctor_id: claims['id']
      })
    }),
    delay(200)
  ])

  await result.json()
  await refresh()
  loading.value = false
}

onMounted(async () => {
  loading.value = true
  await Promise.all([refresh(), delay(200)])
  loading.value = false
})

async function refresh() {
  const response = await fetch(`/dialife-api/doctor/of/${claims['id']}`)
  const data = (await response.json()) as Patient[]

  const allPatientResponse = await fetch('/dialife-api/patient/get/all')
  const allPatientData = (await allPatientResponse.json()) as Patient[]

  const unconnected = allPatientData.filter(
    (patient) => !data.map((e) => e.patient_id).includes(patient.patient_id)
  )

  allPatients.value = unconnected
  patients.value = data
}

function visible(patient: Patient): boolean {
  return patient.name.toLowerCase().includes(search.value.toLowerCase())
}
</script>

<template>
  <LoadingView :loading />
  <div class="container">
    <div class="patients-container">
      <h3>Manage Patients</h3>
      <h6>Total Number of Patient(s): {{ patients?.length }}</h6>
      <div class="dropdown">
        <input
          @focusin.stop="searchFocused = true"
          v-model.trim="search"
          class="dropdown-input"
          type="text"
          placeholder="Add Patient"
        />
        <div class="dropdown-list">
          <div v-show="searchFocused" @click="searchFocused = false" class="dropdown-item cancel">
            Cancel
          </div>
          <div
            @click="handleAddConnection(patient.name, patient.patient_id)"
            v-show="visible(patient) && searchFocused"
            v-for="patient in allPatients"
            :key="patient.name"
            class="dropdown-item"
          >
            <p>{{ patient.name }}</p>
          </div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <td>Patient ID</td>
            <td>Patient Name</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="patient in patients" :key="patient.name">
            <td>{{ patient.patient_id }}</td>
            <td>{{ patient.name }}</td>
            <td>
              <button @click="handleRemoveConnection(patient.patient_id)" type="button">
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.cancel {
  color: red;
}

td button {
  transition: 0.2s transform;
  display: block;
  border: none;
  background-color: white;
  color: red;
}

td button:hover {
  text-decoration: underline;
  transform: scale(1.1);
}

.container {
  display: flex;
  flex-direction: column;
  background-color: #ececec;
  height: 100%;
}

table,
td {
  border-collapse: collapse;
}

table {
  width: 100%;
  color: #707070;
  margin-top: 36px;
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

.patients-container {
  background-color: white;
  margin: 20px;
  padding: 12px;
  height: calc(100% - 40px);
  overflow: scroll;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  color: #b7b4b4;
  /* background-color: white;
  margin: 20px;
  padding: 12px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  color: #b7b4b4; */
}

h3 {
  font-family: Montserrat;
}

h6 {
  font-family: Montserrat;
  font-size: 12px;
}

/* NOTE: Dropdown */
.dropdown {
  margin-top: 16px;
  position: relative;
  width: 100%;
  max-width: 400px;
}

.dropdown-input {
  background: url('/src/assets/search.svg') no-repeat scroll 8px 5px;
  background-color: #ececec;
  text-indent: 30px;
  background-size: 25px;
}

.dropdown-input:active {
  background: url('/src/assets/search.svg') no-repeat scroll 8px 5px;
}

.dropdown-input,
.dropdown-selected {
  width: 100%;
  padding: 8px 16px;
  border: 1px solid #707070;
  line-height: 1.5em;
  /* outline: solid grey 1px; */
  border-radius: 8px;
}

.dropdown-input:focus,
.dropdown-selected:hover {
  background: #fff;
  border-color: #e2e8f0;
}

.dropdown-input::placeholder {
  opacity: 0.7;
}

.dropdown-selected {
  font-weight: bold;
  cursor: pointer;
}

.dropdown-list {
  position: absolute;
  width: 100%;
  max-height: 500px;
  margin-top: 4px;
  overflow-y: auto;
  background: #ffffff;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}

.dropdown-item {
  display: flex;
  width: 100%;
  padding: 11px 16px;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #edf2f7;
}

.dropdown-item p {
  color: black;
}

.dropdown-item-flag {
  max-width: 24px;
  max-height: 18px;
  margin: auto 12px auto 0px;
}
</style>
