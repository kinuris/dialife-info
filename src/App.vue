<script setup lang="ts">
import type { VueCookies } from 'vue-cookies'

import { delay } from './utils/calc'
import { jwtDecode } from 'jwt-decode'
import { inject, ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import UserNavView from './components/UserNavView.vue'

const route = useRoute()
const loading = ref(true)
const user = ref<User | undefined>(undefined)

const authenticated = ref(false)

watch(
  () => route.path,
  async () => {
    const response = await fetch('/dialife-api/doctor/checkauth', { method: 'POST' })

    if (response.status !== 200 && authenticated.value) {
      authenticated.value = false
      window.location.replace('/')
    }
  }
)

const $cookies = inject<VueCookies>('$cookies') as VueCookies
const stop = watch(
  () => [route.path],
  async () => {
    const jwtCookie = $cookies.get('jwt')

    if (jwtCookie) {
      const claims = jwtDecode(jwtCookie) as any

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [response, _] = await Promise.all([
        fetch(`/dialife-api/doctor/get/${claims['id']}`),
        delay(200)
      ])

      user.value = await response.json()

      authenticated.value = true
      stop()
    }

    loading.value = false
  }
)
</script>

<template>
  <div v-if="!loading" class="container">
    <nav v-if="$route.path !== ('/login' as string) && $route.path !== ('/signup' as string)">
      <RouterLink to="/">
        <div class="appbar">
          <img src="/src/assets/dialife_launcher_logo.png" alt="Logo" />
          <h1>Dialife</h1>
        </div>
      </RouterLink>
      <RouterLink to="/">
        <div v-bind:class="{ active: $route.path === '/' }" class="nav-item">
          <img src="/src/assets/dashboard.svg" alt="Dashboard" />
          <p>Dashboard</p>
        </div>
      </RouterLink>
      <RouterLink to="/patients">
        <div v-bind:class="{ active: $route.path === '/patients' }" class="nav-item">
          <img src="/src/assets/patient.svg" alt="Patient" />
          <p>Patients</p>
        </div>
      </RouterLink>
      <RouterLink to="/records">
        <div v-bind:class="{ active: $route.path === '/records' }" class="nav-item">
          <img src="/src/assets/reports.svg" alt="Patient" />
          <p>Manage Patients</p>
        </div>
      </RouterLink>
      <RouterLink to="/contacts">
        <div v-bind:class="{ active: $route.path === '/contacts' }" class="nav-item">
          <img src="/src/assets/call_log.svg" alt="Patient" />
          <p>Contact Numbers</p>
        </div>
      </RouterLink>
    </nav>
    <div class="content">
      <div class="topbar" v-if="$route.path !== '/login' && $route.path !== '/signup'">
        <Transition name="fade">
          <div v-if="user !== undefined">
            <UserNavView :user />
          </div>
          <div class="topbar-load" v-else>
            <p>Loading User Data</p>
          </div>
        </Transition>
      </div>
      <div class="main-container">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.topbar-load {
  position: absolute;
  font-family: Montserrat;
  left: 50px;
  display: flex;
  place-items: center;
  justify-content: center;
  height: 100%;
}

.main-container {
  position: relative;
  z-index: 0;
  height: calc(100% - 80px);
}

.content {
  width: 100%;
  max-height: 100vh;
}

.container {
  display: flex;
}

.topbar {
  height: 80px;
  position: relative;
  display: flex;
  justify-content: end;
  z-index: 1;
  width: 100%;
  border-bottom: 1px solid #70707040;
  box-shadow: 1px 0 3px rgba(0, 0, 0, 0.6);
}

.topbar p {
  color: #999999;
}

a {
  text-decoration: none;
}

h1 {
  color: #7aa0ab;
  font-size: 44px;
  font-weight: bold;
  height: 64px;
  font-family: 'Italianno';
}

.nav-item {
  display: flex;
  padding: 12px 24px;
  place-items: center;
  border-bottom: 1px solid #70707020;
  position: relative;
}

.nav-item:hover::after {
  opacity: 1;
}

.active::after {
  content: '';
  opacity: 1 !important;
  display: block;
  height: 100%;
  width: 3px;
  position: absolute;
  right: 0;
  background-color: #7aa0ab;
}

.active::before {
  content: '';
  display: block;
  opacity: 1 !important;
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  background-image: linear-gradient(to top, #7aa0ab30, transparent);
}

.nav-item::after {
  transition: 0.3s opacity;
  content: '';
  opacity: 0;
  display: block;
  height: 100%;
  width: 3px;
  position: absolute;
  right: 0;
  background-color: #7aa0ab;
}

.nav-item img {
  width: 22px;
}

.nav-item p {
  margin-left: 20px;
  color: #999999;
  font-size: 18px;
  text-decoration: none;
  font-weight: 400;
  font-family: Montserrat;
}

.appbar {
  display: flex;
  height: 80px;
  padding-left: 16px;
  place-items: center;
  border-bottom: 1px solid #70707055;
}

img[alt='Logo'] {
  width: 48px;
  margin-right: 16px;
}

nav {
  min-width: 350px;
  box-shadow: 2px 0px 3px rgba(0, 0, 0, 0.2);
  height: 100vh;
  display: flex;
  position: relative;
  z-index: 3;
  flex-direction: column;
}
</style>
