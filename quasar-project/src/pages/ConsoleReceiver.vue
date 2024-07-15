<template>

  <q-layout view="lHh Lpr lFf">
    <!-- <div class="q-pa-md q-gutter-sm"> -->
      <div style="height: 100vh">
        <ConsoleCard />
      </div>
  
    <!-- </div> -->
  </q-layout>

</template>
<script setup>
import ConsoleCard from '../components/ConsoleCard.vue'
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