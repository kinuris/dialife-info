<script setup lang="ts">
import SummaryView from './SummaryView.vue'
import GlucoseView from './GlucoseView.vue'
import NutritionView from './NutritionView.vue'
import ActivityView from './ActivityView.vue'
import MedicationView from './MedicationView.vue'

import { ref, watch } from 'vue'
import { getConsolidated, getLatest } from '../utils/api'
import LoadingView from './reusable/LoadingView.vue'
import { delay } from '@/utils/calc'

const props = defineProps<{ patient: Patient | null }>()
const selected = ref<PatientRecordType | 'summary'>('summary')
const loading = ref(false)
const data = ref<{
  glucose: GlucoseType[]
  activity: ActivityType[]
  nutrition: NutritionType[]
  medication: MedicationType[]
  bmi: BMIType | {}
}>()

watch(
  () => selected.value,
  async () => {
    const response = await fetch('/dialife-api/doctor/checkauth', { method: 'POST' })

    if (response.status !== 200) {
      window.location.replace('/')
    }
  }
)

watch(
  () => props.patient,
  async () => {
    if (props.patient == null) {
      return
    }

    loading.value = true
    const [glucoseResponse, bmiResponse, activityResponse, medicationResponse, nutritionResponse] =
      await Promise.all([
        getConsolidated(props.patient.patient_id, 'glucose'),
        getLatest(props.patient.patient_id, 'bmi'),
        getConsolidated(props.patient.patient_id, 'activity'),
        getConsolidated(props.patient.patient_id, 'medication'),
        getConsolidated(props.patient.patient_id, 'nutrition'),
        delay(200)
      ])

    data.value = {
      glucose: glucoseResponse,
      bmi: bmiResponse,
      activity: activityResponse,
      nutrition: nutritionResponse,
      medication: medicationResponse
    }

    loading.value = false
    // loading.value = false
  }
)
</script>

<template>
  <LoadingView :loading />
  <div class="main">
    <div class="info">
      <h1>DIALIFE PATIENT RECORD</h1>
      <template v-if="props.patient === null">
        <h1>(No Patient Selected)</h1>
      </template>
      <template v-else>
        <div class="btn-group">
          <button
            @click="selected = 'summary'"
            :class="{ active: selected === 'summary' }"
            type="button"
          >
            Summary
          </button>
          <button
            @click="selected = 'glucose'"
            :class="{ active: selected === 'glucose' }"
            type="button"
          >
            Glucose
          </button>
          <button
            @click="selected = 'nutrition'"
            :class="{ active: selected === 'nutrition' }"
            type="button"
          >
            Nutrition
          </button>
          <button
            @click="selected = 'activity'"
            :class="{ active: selected === 'activity' }"
            type="button"
          >
            Activity
          </button>
          <button
            @click="selected = 'medication'"
            :class="{ active: selected === 'medication' }"
            type="button"
          >
            Medicine
          </button>
        </div>
      </template>
    </div>
    <hr />
    <template v-if="props.patient === null"></template>
    <template v-else>
      <div class="patient-data">
        <SummaryView
          v-if="data !== undefined && selected === 'summary'"
          :patient="props.patient"
          :bmi="data?.bmi"
        />
        <GlucoseView v-if="data !== undefined && selected === 'glucose'" :records="data?.glucose" />
        <NutritionView
          v-if="data !== undefined && selected === 'nutrition'"
          :records="data?.nutrition"
        />
        <ActivityView
          v-if="data !== undefined && selected === 'activity'"
          :records="data?.activity"
        />
        <MedicationView
          v-if="data !== undefined && selected === 'medication'"
          :records="data?.medication"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.btn-group {
  overflow: hidden;
}

.btn-group button {
  transition: 0.3s background-color;
  border: 1px solid #707070;
  padding: 8px 16px;
}

.btn-group button:hover,
.active {
  background-color: lightblue;
}

.btn-group button:first-child {
  border-right: none;
  border-bottom-left-radius: 8px;
  border-top-left-radius: 8px;
}

.btn-group button:not(:first-child):not(:last-child) {
  border-left: none;
  border-right: none;
}

.btn-group button:last-child {
  border-left: none;
  border-bottom-right-radius: 8px;
  border-top-right-radius: 8px;
}

.patient-data {
  display: flex;
  padding: 8px 12px;
  flex: 1;
  flex-direction: column;
  color: #707070;
}

.main {
  background-color: white;
  margin: 20px;
  padding: 12px;
  height: calc(100% - 40px);
  overflow: scroll;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  color: #b7b4b4;
  /* display: flex;
  flex-direction: column;
  background-color: white;
  margin: 0 20px 20px 20px;
  padding: 8px 16px;
  height: 100%;
  border-radius: 12px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3); */
}

hr {
  background-color: #ececec;
  height: 1px;
  border: none;
}

.info {
  display: flex;
  place-items: center;
  justify-content: space-between;
}

.main .info h1 {
  font-size: 16px;
  color: #b7b4b4;
  padding: 12px;
  font-family: 'Montserrat';
}

.main h2 {
  color: grey;
  margin-bottom: 3px;
}
</style>
