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
                :is-editable="isEditable"
                :editable-rows="['value']"
                :rows="filteredTags"
                :excludedColumns="excludedColumns"
                @on-row-click="
                  (row) => {
                    row.showChildren = !row.showChildren;
                    row.tagName = changeArrow(row.tagName);
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
                type="file"
                id="ctrl"
                webkitdirectory
                directory
                multiple
              />

              <q-tree
                ref="treeRef"
                @update:selected="
                  async (val) => {
                    searchForKey(val);
                  }
                "
                v-model:selected="selected"
                :nodes="tree"
                dense
                node-key="nodeKey"
                label-key="label"
              ></q-tree>
            </div>
          </template>
        </q-splitter>
      </template>

      <template v-slot:after>
        <dicom-viewer
          v-model:splitterValue="splitterModel"
          v-model:toolGroup="toolGroup"
          v-model:dicomTags="dicomTags"
          v-model:file="passedFile"
        ></dicom-viewer>
      </template>
    </q-splitter>
  </q-page>
</template>

<script setup>
import QTableWithSearch from "src/components/QTableWithSearch.vue";
import DicomViewer from "../components/DicomViewer.vue";
import { computed, ref, watch } from "vue";

//// Variables
let isEditable = ref(true);
let treeRef = ref();
let selected = ref([]);
let files = ref([]);
let dicomTags = ref([]);
let tableTags = ref([]);
let toolGroup = ref([]);
let tree = ref([]);
const passedFile = ref({});
const splitterModel = ref(50);
const leftSpliterModel = ref(50);
let excludedColumns = ref(["tag", "showable", "showChildren", "parent"]);

const filteredTags = computed(() => {
  return dicomTags.value.filter((tag) => tag.showable);
});

//// Watchers

watch(
  () => dicomTags.value,
  () => {
    tableTags.value = [...dicomTags.value];
  },
);

watch(
  () => files.value,
  () => {
    fileToTree();
  },
);

//// Methods

function searchForKey(key, root = tree.value) {
  for (let rootKey in root) {
    if (root[rootKey].nodeKey === key) {
      handleSelectedBranch(root[rootKey]);
      return root[rootKey];
    }
    if (root[rootKey].children.length > 0) {
      searchForKey(key, root[rootKey].children);
    }
  }
}

function handleSelectedBranch(branch) {
  if (branch.label.includes(".dcm")) {
    handleFileUpload(branch.item);
  } else {
    let items = [];
    for (let i = 0; i < branch.children.length; i++) {
      if (branch.children[i].label.includes(".dcm")) {
        items.push(branch.children[i].item);
      }
    }
    handleFileUpload(items);
  }
}

function handleFileUpload(file) {
  console.log("file", file);
  passedFile.value = [];
  passedFile.value.push(file);
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

        if (dicomTags.value[key].showChildren) {
          changeShowableState(dicomTags.value[key].tag, false);
          dicomTags.value[key].showChildren = false;
          dicomTags.value[key].tagName = changeArrow(
            dicomTags.value[key].tagName,
          );
        }
      }
    }
  }
}

function changeArrow(tagName) {
  if (tagName.includes(">")) {
    console.log("tagName", tagName);
    return tagName.replace(">", "v");
  } else {
    return tagName.replace("v", ">");
  }
}

function fileToTree() {
  const treeAux = [];

  const list = [];
  let uudi = 0;
  console.log("files", files.value);

  for (let i = 0; i < files.value.length; i++) {
    list.push(files.value[i]);
  }

  const addPath = (file, treeAux) => {
    let path = file.webkitRelativePath;
    // helper function to create child objects
    const createChild = (name, item = null) => ({
      nodeKey: uudi++,
      label: name,
      item: item,
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

      let newChild;
      if (p.includes(".dcm")) newChild = createChild(p, file);
      else newChild = createChild(p);

      current.children.push(newChild);
      return newChild;
    }, treeAux);
  };

  list.forEach((file) => addPath(file, treeAux));

  console.log(treeAux);
  tree.value = [treeAux];
}
</script>
