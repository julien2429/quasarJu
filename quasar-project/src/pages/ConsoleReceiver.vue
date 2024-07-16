<template>
  <q-layout view="lHh Lpr lFf">
      <div style="height: 100vh">
        <ConsoleCard v-model:passedMessages = "passedMessages" />
      </div>
  </q-layout>
</template>

<script setup>
import { onBeforeMount, onMounted } from 'vue';
import ConsoleCard from '../components/ConsoleCard.vue'
let passedMessages = null

onBeforeMount(() => {
  passedMessages = localStorage.getItem('console') ? JSON.parse(localStorage.getItem('console')) : []
  if (passedMessages) localStorage.removeItem('console');
  console.log(passedMessages)
  
})
</script>

<style scoped>
.fullpage {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
}
</style>