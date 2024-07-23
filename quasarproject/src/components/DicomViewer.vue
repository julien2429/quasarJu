<template>
  <div
    @click.right.prevent
    @drop.prevent="onDrop"
    @dragenter.prevent
    @dragover.prevent="handleDragOver"
    @click.middle.prevent
    ref="el"
    class="full-height"
  ></div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import * as cornerstone from "@cornerstonejs/core";
import * as cornerstoneTools from "@cornerstonejs/tools";
import cornerstoneDICOMImageLoader from "@cornerstonejs/dicom-image-loader";
import { onMounted } from "vue";
import {
  convertMultiframeImageIds,
  prefetchMetadataInformation,
} from "../utils/convertMultiframeImageIds";
import initDemo from "src/utils/initDemo";
import dicomParser, { ByteStream } from "dicom-parser";
import { TAG_DICT } from "src/utils/dataDictionary";
let viewport;
const toolGroupId = "myToolGroup";
let toolGroup;

let file = defineModel("file");
const firstRender = defineModel("firstRender");
const {
  PanTool,
  WindowLevelTool,
  StackScrollMouseWheelTool,
  ZoomTool,
  ToolGroupManager,
  Enums: csToolsEnums,
} = cornerstoneTools;
const { MouseBindings } = csToolsEnums;

onMounted(async () => {
  await initDemo();
  createCanvas();

  if (file.value) {
    const imageId = await cornerstoneDICOMImageLoader.wadouri.fileManager.add(file.value);
    loadAndViewImage(imageId);
  }
});

watch(
  () => file.value,
  async () => {
    if (file.value != null) {
      console.log("file", file.value);
      const imageId = await cornerstoneDICOMImageLoader.wadouri.fileManager.add(
        file.value
      );

      loadAndViewImage(imageId);
    }
  }
);

async function createCanvas() {
  if (firstRender.value) {
    cornerstoneTools.addTool(PanTool);
    cornerstoneTools.addTool(WindowLevelTool);
    cornerstoneTools.addTool(StackScrollMouseWheelTool);
    cornerstoneTools.addTool(ZoomTool);

    toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
    toolGroup.addTool(WindowLevelTool.toolName);
    toolGroup.addTool(PanTool.toolName);
    toolGroup.addTool(ZoomTool.toolName);
    toolGroup.addTool(StackScrollMouseWheelTool.toolName);
    toolGroup.setToolActive(WindowLevelTool.toolName, {
      bindings: [
        {
          mouseButton: MouseBindings.Primary, // Left Click
        },
      ],
    });
    toolGroup.setToolActive(PanTool.toolName, {
      bindings: [
        {
          mouseButton: MouseBindings.Auxiliary, // Middle Click
        },
      ],
    });
    toolGroup.setToolActive(ZoomTool.toolName, {
      bindings: [
        {
          mouseButton: MouseBindings.Secondary, // Right Click
        },
      ],
    });
    toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
  }
  const renderingEngineId = "myRenderingEngine";
  const renderingEngine = new cornerstone.RenderingEngine(renderingEngineId);

  const element = el.value;

  const viewportId = "CT_STACK";
  const viewportInput = {
    viewportId: viewportId,
    element: element,
    type: cornerstone.Enums.ViewportType.STACK,
  };

  renderingEngine.enableElement(viewportInput);
  viewport = renderingEngine.getViewport(viewportId);
  if (firstRender.value) {
    toolGroup.addViewport(viewportId, renderingEngineId);
  }
}
async function onDrop(e) {
  e.preventDefault();
  const files = e.dataTransfer.files;
  const file = files[0];

  let arrayBuffer = await file.arrayBuffer();

  let parsedArray = await dicomParser.parseDicom(new Uint8Array(arrayBuffer));

  console.log("arrayBuffer", arrayBuffer);
  console.log("parsedArray", parsedArray);

  let dataset = dicomParser.explicitDataSetToJS(parsedArray);

  for (let key in dataset) {
    const tag = "(" + key.substring(1, 5) + "," + key.substring(5, 9) + ")";
    console.log(tag, key);
    if (TAG_DICT[tag]) {
      console.log(TAG_DICT[tag].name, dataset[key]);
    }
  }
  console.log("dataset", dataset);

  const imageId = await cornerstoneDICOMImageLoader.wadouri.fileManager.add(file);

  loadAndViewImage(imageId);
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = "copy"; // Explicitly show this is a copy.
}

async function loadAndViewImage(imageId) {
  await prefetchMetadataInformation([imageId]);
  const stack = convertMultiframeImageIds([imageId]);

  viewport.setStack(stack).then((img) => {
    const meta = cornerstone.metaData.get("instance", img);
    console.log("meta", meta);
    viewport.render();
  });
}
const el = ref();
</script>
