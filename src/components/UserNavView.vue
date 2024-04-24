<script setup lang="ts">
import router from '@/router'
import { delay } from '@/utils/calc'
import { inject, ref } from 'vue'
import type { VueCookies } from 'vue-cookies'

const props = defineProps<{ user: User }>()
const defaultProfile = props.user.profile_picture_link.length < 5
const $cookies = inject<VueCookies>('$cookies') as VueCookies

const showProfilePicker = ref(false)
const showNameChange = ref(false)
const profilePicChangeLoading = ref(false)
const nameChangeLoading = ref(false)

const nameModel = ref(props.user.name)
const emailModel = ref(props.user.email)
const errorMessage = ref('')

const pickedProfile = ref<string | null>(defaultProfile ? null : props.user.profile_picture_link)

async function handleLogout() {
  if (!confirm('Are you sure you want to logout?')) {
    return
  }

  $cookies.remove('jwt')

  await router.push('/login')
}

async function handleChangeProfile() {
  nameChangeLoading.value = true

  if (nameModel.value == props.user.name && emailModel.value == props.user.email) {
    showNameChange.value = false
    nameChangeLoading.value = false
    return
  }

  const response = await fetch('/dialife-api/doctor/profile', {
    method: 'POST',
    body: JSON.stringify({
      doctor_id: props.user.doctor_id,
      name: nameModel.value,
      email: emailModel.value
    })
  })

  if (response.status !== 200) {
    errorMessage.value = (await response.json()).message
    nameModel.value = props.user.name
    emailModel.value = props.user.email

    nameChangeLoading.value = false
    return
  }

  nameChangeLoading.value = false
  window.location.reload()
}

async function handleChangeProfilePic(ev: any) {
  profilePicChangeLoading.value = true
  const reader = new FileReader()

  reader.readAsDataURL(ev.target.files[0])
  reader.addEventListener('load', async () => {
    pickedProfile.value = reader.result as string

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [response, _] = await Promise.all([
      fetch(`/dialife-api/doctor/profilepic`, {
        method: 'POST',
        body: JSON.stringify({
          doctor_id: props.user.doctor_id,
          pic: pickedProfile.value
        })
      }),
      delay(300)
    ])

    if (response.status !== 200) {
      alert('Failed')
      return
    }

    const result = (await response.json()) as ProfilePicChange
    pickedProfile.value = result.link
    profilePicChangeLoading.value = false
  })
}
</script>
<!-- :class="{ activated: showProfilePicker }" -->
<template>
  <Transition name="name-fade">
    <div v-if="showNameChange" class="name-change">
      <div class="change-profile">
        <div v-if="nameChangeLoading" class="loading">Loading...</div>
        <div class="name">
          <p>Change your name</p>
          <p v-if="errorMessage" id="error">{{ errorMessage }}</p>
          <label for="name">Name</label>
          <input type="text" placeholder="Name" name="name" id="name" v-model="nameModel" />
          <label for="email">Email</label>
          <input
            type="email"
            readonly
            disabled
            placeholder="Email"
            name="email"
            id="email"
            v-model="emailModel"
          />
        </div>
        <div class="email">
          <button @click="handleChangeProfile">Save</button>
        </div>
      </div>
    </div>
  </Transition>
  <Transition name="pp-fade">
    <div v-if="showProfilePicker" class="profile-picture">
      <div class="change-pp">
        <div v-if="profilePicChangeLoading" class="loading">Loading...</div>
        <div>
          <label for="file">File Input</label>
          <input
            type="file"
            name="file"
            id="file"
            accept="image/jpeg,image/png "
            @change="handleChangeProfilePic($event)"
          />
        </div>
        <p @click="showProfilePicker = false" id="exit">X</p>
        <div id="profile-pic">
          <img v-if="!pickedProfile" src="/src/assets/default.jpg" alt="Edit Profile Pic" />
          <img v-else :src="pickedProfile" alt="Edit Profile Pic" />
        </div>
      </div>
    </div>
  </Transition>
  <div class="container">
    <p @click="handleLogout" id="logout">logout</p>
    <p
      class="doctor-name"
      @click="
        () => {
          showNameChange = !showNameChange
          showProfilePicker = false
          errorMessage = ''
          nameModel = props.user.name
          emailModel = props.user.email
        }
      "
    >
      Dr. {{ props.user.name }}
    </p>
    <div
      @click="
        () => {
          showProfilePicker = !showProfilePicker
          showNameChange = false
        }
      "
      class="pp-container"
      v-if="!pickedProfile"
    >
      <img src="/src/assets/default.jpg" alt="Profile Pic" />
    </div>
    <div
      @click="
        () => {
          showProfilePicker = !showProfilePicker
          showNameChange = false
        }
      "
      class="pp-container"
      v-else
    >
      <img :src="pickedProfile" alt="Profile Pic" />
    </div>
    <!-- <img src="/src/assets/arrow_down.svg" alt="Dropdown" /> -->
  </div>
