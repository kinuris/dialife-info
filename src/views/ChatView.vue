<script setup lang="ts">
import LoadingView from '@/components/reusable/LoadingView.vue'
import { jwtDecode } from 'jwt-decode'
import { computed, inject, onMounted, ref, watch } from 'vue'
import type { VueCookies } from 'vue-cookies'

const $cookies = inject<VueCookies>('$cookies') as VueCookies
const claims = jwtDecode($cookies.get('jwt')) as any

const selectedChat = ref<Patient | null>(null)
const currentChatConnection = ref<ChatConnection | null>(null)
const currectChatMessages = ref<ChatMessage[]>([])

const message = ref('')

const patients = ref<Patient[]>([])
const connectedPatients = ref<Patient[]>([])

const messageContainer = ref<HTMLDivElement | null>(null)

async function sendMessage() {
  if (currentChatConnection.value == null) {
    return
  }

  if (message.value == '') {
    return
  }

  const response = await fetch(
    'dialife-api/message/send/' + currentChatConnection.value.chat_connection_id,
    {
      method: 'POST',
      body: JSON.stringify({
        sender_type: 'doctor',
        sender_id: claims['id'],
        content: message.value
      })
    }
  )

  if (response.status != 200) {
    alert('Failed')
    return
  }

  message.value = ''
}

async function loadMessages() {
  if (currentChatConnection.value == null) {
    return
  }

  const response = await fetch(
    'dialife-api/message/get/' + currentChatConnection.value.chat_connection_id
  )

  const data = (await response.json()) as ChatMessage[]
  currectChatMessages.value = data
}

watch(selectedChat, async (_newValue, _oldValue, cleanUp) => {
  if (selectedChat.value == null) {
    currentChatConnection.value = null
    return
  }

  const response = await fetch(
    '/dialife-api/doctor/chat/getid/' + claims['id'] + '/' + selectedChat.value.patient_id
  )
  const data = (await response.json()) as ChatConnection

  currentChatConnection.value = data
  await loadMessages()

  if (messageContainer.value?.childElementCount !== 0) {
    messageContainer.value?.children[messageContainer.value.children.length - 1].scrollIntoView()
  }

  const timer = setInterval(async () => {
    const oldMessages = currectChatMessages.value

    await loadMessages()

    if (oldMessages.length !== currectChatMessages.value.length) {
      messageContainer.value?.children[messageContainer.value.children.length - 1].scrollIntoView({
        behavior: 'smooth'
      })
    }
  }, 1000)

  cleanUp(() => {
    clearInterval(timer)
  })
})

onMounted(() => {})

const unconnectedPatients = computed(() => {
  return patients.value.filter(
    (patient) => !connectedPatients.value.map((e) => e.patient_id).includes(patient.patient_id)
  )
})

const loading = ref(false)

async function loadPatients() {
  const response = await fetch(`/dialife-api/doctor/of/${claims['id']}`)

  const data = (await response.json()) as Patient[]

  patients.value = data
}

async function loadConnected() {
  const response = await fetch(`/dialife-api/doctor/chat/connected`)
  const data = (await response.json()) as Patient[]

  connectedPatients.value = data
}

async function connectChat(patientId: string) {
  const response = await fetch(`/dialife-api/doctor/chat/initiate`, {
    method: 'POST',
    body: JSON.stringify({
      patient_id: patientId
    })
  })

  if (response.status !== 200) {
    alert('Failed')
    return
  }

  loading.value = true
  await Promise.all([loadPatients(), loadConnected()])
  loading.value = false
}

onMounted(async () => {
  loading.value = true
  await Promise.all([loadPatients(), loadConnected()])
  loading.value = false
})
</script>

