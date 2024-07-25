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
    console.log("files", files.value);
  }
);

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

watch(
  () => splitterModel.value,
  () => {
    forceRender();
  }
);
</script>