</template>

<style scoped>
#error {
  color: red !important;
}

.loading {
  position: absolute;
  display: flex;
  justify-content: center;
  place-items: center;
  color: white;
  font-family: Montserrat;
  font-size: 24px;
  width: 100%;
  height: 100%;
  background-color: #54747d70;
  backdrop-filter: blur(2px);
}

.email button {
  transition: 0.2s all;
  border: 1px solid transparent;
  width: 100%;
  color: white;
  background-color: #7aa0ab;
  border: none;
  padding: 12px 0;
  border-radius: 8px;
  margin-top: 32px;
}

.name p {
  color: white !important;
  font-family: Montserrat;
  margin-bottom: 6px;
}

.email button:hover {
  transform: scale(1.01);
  border: 1px solid white;
}

.name input {
  border: none;
  width: 100%;
  border-radius: 8px;
  padding: 12px 16px;
  color: black;
  margin-bottom: 12px;
}

#profile-pic img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

#profile-pic {
  margin: 40px;
  overflow: hidden;
  grid-area: main;
  border-radius: 50%;
  border: 1px solid white;
  aspect-ratio: auto;
}

p#exit {
  cursor: pointer;
  grid-area: exit;
  text-align: right;
  font-family: Montserrat;
  color: white;
}

.change-pp:first-child {
  grid-area: file;
}

.doctor-name {
  cursor: pointer;
  user-select: none;
}

.name {
  grid-area: name;
}

.name input {
  width: 100%;
}

.email {
  grid-area: email;
}

.change-profile {
  overflow: scroll;
  display: grid;
  grid-template:
    'name name' 50%
    'email email' 50%;
  background-color: #6a6a6ad0;
  padding: 16px;
  border-radius: 16px;
  aspect-ratio: 0.9;
  width: max(375px, 33%);
  backdrop-filter: blur(5px);
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.3);
}

.change-pp {
  overflow: scroll;
  display: grid;
  grid-template:
    'file exit' 30px
    'main main' calc(100% - 30px);
  background-color: #6a6a6ad0;
  padding: 16px;
  border-radius: 16px;
  aspect-ratio: 0.9;
  width: max(375px, 33%);
  backdrop-filter: blur(5px);
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.3);
}

.pp-fade-enter-active,
.pp-fade-leave-active,
.name-fade-enter-active,
.name-fade-leave-active {
  transition: all 0.3s ease;
}

.pp-fade-enter-to,
.pp-fade-leave-from,
.name-fade-enter-to,
.name-fade-leave-from {
  backdrop-filter: blur(5px);
}

.change-pp label,
.change-profile label {
  display: none;
}

.pp-fade-enter-from,
.pp-fade-leave-to,
.name-fade-enter-from,
.name-fade-leave-to {
  opacity: 0;
}

.profile-picture,
.name-change {
  justify-content: center;
  place-items: center;
  backdrop-filter: blur(5px);
  display: flex;
  position: absolute;
  top: 80px;
  left: 0;
  width: calc(100vw - 350px);
  height: calc(100vh - 80px);
  z-index: 20;
}

p#logout {
  color: #707070;
  font-style: italic;
  font-family: Montserrat;
  text-decoration: underline;
  font-size: 10px;
  margin-right: 12px;
  cursor: pointer;
}

p#logout:hover {
  transform: scale(1.1);
}

.container {
  display: flex;
  place-items: center;
  height: 80px;
  justify-content: end;
  padding: 0 24px;
}

.pp-container {
  cursor: pointer;
  overflow: hidden;
  border-radius: 30px;
  max-width: 50px;
  aspect-ratio: 1;
  margin-left: 12px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.6);
}

.pp-container img[alt='Profile Pic'] {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.container img[alt='Dropdown'] {
  width: 18px;
}

.container p {
  color: black;
}
</style>
