<template>
  <q-layout view="lHh Lpr lFf">
      <div style="height: 100vh">
        <ConsoleCard v-model:messages="messages"  />
      </div>
  </q-layout>
</template>

<script setup>
import { onBeforeMount } from 'vue';
import { ref } from 'vue';
import ConsoleCard from '../components/ConsoleCard.vue'


const messages = ref([]);



onBeforeMount( () => {
   messages.value =  (localStorage.getItem('console') ? JSON.parse(localStorage.getItem('console')) : []);
  if (messages.value) localStorage.removeItem('console');
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