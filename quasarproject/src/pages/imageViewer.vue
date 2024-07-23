<template>
  <q-page :style-fn="setQPagetoFull">
    <daicom-viewer-2 v-model:images="exampleStudyImageIds"></daicom-viewer-2>
  </q-page>
</template>

<script setup>
import DaicomViewer2 from "../components/DaicomViewer2.vue";
const exampleStudyImageIds = [
  "/static/resources/1.2.410.200001.1.1185.2596768464.3.20191220.1182650818.520.1.dcm",
];
</script>