<template>
  <LoadingView :loading />
  <div class="container">
    <div class="chats">
      <div class="chat-summary">
        <div class="summary-header header-height">
          <h3>Messages</h3>
          <img
            @click="selectedChat = null"
            class="compose"
            src="/src/assets/compose.svg"
            alt="composer"
          />
        </div>

        <div v-for="patient in connectedPatients" v-bind:key="patient.patient_id">
          <div
            v-bind:class="{
              active: selectedChat?.patient_id === patient.patient_id,
              'chat-item': true
            }"
            @click="selectedChat = patient"
          >
            <p>{{ patient.name }}</p>
          </div>
        </div>
      </div>
      <div class="selected-chat">
        <template v-if="selectedChat == null">
          <div class="chat-header header-height">
            <p>To:</p>
            <input type="text" name="" id="" />

            <div class="dropdown">
              <p v-if="unconnectedPatients.length === 0">(No Patients)</p>
              <p
                v-for="patient in unconnectedPatients"
                v-bind:key="patient.patient_id"
                @click="connectChat(patient.patient_id)"
              >
                {{ patient.name }}
              </p>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="chat-header header-height">
            <p>{{ selectedChat.name }}</p>
          </div>
        </template>

        <template v-if="selectedChat === null">
          <div class="no-chat">
            <p>(No Selected Chat)</p>
          </div>
        </template>
        <template v-else>
          <div ref="messageContainer" class="message-container">
            <div
              v-for="message in currectChatMessages"
              v-bind:key="message.chat_message_id"
              v-bind:class="{
                'sent-message': message.sender_type === 'doctor',
                'patient-sent-message': message.sender_type === 'patient'
              }"
            >
              <p class="created-at">{{ new Date(message.created_at).toLocaleString() }}</p>
              <p>{{ message.content }}</p>
            </div>
          </div>
        </template>
      </div>
      <div class="message">
        <input v-model="message" type="text" id="message" />
        <img @click="sendMessage()" src="/src/assets/send.svg" alt="Send" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.created-at {
  font-size: 8px;
}

.message-container {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  max-height: calc(100% - 4rem);
  overflow: auto;
  padding-bottom: 4rem;
}

.no-chat {
  width: 100%;
  height: calc(100% - 4rem);
  display: flex;
  place-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.patient-sent-message {
  align-self: flex-start;
  color: black;
  padding: 0.5rem;
  margin: 2px;
  border-radius: 0.5rem;
  border-bottom-left-radius: 0;
  background-color: rgb(211, 211, 211);
}

.sent-message {
  align-self: flex-end;
  color: black;
  padding: 0.5rem;
  margin: 2px;
  border-radius: 0.5rem;
  border-bottom-right-radius: 0;
  max-width: 16rem;
  background-color: rgb(165, 232, 247);
}

.message {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  width: 100%;
  display: flex;
  bottom: 0;
}

.message img:hover {
  transform: scale(1.15);
}

.message img {
  transition: transform 0.2s;
  cursor: pointer;
  background-color: gray;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  border-top-left-radius: 16px;
}

.message input {
  margin: 0.5rem;
  flex: 1;
  padding: 0.5rem;
  border: 1px solid black;
  border-radius: 8px;
  background-color: transparent;
  font-family: montserrat;
}

.chat-item {
  padding: 0.75rem;
  display: flex;
  place-items: center;
  cursor: pointer;
  border-bottom: 1px solid #e4e4e4;
}

.active {
  background-color: #e6f8ff;
}

.chat-item::before {
  content: url('/src/assets/chat.svg');
  height: 20px;
  scale: 0.8;
}

.chat-item p {
  margin-left: 0.5rem;
}

.chat-item:hover {
  background-color: #f0f0f0;
}

.dropdown {
  display: none;
  position: absolute;
  background-color: white;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  overflow: auto;
  max-height: 16rem;
  width: 100%;
  top: 4rem;
  left: 0;
  z-index: 100;
}

.chat-item p {
  color: black;
}

.dropdown p {
  padding: 0.5rem;
  width: 100%;
  cursor: pointer;
}

.dropdown p:hover {
  background-color: #f0f0f0;
}

.chat-header:focus-within .dropdown {
  display: block;
}

.chat-header:hover .dropdown {
  display: block;
}

.chats {
  background-color: white;
  margin: 20px;
  position: relative;
  height: calc(100% - 40px);
  overflow: scroll;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  color: #b7b4b4;

  display: flex;
}

.summary-header {
  display: flex;
  padding: 0.75rem;
  justify-content: space-between;
  place-items: center;
  border-bottom: 1px solid #e4e4e4;
}

.header-height {
  min-height: 4rem;
  max-height: 4rem;
}

.compose {
  cursor: pointer;
  width: 24px;
  height: 24px;
}

.chat-header {
  display: flex;
  position: relative;
  padding-left: 1rem;
  padding-right: 1rem;
  place-items: center;
  border-bottom: 1px solid #e4e4e4;
}

.chat-header input {
  padding: 0.75rem;
  font-size: 1rem;
  font-family: montserrat;
  border-radius: 8px;
  border: none;
  outline: none;
  background-color: #f0f0f0;
}

.chat-header p {
  margin-right: 1rem;
}

.chat-summary {
  display: flex;
  flex-direction: column;
  flex: 1;
  border-right: 1px solid #e4e4e4;
}

.selected-chat {
  position: relative;
  flex: 2;
}

.container {
  display: flex;
  flex-direction: column;
  background-color: #ececec;
  height: 100%;
}

h3 {
  font-family: Montserrat;
  color: black;
  font-weight: bold;
}
</style>
