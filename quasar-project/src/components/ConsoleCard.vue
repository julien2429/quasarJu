<template>
  <div class="container">
    <q-scroll-area
      ref="scrollArea"
      class="console"
      @scroll="scrollEvent"
      :thumb-style
      :bar-style="barStyle"
    >
      <div
        :style="line.style"
        v-for="(line, index) in textLines"
        :key="index"
        class="console_line"
      >
        {{ line.text }}
      </div>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-fab icon="add" direction="up" color="red">
          <div v-if="downButtonVisible">
            <q-btn
              @click="downButtonVisible = !downButtonVisible"
              fab
              icon="keyboard_arrow_down"
              color="red"
            ></q-btn>
          </div>
          <div v-else>
            <q-btn
              @click="downButtonVisible = !downButtonVisible"
              fab
              icon="pause"
              color="red"
            ></q-btn>
          </div>
          <q-btn @click="clearData" fab icon="delete" color="red"></q-btn>
        </q-fab>
      </q-page-sticky>
    </q-scroll-area>
    <div
      style="
        border-color: aliceblue;
        display: flex;
        background: #1b1b1b;
        font-weight: bolder;
        color: #f8f8f8;
      "
      class="bottomBar"
    >
      <q-input
        style="padding-block: 4px"
        dark
        dense
        standout
        v-model="filters.searchFilter"
        input-class="text-right"
        class="q-ml-md"
      >
        <template v-slot:append>
          <q-icon v-if="filters.searchFilter === ''" name="search"></q-icon>
          <q-icon
            v-else
            name="clear"
            class="cursor-pointer"
            @click="filters.searchFilter = ''"
          ></q-icon>
        </template>
      </q-input>
      <q-checkbox
        dark
        standout
        v-model="filters.ok"
        label="OK"
        color="red"
      ></q-checkbox>
      <q-checkbox
        dark
        v-model="filters.warning"
        label="Warning"
        color="red"
      ></q-checkbox>
      <q-checkbox
        dark
        v-model="filters.error"
        label="Error"
        color="red"
      ></q-checkbox>
      <q-checkbox dark v-model="filters.info" label="Info" color="red">
      </q-checkbox>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, reactive, ref, watch } from "vue";

//// DATA RELATED VARIABLES
let messages = defineModel("messages");
let scrollArea = ref(null);
let downButtonVisible = false;
let textLines = ref([]);
///////////////////////////


//// FILTER RELATED VARIABLES
let filters = reactive({
  error: true,
  warning: true,
  info: true,
  ok: true,
  searchFilter: "",
});
//////////////////////////


//// CSS RELATED VARIABLES
let statusDict = {
  error: "color: red",
  warning: "color: orange",
  info: "color: cyan",
  ok: "color: green",
};

let thumbStyle = {
  right: "4px",
  borderRadius: "5px",
  backgroundColor: "#EA402F",
  width: "5px",
  opacity: 0.75,
};

let barStyle = {
  right: "2px",
  borderRadius: "9px",
  backgroundColor: "#1B1B1B",
  width: "9px",
  opacity: 0.2,
};
/////////////////////////////


onBeforeMount(() => {
  refreshData();///need to refresh data on mount

  //// WEBSOCKET RELATED CODE
  let socket = new WebSocket("ws://192.168.0.240:7890/EchoAll");
  socket.onmessage = (event) => {
    console.log(event.data);
    let dataParsed = JSON.parse(event.data);
    parseMessage(dataParsed);
    messages.value.push(dataParsed);
  };
  //////////////////////////
});

function refreshData() {
  messages.value.forEach((message) => {
    parseMessage(message);
  });
}

//// SETS SCROLL TO BOTTOM OF THE CONSOLE
function scrollEvent(info) {
  if (downButtonVisible) {
  } else {
    info.ref.setScrollPercentage("vertical", 1);
  }
}
//////////////////////////////


//// CLEAR DATA FUNCTION
function clearData() {
  textLines.value = [];
  messages.value = [];
}
//////////////////////////////


//// FILTER THE MESSAGES
function parseMessage(message) {
  if (
    ((filters.error && message.status === "error") ||
      (filters.warning && message.status === "warning") ||
      (filters.info && message.status === "info") ||
      (filters.ok && message.status === "ok")) &&
    (filters.searchFilter === "" ||
      message.Id.toString().includes(filters.searchFilter) ||
      message.status.includes(filters.searchFilter))
  ) {
    let line = {
      text: message.Id + " " + message.status,
      style: statusDict[message.status],
    };
    textLines.value.push(line);
  }
}
//////////////////////////////

//// WATCHES THE FILTERS
watch(
  () => filters,
  (filters) => {
    textLines.value = [];
    messages.value.forEach((message) => {
      parseMessage(message);
    });

    if (!downButtonVisible) {
      $refs.scrollArea.setScrollPercentage("vertical", 1);
    }
  },
);
//////////////////////////////
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: inherit;
  width: inherit;
}
.console {
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  color: white;
  height: 100%;
  background-color: rgb(0, 0, 0);
  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto;
}

.console_line {
  color: white;
  margin: 5px;
}

.error {
  color: red;
}

.warning {
  color: orange;
}

.info {
  color: cyan;
}

.ok {
  color: green;
}
.bottomBar {
  width: 100%;
}

</style>
