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

const el = ref();
let viewport;
const toolGroupId = "myToolGroup";
let toolGroup;
let imgIds = [];
let tags = [];
let isFolder = defineModel<Boolean>("isFolder");
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
  imgIds = [];
  tags = [];
  console.log("files", file.value, isFolder.value);
  if (file.value != null) {
    if (isFolder.value) {
      for (let key of Object.keys(file.value[0])) {
        loadFile(file.value[0][key]);
      }
    } else {
      loadFile(file.value[0]);
    }

    loadAndViewImage();
  }
});

watch(
  () => file.value,
  async () => {
    imgIds = [];
    tags = [];
    console.log("files", file.value, isFolder.value);
    if (file.value != null) {
      if (isFolder.value) {
        for (let key of Object.keys(file.value[0])) {
          loadFile(file.value[0][key]);
        }
      } else {
        loadFile(file.value[0]);
      }

      loadAndViewImage();
    }
  }
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
}

async function onDrop(e) {
  e.preventDefault();
  const files = e.dataTransfer.files;
  file.value = files[0];
  loadFile(file);
}

async function loadFile(file) {
  const imageId = await cornerstoneDICOMImageLoader.wadouri.fileManager.add(file);
  fileAndImageID.push({ file: file, imageId: imageId });
  imgIds.push(imageId);
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = "copy"; // Explicitly show this is a copy.
}

async function loadAndViewImage() {
  await prefetchMetadataInformation(imgIds);

  console.log("imgIds", imgIds);
  const stack = convertMultiframeImageIds(imgIds);

  viewport.setStack(stack).then((img) => {
    viewport.render();
  });

  viewport.element.addEventListener(cornerstone.EVENTS.STACK_NEW_IMAGE, async (e) => {
    const imageId = e.detail.image.imageId;
    const file = fileAndImageID.find((item) => item.imageId === imageId).file;
    await getTags(file);
    // dicomTags.value = tags;
  });
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

  let parsedArray = await dicomParser.parseDicom(new Uint8Array(arrayBuffer), options);
  console.log(parsedArray);

  let dataset = await dicomParser.explicitDataSetToJS(parsedArray);
  console.log("dataset", dataset);
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
          (dataset[key] instanceof Array && dataset[key].length > 0 ? " >" : ""),
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
          addElementToTagsArray(tagItems, dataset[key][i], spaces + 4, false, tag);
        }
      }
    }
  }
}
</script>
