<template>
  <div class="q-pa-md example-column-all-breakpoints">
  <q-card class="column" style="height: 800px">
      <div class="col-3">
        header
       
      </div>
      <q-scroll-area class="col-auto">
        <hr/>
        {{ filltext }}
      </q-scroll-area>
      <div class="col-">
        <hr/>
        boom
      </div>
  </q-card>
</div>
</template>
<script setup>
import { computed } from 'vue';


const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
const filltext = computed(() => {
  let text = loremIpsum;
  for (let i = 0; i < 100; i++) {
    text += ' ' + loremIpsum;
  }
  return text;
})
</script>

<style scoped>
/* .parent{
  display: flex;
  flex-direction: column;
  height: 100%;
} */

</style>