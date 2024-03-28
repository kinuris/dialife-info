<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import PatientRecordsView from '../components/PatientRecordsView.vue'
import type { VueCookies } from 'vue-cookies'
import { jwtDecode } from 'jwt-decode'

const props = defineProps<{ patient?: string }>()

const search = ref<string>('')
const patients = ref<Patient[]>()
const loaded = ref(false)
const searchFocused = ref(false)

const selectedPatient = ref<Patient | null>(null)
const $cookies = inject<VueCookies>('$cookies') as VueCookies
const claims = jwtDecode($cookies.get('jwt')) as any

onMounted(async () => {
  if (!props.patient) {
    return
  }

  const response = await fetch(`/dialife-api/patient/get/${props.patient}`)
  const data = (await response.json()) as Patient

  selectedPatient.value = data
})

onMounted(async () => {
  const response = await fetch(`/dialife-api/doctor/of/${claims['id']}`)
  const data = (await response.json()) as Patient[]

  patients.value = data
  loaded.value = true
})

function visible(patient: Patient): boolean {
  return patient.name.toLowerCase().includes(search.value.toLowerCase())
}
</script>

<template>
  <div class="container">
    <div class="search">
      <div class="dropdown">
        <input
          @focusin.stop="searchFocused = true"
          v-model.trim="search"
          class="dropdown-input"
          type="text"
          placeholder="Find Patient"
        />
        <div v-show="loaded" class="dropdown-list">
          <div v-show="searchFocused" @click="searchFocused = false" class="dropdown-item cancel">
            Cancel
          </div>
          <div
            @click="
              () => {
                selectedPatient = patient
                searchFocused = false
              }
            "
            v-show="visible(patient) && searchFocused"
            v-for="patient in patients"
            :key="patient.name"
            class="dropdown-item"
          >
            <p>{{ patient.name }}</p>
          </div>
        </div>
      </div>
      <div class="selected-patient">
        <p>
          <i style="font-size: 14px">Selected Patient: </i>
          <template v-if="selectedPatient">
            {{ selectedPatient.name }}
          </template>
          <template v-else> (None) </template>
        </p>
        <button @click="selectedPatient = null" v-if="selectedPatient">Deselect</button>
      </div>
    </div>
    <PatientRecordsView :patient="selectedPatient" />
  </div>
</template>

<style scoped>
.cancel {
  color: red;
}

.selected-patient button {
  margin-left: 12px;
  border: 1px solid red;
  color: red;
  border-radius: 5px;
}

.selected-patient {
  display: flex;
  margin-left: 24px;
  color: #707070;
}

.search {
  display: flex;
  justify-content: start;
  place-items: center;
  padding: 20px 20px;
}

.container {
  display: flex;
  flex-direction: column;
  background-color: #ececec;
  height: 100%;
}

.dropdown {
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
