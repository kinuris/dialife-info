<script setup lang="ts">
import router from '@/router'
import { ref } from 'vue'

const email = ref()
const password = ref()
const confirmPassword = ref()
const name = ref()
const regKey = ref()

const error = ref<string>()

async function handleOnRegister() {
  if (password.value !== confirmPassword.value) {
    error.value = "Password don't match"
    confirmPassword.value = ''

    return
  }

  const response = await fetch(`/dialife-api/doctor/create`, {
    method: 'POST',
    body: JSON.stringify({
      name: name.value,
      email: email.value,
      password: password.value,
      regkey: regKey.value
    })
  })

  const result = await response.json()

  if (result.message !== 'Success') {
    error.value = result.message
    return
  }

  router.push('/login')
}
</script>

<template>
  <div @submit.prevent="handleOnRegister" class="container">
    <form method="post">
      <img src="/src/assets/dialife_launcher_logo.png" alt="Dialife Logo" />
      <h1>SIGNUP</h1>
      <div class="error-msg" v-if="error?.length">
        {{ error }}
      </div>
      <div class="form-group">
        <label for="name">Name</label>
        <input v-model="name" type="text" name="name" id="name" placeholder="Name" required />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="email" type="email" name="email" id="email" placeholder="Email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          v-model="password"
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Confirm Password</label>
        <input
          v-model="confirmPassword"
          type="password"
          name="password"
          id="password"
          placeholder="Confirm Password"
          required
        />
      </div>
      <div class="form-group">
        <label for="registration-key">Registration Key</label>
        <input
          maxlength="34"
          v-model="regKey"
          type="text"
          name="regkey"
          id="registration-key"
          placeholder="Registration Key"
          required
        />
      </div>
      <RouterLink to="/login">Already have an account?</RouterLink>
      <input type="submit" value="Register" />
    </form>
  </div>
</template>

<style scoped>
a {
  color: #2942499f;
}

form {
  border-radius: 16px;
  width: max(375px, 33%);
  aspect-ratio: 0.95;
  background-color: #d9d9d9;
  padding: 24px 24px 16px 24px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.6);
}

img {
  width: 96px;
  margin-top: 12px;
  margin-bottom: 12px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

h1 {
  margin-bottom: 16px;
  text-align: center;
  font-family: Montserrat;
  font-size: 20px;
  color: #294249;
}

.error-msg {
  color: red;
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
  margin-top: 32px;
}

input[type='submit']:hover {
  transform: scale(1.01);
  border: 1px solid white;
}

label {
  display: none;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group input {
  border: none;
  width: 100%;
  border-radius: 8px;
  padding: 12px 16px;
  color: black !important;
  margin-bottom: 12px;
  /* width: max(250px, 25vw); */
}

.container {
  height: 100vh;
  display: flex;
  justify-content: center;
  place-items: center;
}

label {
  color: black;
}
</style>
