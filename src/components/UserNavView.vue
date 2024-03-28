<script setup lang="ts">
import router from '@/router'
import { inject } from 'vue'
import type { VueCookies } from 'vue-cookies'

const props = defineProps<{ user: User }>()

const defaultProfile = props.user.profile_picture_link.length < 5

const $cookies = inject<VueCookies>('$cookies') as VueCookies

async function handleLogout() {
  if (!confirm('Are you sure you want to logout?')) {
    return
  }

  $cookies.remove('jwt')

  await router.push('/login')
}
</script>

<template>
  <div class="container">
    <p @click="handleLogout" id="logout">logout</p>
    <p>Dr. {{ props.user.name }}</p>
    <div class="pp-container" v-if="defaultProfile">
      <img src="/src/assets/default.jpg" alt="Profile Pic" />
    </div>
    <div class="pp-container" v-else>
      <img :src="props.user.profile_picture_link" alt="Profile Pic" />
    </div>
    <!-- <img src="/src/assets/arrow_down.svg" alt="Dropdown" /> -->
  </div>
</template>

<style scoped>
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
  overflow: hidden;
  max-width: 48px;
  max-height: 48px;
  border-radius: 30px;
  margin-left: 12px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.6);
}

.container img[alt='Profile Pic'] {
  object-fit: cover;
  width: 46px;
}

.container img[alt='Dropdown'] {
  width: 18px;
}

.container p {
  color: black;
}
</style>
