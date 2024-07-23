<template>
  <q-page :style-fn="setQPagetoFull">
    <q-splitter v-model="splitterModel" style="height: 100%">
      <template v-slot:before>
        <div class="full-width full-height">
          <q-input
            @update:model-value="
              (val) => {
                files = val;
              }
            "
            multiple
            filled
            type="file"
            hint="Native file (multiple)"
          ></q-input>
          <div v-for="file in files" :key="file" @click="handleFileUpload(file)">
            {{ file.name }}
          </div>
        </div>
      </template>

      <template v-slot:after>
        <div v-if="show" class="full-width full-height">
          <daicom-viewer
            v-model:first-render="firstRender"
            v-model:file="passedFile"
          ></daicom-viewer>
        </div>
      </template>
    </q-splitter>
  </q-page>
</template>

<script setup>
import { constructFileFromLocalFileData } from "get-file-object-from-local-path";
import DaicomViewer from "../components/DicomViewer.vue";
import { ref, watch } from "vue";

const selected = ref(null);
let files = ref([]);

function handleFileUpload(file) {
  console.log("file", file);
  passedFile.value = file;
}

watch(
  () => files.value,
  () => {
    console.log("files", files.value);
  }
);
const firstRender = ref(true);
const show = ref(true);
const passedFile = ref(null);
const splitterModel = ref(50); // start at 50%
const forceRender = () => {
  show.value = !show.value;

  firstRender.value = false;
  setTimeout(() => {
    show.value = !show.value;
  }, 5);
};
function setQPagetoFull(offset) {
  return { height: offset ? `calc(100vh - ${offset}px)` : "100vh" };
}

watch(
  () => splitterModel.value,
  () => {
    forceRender();
  }
);
</script>
