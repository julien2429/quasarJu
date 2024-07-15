<!--
Forked from:
https://quasar.dev/vue-components/dialog#example--sizing-examples
-->
<template>
  
<div id="q-app" style="min-height: 100vh;">
  <div class="q-pa-md q-gutter-sm">
      <q-btn label="Small" color="primary" @click="small = true"></q-btn>
      <q-btn label="Medium" color="primary" @click="medium = true"></q-btn>
      <q-btn label="Full Width" color="primary" @click="fullWidth = true"></q-btn>
      <q-btn label="Full Height" color="primary" @click="fullHeight = true"></q-btn>
  
      <q-dialog
        v-model="small"
      >
        <q-card style="width: 300px">
          <q-card-section>
            <div class="text-h6">Small</div>
          </q-card-section>
  
          <q-card-section class="q-pt-none">
            Click/Tap on the backdrop.
          </q-card-section>
  
          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn flat label="OK" v-close-popup></q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
  
      <q-dialog
        v-model="medium"
      >
        <q-card style="width: 600px; max-width: 80vw;">
          <q-card-section style="display: flex; justify-content: space-between;">
            <div class="text-h6">Medium</div>
            <q-btn flat style="margin-right:0 " :icon="symSharpOpenInNew" to="/console" target="_blank" @click="medium = false" />
        
          </q-card-section>
  

          <div style="height: 600px; width: 100%;">
            <ConsoleCard />
          </div>

        </q-card>
      </q-dialog>
  
      <q-dialog
        v-model="fullWidth"
        full-width
      >
        <q-card>
          <q-card-section>
            <div class="text-h6">Full Width</div>
          </q-card-section>
  
          <q-card-section class="q-pt-none">
            Click/Tap on the backdrop.
          </q-card-section>
  
          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn flat label="OK" v-close-popup></q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
  
      <q-dialog
        v-model="fullHeight"
        full-height
      >
        <q-card class="column full-height" style="width: 300px">
          <q-card-section>
            <div class="text-h6">Full Height</div>
          </q-card-section>
  
          <q-card-section class="col q-pt-none">
            Click/Tap on the backdrop.
          </q-card-section>
  
          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn flat label="OK" v-close-popup></q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
  </template>

<script setup>
import { symSharpOpenInNew } from '@quasar/extras/material-symbols-sharp'
    import { ref } from 'vue';
    import ConsoleCard from 'src/components/ConsoleCard.vue';
import { route } from 'quasar/wrappers';

    const small= ref(false);
    const medium= ref(false);
    const fullWidth= ref(false);
    const fullHeight= ref(false); 
</script>