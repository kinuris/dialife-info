<script setup lang="ts">
import router from '@/router'
import { ref } from 'vue'

const email = ref()
const password = ref()

const error = ref<string>()

async function handleLogin() {
  error.value = ''

  const response = await fetch(`/dialife-api/doctor/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  })

  if (response.status !== 200) {
    error.value = 'Login failed'
    return
  }

  const result = await response.json()
  if (result.message !== 'Success') {
    error.value = result.message
    return
  }

  router.push({ path: `/` })
}
</script>

<template>
  <div class="container">
    <form v-on:submit.prevent="handleLogin" method="post">
      <img src="/src/assets/dialife_launcher_logo.png" alt="Dialife Logo" />
      <h1>LOGIN</h1>
      <div class="error-msg" v-if="error?.length">
        {{ error }}
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="email" type="email" name="email" id="email" placeholder="Email" />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          v-model="password"
          type="password"
          name="password"
          id="password"
          placeholder="Password"
        />
      </div>
      <RouterLink to="/signup">Don't have an account?</RouterLink>
      <input type="submit" value="Login" />
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
  color: black;
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
