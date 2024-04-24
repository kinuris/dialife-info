<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { getConsolidated, getLatest } from '@/utils/api'
import { format } from 'date-fns'
import { onMounted, ref } from 'vue'
import { delay } from '@/utils/calc'

const props = defineProps<{ patient: Patient; onLoad?: () => void }>()
const data = ref<{
  glucose: GlucoseType[]
  bmi: BMIType | null
}>()

const link = `/patients/${props.patient.patient_id}`

onMounted(async () => {
  const [glucoseResponse, bmiResponse] = await Promise.all([
    getConsolidated(props.patient.patient_id, 'glucose', 100),
    getLatest(props.patient.patient_id, 'bmi')
  ])

  if (JSON.stringify(bmiResponse) === '{}') {
    data.value = {
      glucose: glucoseResponse,
      bmi: null
    }

    if (props.onLoad) {
      await delay(200)
      props.onLoad()
    }

    return
  }

  data.value = {
    glucose: glucoseResponse,
    bmi: bmiResponse
  }

  if (props.onLoad) {
    await delay(200)
    props.onLoad()
  }
})
</script>

<template>
  <RouterLink :to="link">
    <div class="summary-card">
      <h3>{{ props.patient.name }}</h3>
      <h5>Latest Records:</h5>
      <div v-if="data" class="data-container">
        <template v-if="!data.glucose.length">
          <p class="created-date">Latest Record: (No Records)</p>
          <div class="patient-data">
            <img src="/src/assets/glucose.svg" alt="Glucose" width="48px" title="Glucose Level" />
            <p>(No Records)</p>
          </div>
        </template>
        <template v-else>
          <p class="created-date">
            {{
              format(
                new Date(Date.parse(data.glucose[0].glucose_created_at)),
                'MMM. dd, yyyy@ hh:mm a'
              )
            }}
          </p>
          <div class="patient-data">
            <img src="/src/assets/glucose.svg" alt="Glucose" width="48px" title="Glucose Level" />
            <p>
              <b>{{ data.glucose[0].blood_glucose_level }}</b
              ><i> mmol/L</i>
            </p>
          </div>
        </template>
        <template v-if="data.bmi === null">
          <p class="created-date">Latest Record: (No Records)</p>
          <div class="patient-data">
            <img src="/src/assets/bmi.svg" alt="Glucose" width="48px" title="BMI Level" />
            <p>(No Records)</p>
          </div>
        </template>
        <template v-else>
          <p class="created-date">
            {{ format(new Date(Date.parse(data.bmi.bmi_created_at)), 'MMM. dd, yyyy@ hh:mm a') }}
          </p>
          <div class="patient-data">
            <img src="/src/assets/bmi.svg" alt="Glucose" width="48px" title="BMI Level" />
            <p>
              <b
                >{{ data.bmi.bmi_level }} <i>kg/m<sup>2</sup></i></b
              >
            </p>
          </div>
        </template>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
a {
  text-decoration: none;
  aspect-ratio: 1;
  margin: 8px;
  min-width: max(250px, 30%);
}

.summary-card {
  transition: 0.3s all;
  box-shadow: 1px 3px 10px rgba(0, 0, 0, 0.6);
}

.summary-card:hover {
  opacity: 0.8;
  transform: scale(1.01);
}

sup {
  font-family: Montserrat;
  font-size: 8px;
  font-weight: bold;
}

.patient-data {
  display: flex;
  place-items: center;
  font-family: Montserrat;
  margin-bottom: 12px;
}

.data-container img {
  margin-right: 8px;
}

.created-date {
  font-size: 12px;
  font-style: italic;
}

.data-container {
  padding: 12px;
  display: flex;
  flex-direction: column;
}

i {
  font-size: 12px;
}

b {
  font-weight: bold;
  font-size: 18px;
}

h3 {
  font-weight: bold;
  font-size: 13px;
  font-family: Montserrat;
}

.summary-card {
  border: 1px solid #698c97;
  padding: 12px;
  border-radius: 12px;
  background-color: #769ba544;
  color: #54747d;
  aspect-ratio: 1;
  min-width: max(250px, 30%);
}
</style>
