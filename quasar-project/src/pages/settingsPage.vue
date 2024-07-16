<!--
Forked from:
https://quasar.dev/vue-components/dialog#example--sizing-examples
-->
<template>
  <div id="q-app" style="min-height: 100vh">
    <div class="q-pa-md q-gutter-sm">

      <q-btn label="Medium" color="primary" @click="medium = true"></q-btn>




      <q-dialog v-model="medium">
        <q-card style="width: 900px; max-width: 80vw">
          <q-card-section style="display: flex; justify-content: space-between">
            <div class="text-h6">Medium</div>
            <q-btn
              flat
              style="margin-right: 0"
              :icon="symSharpOpenInNew"
              
              @click="openTab"
            />

            <!-- <a
              @click="openTab"
              :href="link"
              >open popup</a
            > -->
            <!-- <div @click="openTab">open</div>  -->

          </q-card-section>

          <div style="height: 600px; width: 100%">
            <ConsoleCard v-model:passedMessages = "messages" />
          </div>
        </q-card>
      </q-dialog>
  </div>
  </div>
</template>

<script setup>
import { symSharpOpenInNew } from "@quasar/extras/material-symbols-sharp";
import { ref } from "vue";
import ConsoleCard from "src/components/ConsoleCard.vue";
import { route } from "quasar/wrappers";
import { useRouter } from 'vue-router'
let { resolve } = useRouter ()
let { href } = resolve ({ name: 'console' })

let link = "javascript:window.open('"+href+ "','mypopuptitle','width=1280px,height=720px')";
const medium = ref(false);
const messages = ref([])

function openTab() {
  localStorage.setItem('console', JSON.stringify(messages.value))
  console.log(href)
  window.open(href,'mypopuptitle','width=1280px,height=720px');
  this.medium = false;
}
</script>
