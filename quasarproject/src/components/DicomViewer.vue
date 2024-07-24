<template>
  <div
    @click.right.prevent
    @drop.prevent="onDrop"
    @dragenter.prevent
    @dragover.prevent="handleDragOver"
    @click.middle.prevent
    ref="el"
    class="full-height full-width"
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
import dicomParser from "dicom-parser";
import { TAG_DICT } from "src/utils/dataDictionary";

const el = ref();
let viewport;
const toolGroupId = "myToolGroup";
let toolGroup;

let dicomTags = defineModel<Array<any>>("dicomTags");
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
    loadFile(file.value);
  }
});

watch(
  () => file.value,
  async () => {
    if (file.value != null) {
      loadFile(file.value);
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
  // if (firstRender.value) {
  toolGroup.addViewport(viewportId, renderingEngineId);
  // }
}

async function onDrop(e) {
  e.preventDefault();
  const files = e.dataTransfer.files;
  file.value = files[0];
  loadFile(file);
}

async function loadFile(file) {
  getTags(file);
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
    viewport.render();
  });
}

async function getTags(file) {
  dicomTags.value = [];
  let arrayBuffer = await file.arrayBuffer();
  var options = {
    vrCallback(tag) {
      const formatted = `(${tag.substring(1, 5).toUpperCase()},${tag
        .substring(5, 9)
        .toUpperCase()})`;
      return !!TAG_DICT[formatted] ? TAG_DICT[formatted].vr : undefined;
    },
  };
  let parsedArray = await dicomParser.parseDicom(new Uint8Array(arrayBuffer), options);
  console.log(parsedArray);

  let dataset = await dicomParser.explicitDataSetToJS(parsedArray);
  console.log("dataset", dataset);
  addElementToTagsArray(dataset, 0, true, null);

  console.log("dicomTags", dicomTags.value);
}

function addElementToTagsArray(dataset, spaces, showable, parent) {
  console.log("dataset", dataset);

  for (let key of Object.keys(dataset)) {
    const tag =
      "(" +
      key.substring(1, 5).toUpperCase() +
      "," +
      key.substring(5, 9).toUpperCase() +
      ")";
    if (TAG_DICT[tag]) {
      let row = {
        tag: tag,
        epxanded: dataset[key] instanceof Array && dataset[key].length > 0 ? true : false,
        vr: TAG_DICT[tag].vr,
        vm: TAG_DICT[tag].vm,
        showable: showable,
        parent: parent,
        description: TAG_DICT[tag].name,
        value: dataset[key] instanceof Array ? [] : dataset[key],
      };
      dicomTags.value.push(row);
      if (dataset[key] instanceof Array) {
        for (let i = 0; i < dataset[key].length; i++) {
          addElementToTagsArray(dataset[key][i], spaces + 4, false, tag);
        }
      }

      console.log("_".repeat(spaces), TAG_DICT[tag].name, dataset[key]);
    }
  }
}
</script>
