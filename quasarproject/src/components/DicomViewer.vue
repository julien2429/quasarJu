<template>
  <div
    @resize="resizeCanvas"
    @click.right.prevent
    @drop.prevent="onDrop"
    @dragenter.prevent
    @dragover.prevent="handleDragOver"
    @click.middle.prevent
    ref="el"
    style="width: 100%; height: 100%"
  ></div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from "vue";
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

const splitterValue = defineModel("splitterValue");

const el = ref();

const toolGroupId = "myToolGroup";
let toolGroup;

let viewport;

let imgIds = [];
let tags = [];

let dicomTags = defineModel<Array<any>>("dicomTags");

let file = defineModel("file");
let fileAndImageID = [
  {
    file: null,
    imageId: null,
  },
];

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
  fileLoader();
});

watch(
  () => file.value,
  async () => {
    fileLoader();
  },
);

watch(
  () => splitterValue.value,
  () => {
    resizeCanvas();
  },
);

onUnmounted(() => {
  cornerstoneTools.removeTool(PanTool);
  cornerstoneTools.removeTool(WindowLevelTool);
  cornerstoneTools.removeTool(StackScrollMouseWheelTool);
  cornerstoneTools.removeTool(ZoomTool);

  toolGroup = [];
});

async function createCanvas() {
  cornerstoneTools.addTool(PanTool);
  cornerstoneTools.addTool(WindowLevelTool);
  cornerstoneTools.addTool(StackScrollMouseWheelTool);
  cornerstoneTools.addTool(ZoomTool);

  if (ToolGroupManager.getToolGroup(toolGroupId)) {
    toolGroup = ToolGroupManager.getToolGroup(toolGroupId);
  } else {
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
  toolGroup.addViewport(viewportId, renderingEngineId);

  console.log(viewport);
}

function resizeCanvas() {
  let renderingEngine = cornerstone.getRenderingEngine("myRenderingEngine");
  renderingEngine.resize(true, true);
  viewport.resize(viewport.canvas, true);
  viewport.resize(viewport.element, true);
}

async function onDrop(e) {
  e.preventDefault();
  const files = e.dataTransfer.files;
  file.value = files[0];
  loadFile(file);
}

async function loadFile(file) {
  let imageID = await cornerstoneDICOMImageLoader.wadouri.fileManager.add(file);
  imgIds.push(imageID);
  fileAndImageID.push({ file: file, imageId: imageID });
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = "copy"; // Explicitly show this is a copy.
}

async function fileLoader() {
  tags = [];
  fileAndImageID = [];
  imgIds = [];
  if (file.value[0] != null) {
    if (file.value[0] instanceof Array) {
      for (let i = 0; i < file.value[0].length; i++) {
        await loadFile(file.value[0][i]);
      }
    } else {
      await loadFile(file.value[0]);
    }
    loadAndViewImage();
  }
}

async function loadAndViewImage() {
  let stack = [];
  if (imgIds == null) return;
  await prefetchMetadataInformation(imgIds);
  stack = await convertMultiframeImageIds(imgIds);
  viewport.setStack(stack).then(() => {
    viewport.render();
  });
  viewport.element.addEventListener(
    cornerstone.EVENTS.STACK_NEW_IMAGE,
    async (e) => {
      if (e.detail.image.imageId.split("&frame").length > 1) return;
      const imageId = e.detail.image.imageId.split("&frame")[0];
      const file = fileAndImageID.find((item) => item.imageId === imageId).file;
      getTags(file);
    },
  );
}

async function getTags(file) {
  let tagItems = [];
  let arrayBuffer = await file.arrayBuffer();
  var options = {
    TransferSyntaxUID: "1.2.840.10008.1.2.2",
    vrCallback(tag) {
      const formatted = `(${tag.substring(1, 5).toUpperCase()},${tag
        .substring(5, 9)
        .toUpperCase()})`;
      return !!TAG_DICT[formatted] ? TAG_DICT[formatted].vr : "UN";
    },
  };

  let parsedArray = await dicomParser.parseDicom(
    new Uint8Array(arrayBuffer),
    options,
  );
  let dataset = await dicomParser.explicitDataSetToJS(parsedArray);
  addElementToTagsArray(tagItems, dataset, 0, true, null);
  dicomTags.value = tagItems;
}

function addElementToTagsArray(tagItems, dataset, spaces, showable, parent) {
  for (let key of Object.keys(dataset)) {
    const tag =
      "(" +
      key.substring(1, 5).toUpperCase() +
      "," +
      key.substring(5, 9).toUpperCase() +
      ")";
    if (TAG_DICT[tag]) {
      let row = {
        tagName:
          "_".repeat(spaces) +
          TAG_DICT[tag].tag +
          (dataset[key] instanceof Array && dataset[key].length > 0
            ? " >"
            : ""),
        tag: TAG_DICT[tag].tag,
        vr: TAG_DICT[tag].vr,
        vm: TAG_DICT[tag].vm,
        showable: showable,
        showChildren: false,
        parent: parent,
        description: TAG_DICT[tag].name,
        value: dataset[key] instanceof Array ? [] : dataset[key],
      };
      tagItems.push(row);
      if (dataset[key] instanceof Array) {
        for (let i = 0; i < dataset[key].length; i++) {
          addElementToTagsArray(
            tagItems,
            dataset[key][i],
            spaces + 4,
            false,
            tag,
          );
        }
      }
    }
  }
}
</script>
