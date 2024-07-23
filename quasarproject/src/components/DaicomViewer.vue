<template>
  <div
    @drop.prevent="onDrop"
    @dragenter.prevent
    @dragover.prevent="handleDragOver"
    style="width: 200px; height: 200px; background-color: black; z-index: 100"
  ></div>
  <div style="height: 500px; width: 500px" ref="el" class="viewer"></div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import * as cornerstone from "@cornerstonejs/core";
import * as cornerstoneTools from "@cornerstonejs/tools";
import dicomParser from "dicom-parser";
import cornerstoneDICOMImageLoader from "@cornerstonejs/dicom-image-loader";
import { onMounted } from "vue";
import {
  convertMultiframeImageIds,
  prefetchMetadataInformation,
} from "../utils/convertMultiframeImageIds";

import initCornerstoneDICOMImageLoader from "src/utils/initCornerstoneDICOMImageLoader";

let viewport;
onMounted(async () => {
  await cornerstone.init();
  await cornerstoneTools.init();

  initCornerstoneDICOMImageLoader();

  cornerstone.imageLoader.registerImageLoader(
    "http",
    cornerstoneDICOMImageLoader.loadImage
  );
  cornerstone.imageLoader.registerImageLoader(
    "https",
    cornerstoneDICOMImageLoader.loadImage
  );
  cornerstone.imageLoader.registerImageLoader(
    "wadouri",
    cornerstoneDICOMImageLoader.loadImage
  );
  cornerstone.imageLoader.registerImageLoader(
    "data",
    cornerstoneDICOMImageLoader.loadImage
  );

  const renderingEngineId = "myRenderingEngine";
  const renderingEngine = new cornerstone.RenderingEngine(renderingEngineId);

  const element = el.value;

  const viewportId = "CT_STACK";

  const viewportInput = {
    viewportId,
    element,
    type: cornerstone.Enums.ViewportType.STACK,
  };

  renderingEngine.enableElement(viewportInput);

  viewport = renderingEngine.getViewport(viewportId);
});

async function onDrop(e) {
  e.preventDefault();
  const files = e.dataTransfer.files;
  const file = files[0];
  console.log(file);

  const url = "http://localhost:9000/static/resources/" + file.name;
  console.log(url);
  const imageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(url);
  console.log(imageId);
  loadAndViewImage(imageId);
}
function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = "copy"; // Explicitly show this is a copy.
}

async function loadAndViewImage(imageId) {
  await prefetchMetadataInformation(imageId);
  const stack = convertMultiframeImageIds(imageId);

  viewport.setStack(stack).then(() => {
    viewport.render();
  });
}

const el = ref();
</script>
