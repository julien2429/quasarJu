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

<script>
import { reactive, ref } from "vue";
export default {
  props: ['passedMessages'],
  data() {
    return {
      goDown: true,
      start: false,
      scrollArea: ref(null),
      downButtonVisible: false,
      thumbStyle: {
        right: "4px",
        borderRadius: "5px",
        backgroundColor: "#EA402F",
        width: "5px",
        opacity: 0.75,
      },

      barStyle: {
        right: "2px",
        borderRadius: "9px",
        backgroundColor: "#1B1B1B",
        width: "9px",
        opacity: 0.2,
      },

      messages: ref([]),
      filters: reactive({
        error: true,
        warning: true,
        info: true,
        ok: true,
        searchFilter: "",
      }),
      savedMessages: [],
      textLines: ref([]),
      socket: null,
      textArea: "",
      statusDict: {
        error: "color: red",
        warning: "color: orange",
        info: "color: cyan",
        ok: "color: green",
      },
    };
  },
  mounted() {
    this.messages = this.passedMessages;
    this.refreshData()
  },
  created() {
    this.socket = new WebSocket("ws://127.0.0.1:7890/EchoAll");
    this.socket.onmessage = (event) => {
      console.log(event.data);
      const dataParsed = JSON.parse(event.data);
      this.parseMessage(dataParsed);

      this.messages.push(dataParsed);
    };
    
  },

  methods: {
    refreshData() {
      this.textArea = "";
      this.textLines = [];
      this.messages.forEach((message) => {
        this.parseMessage(message);
      });
    },
    scrollEvent(info) {
      if (this.downButtonVisible) {
      } else {
        info.ref.setScrollPercentage("vertical", 1);
      }
    },
    clearData() {
      this.textArea = "";
      this.textLines = [];
      this.messages = [];
    },
    parseMessage(message) {
      if (
        ((this.filters.error && message.status === "error") ||
          (this.filters.warning && message.status === "warning") ||
          (this.filters.info && message.status === "info") ||
          (this.filters.ok && message.status === "ok")) &&
        (this.filters.searchFilter === "" ||
          message.Id.toString().includes(this.filters.searchFilter) ||
          message.status.includes(this.filters.searchFilter))
      ) {
        const line = {
          text: message.Id + " " + message.status,
          style: this.statusDict[message.status],
        };
        this.textLines.push(line);
      }
    },
  },
  watch: {
    filters: {
      handler() {
        this.textArea = "";
        this.textLines = [];
        this.messages.forEach((message) => {
          this.parseMessage(message);
        });

        if (!this.downButtonVisible) {
          this.$refs.scrollArea.setScrollPercentage("vertical", 1);
        }
      },

      deep: true,
    },
  },
};
</script>

<style scoped>
.container
{
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
