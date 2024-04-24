<script setup lang="ts">
const props = defineProps<{ loading: boolean }>()
</script>

<template>
  <Transition name="fade">
    <div v-if="props.loading" class="spinner">
      <h1>Loading...</h1>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.7s ease;
}

.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  backdrop-filter: blur(1px);
}

.spinner {
  transition: all 0.1s;
  backdrop-filter: blur(1px);
  display: flex;
  justify-content: center;
  place-items: center;
  font-family: Montserrat;
  background-color: #54747d70;
  color: white;
  width: 100%;
  height: 100%;
  z-index: 10;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
