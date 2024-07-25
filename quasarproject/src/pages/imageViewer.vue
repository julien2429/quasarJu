<template>
  <q-page :style-fn="setQPagetoFull">
    <q-splitter v-model="splitterModel" style="height: 100%">
      <template v-slot:before>
        <q-splitter horizontal v-model="leftSpliterModel" style="height: 100%">
          <template v-slot:before>
            <div class="full-width full-height">
              <q-table-with-search
                dense
                title="Tag Data"
                :rows="filteredTags"
                :excludedColumns="excludedColumns"
                @row-click="
                  (evt, row, index) => {
                    row.showChildren = !row.showChildren;
                    changeShowableState(row.tag, row.showChildren);
                  }
                "
              >
              </q-table-with-search>
            </div>
          </template>
          <template v-slot:after>
            <div class="full-width full-height">
              <q-file
                @update:model-value="
                  (val) => {
                    files = val;
                  }
                "
                webkitdirectory
                directory
                label="Pick files"
                outlined
                multiple
              ></q-file>
              <q-input
                @update:model-value="
                  (val) => {
                    files = val;
                  }
                "
                type="file"
                id="ctrl"
                webkitdirectory
                directory
                multiple
              />

              <q-tree
                v-model:ticked="ticked"
                :nodes="tree"
                tickStrategy="strict"
                dense
                node-key="label"
              ></q-tree>
            </div>
          </template>
        </q-splitter>
      </template>

      <template v-slot:after>
        <div v-if="show" class="full-width full-height">
          <dicom-viewer
            v-model:toolGroup="toolGroup"
            v-model:dicomTags="dicomTags"
            v-model:first-render="firstRender"
            v-model:file="passedFile"
          ></dicom-viewer>
        </div>
      </template>
    </q-splitter>
  </q-page>
</template>

<script setup>
import QTableWithSearch from "src/components/QTableWithSearch.vue";
import DicomViewer from "../components/DicomViewer.vue";
import { computed, ref, watch } from "vue";

//// Variables
let ticked = ref([]);
let files = ref([]);
let dicomTags = ref([]);
let tableTags = ref([]);
let toolGroup = ref([]);
let excludedColumns = ref(["tag", "showable", "showChildren", "parent"]);
const filteredTags = computed(() => {
  return dicomTags.value.filter((tag) => tag.showable);
});

const firstRender = ref(true);
const show = ref(true);
const passedFile = ref(null);
const splitterModel = ref(50);
const leftSpliterModel = ref(80);
const forceRender = () => {
  show.value = !show.value;

  firstRender.value = false;
  setTimeout(() => {
    show.value = !show.value;
  }, 5);
};

let tree = ref([]);

//// Watchers
watch(
  () => splitterModel.value,
  () => {
    forceRender();
  }
);

watch(
  () => dicomTags.value,
  () => {
    console.log("dicomTags", dicomTags.value);
    tableTags.value = [...dicomTags.value];
  }
);

watch(
  () => files.value,
  () => {
    fileToTree();
  }
);

//// Methods

function handleFileUpload(file) {
  console.log("file", file);
  passedFile.value = file;
}

function setQPagetoFull(offset) {
  return { height: offset ? `calc(100vh - ${offset}px)` : "100vh" };
}

function changeShowableState(tag, showChildren) {
  if (showChildren) {
    for (let key in dicomTags.value) {
      if (dicomTags.value[key].parent === tag) {
        dicomTags.value[key].showable = true;
      }
    }
  } else {
    for (let key in dicomTags.value) {
      if (dicomTags.value[key].parent === tag) {
        dicomTags.value[key].showable = false;
        if (dicomTags.value[key].showChildren)
          changeShowableState(dicomTags.value[key].tag, false);
      }
    }
  }
}

function fileToTree() {
  const treeAux = [];

  const list = [];

  console.log("files", files.value);

  for (let i = 0; i < files.value.length; i++) {
    list.push(files.value[i].webkitRelativePath);
  }

  const addPath = (path, treeAux) => {
    // helper function to create child objects
    const createChild = (name) => ({
      label: name,
      children: [],
    });

    // split path to array of folders and files
    const parts = path.split("/");

    // create treeAux if empty
    if (!treeAux.label) {
      Object.assign(treeAux, createChild(parts[0]));
    }

    // check if root folder is correct
    if (treeAux.label !== parts[0]) {
      throw new Error(`Root folder is not "${treeAux.label}"`);
    }
    parts.shift();

    // check and add other path parts
    parts.reduce((current, p) => {
      const child = current.children.find((child) => child.label === p);
      if (child) {
        return child;
      }

      const newChild = createChild(p);
      current.children.push(newChild);
      return newChild;
    }, treeAux);
  };

  list.forEach((path) => addPath(path, treeAux));

  console.log(treeAux);
  tree.value = [treeAux];
}
</script>
