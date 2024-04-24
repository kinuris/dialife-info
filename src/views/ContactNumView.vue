<script setup lang="ts">
import LoadingView from '../components/reusable/LoadingView.vue'

import { delay } from '../utils/calc'
import { jwtDecode } from 'jwt-decode'
import { inject, onMounted, ref } from 'vue'
import type { VueCookies } from 'vue-cookies'

const $cookies = inject<VueCookies>('$cookies') as VueCookies
const claims = jwtDecode($cookies.get('jwt')) as any
const numbers = ref([] as DoctorContact[])
const number = ref('')
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  await Promise.all([refreshNumbers(), delay(200)])
  loading.value = false
})

async function handleAddContact() {
  if (numbers.value.map((n) => n.number).includes(number.value)) {
    alert('Number already exists')

    return
  }

  loading.value = true
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [response, _] = await Promise.all([
    await fetch(`/dialife-api/doctor/contact/add`, {
      method: 'POST',
      body: JSON.stringify({
        doctor_id: claims['id'],
        number: number.value
      })
    }),
    delay(200)
  ])

  await Promise.all([response.json(), refreshNumbers()])
  loading.value = false
  number.value = ''
}

async function handleDeleteContact(number: string) {
  if (!confirm('Are you sure you want to delete this contact number?')) {
    return
  }

  loading.value = true
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [response, _] = await Promise.all([
    fetch(`/dialife-api/doctor/contact/delete`, {
      method: 'POST',
      body: JSON.stringify({
        doctor_id: claims['id'],
        number
      })
    }),
    delay(200)
  ])

  await Promise.all([response.json(), refreshNumbers()])
  loading.value = false
}

async function refreshNumbers() {
  const response = await fetch(`/dialife-api/doctor/contact/get`, {
    method: 'POST',
    body: JSON.stringify({
      doctor_id: claims['id'],
      patient_web_id: 0
    })
  })

  numbers.value = (await response.json()) as DoctorContact[]
}
</script>

<template>
  <LoadingView :loading />
  <div class="container">
    <div class="contacts">
      <h3>My Contact Numbers</h3>
      <form
        @submit.prevent="handleAddContact"
        action="/dialife-api/doctor/contact/add"
        method="post"
      >
        <input
          v-model="number"
          type="tel"
          placeholder="Contact Number"
          name="contact"
          id="contact"
          required
        />
        <input type="submit" value="Add Contact" />
      </form>
      <h3 class="subtitle">Your patients can contact you through these numbers:</h3>
      <div class="num-container">
        <div class="num-card" v-for="number in numbers" :key="number.doctor_number_id">
          <div @click="handleDeleteContact(number.number)" class="rm-btn"><p>X</p></div>
          <i>#</i>
          <p>{{ number.number }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.subtitle {
  margin-top: 12px;
  font-size: 12px;
}

form {
  display: flex;
  flex-direction: column;
  margin-top: 32px;
  max-width: 300px;
}

.rm-btn p {
  color: white;
  font-weight: bold;
  text-align: center;
  font-family: Montserrat;
  text-align: center;
  padding-left: 2px;
  padding-top: 1px;
}

.rm-btn {
  cursor: pointer;
  position: absolute;
  display: flex;
  justify-content: center;
  padding: 2px;
  line-height: 1;
  border-radius: 10px;
  aspect-ratio: 1;
  top: -15px;
  right: -10px;
  background-color: #54747d;
}

.num-container {
  margin: 20px 0;
  display: flex;
  flex-wrap: wrap;
}

.num-card {
  padding: 4px;
  position: relative;
  font-family: Montserrat;
  margin-left: 4px;
  margin-right: 4px;
  margin-bottom: 16px;
  letter-spacing: 2px;
  border-radius: 8px;
  color: #54747d;
  border: 2px solid #54747d;
  display: flex;
}

i {
  font-weight: bold;
  margin: 0 4px;
}

.contacts {
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

input[type='submit'] {
  transition: 0.2s all;
  border: 1px solid transparent;
  width: 100%;
  color: white;
  background-color: #7aa0ab;
  border: none;
  padding: 12px 0;
  border-radius: 8px;
  margin-top: 12px;
}

input[type='submit']:hover {
  transform: scale(1.01);
}

input {
  border: none;
  width: 100%;
  border-radius: 8px;
  padding: 12px 16px;
  color: black;
  margin-bottom: 12px;
  border: 1px solid #54747d;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
}

h3 {
  font-family: Montserrat;
}
</style>
