<template>
  <div
    @drop.prevent="onDrop"
    @dragenter.prevent
    @dragover.prevent="handleDragOver"
    style="height: 500px; width: 500px"
    ref="el"
    class="viewer"
  ></div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import * as cornerstone from "@cornerstonejs/core";
import * as cornerstoneTools from "@cornerstonejs/tools";
import cornerstoneDICOMImageLoader from "@cornerstonejs/dicom-image-loader";
import { onMounted } from "vue";
import {
  convertMultiframeImageIds,
  prefetchMetadataInformation,
} from "../utils/convertMultiframeImageIds";
import initDemo from "src/utils/initDemo";

const {
  PanTool,
  WindowLevelTool,
  StackScrollMouseWheelTool,
  ZoomTool,
  ToolGroupManager,
  Enums: csToolsEnums,
} = cornerstoneTools;
const { MouseBindings } = csToolsEnums;

let viewport;
const toolGroupId = "myToolGroup";
onMounted(async () => {
  await initDemo();

  cornerstoneTools.addTool(PanTool);
  cornerstoneTools.addTool(WindowLevelTool);
  cornerstoneTools.addTool(StackScrollMouseWheelTool);
  cornerstoneTools.addTool(ZoomTool);

  // Define a tool group, which defines how mouse events map to tool commands for
  // Any viewport using the group
  const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

  // Add tools to the tool group
  toolGroup.addTool(WindowLevelTool.toolName);
  toolGroup.addTool(PanTool.toolName);
  toolGroup.addTool(ZoomTool.toolName);
  toolGroup.addTool(StackScrollMouseWheelTool.toolName);

  // Set the initial state of the tools, here all tools are active and bound to
  // Different mouse inputs
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
  // As the Stack Scroll mouse wheel is a tool using the `mouseWheelCallback`
  // hook instead of mouse buttons, it does not need to assign any mouse button.
  toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
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
});

async function onDrop(e) {
  e.preventDefault();
  const files = e.dataTransfer.files;
  const file = files[0];
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

  viewport.setStack(stack).then(() => {
    viewport.render();
  });
}

const el = ref();
</script>
