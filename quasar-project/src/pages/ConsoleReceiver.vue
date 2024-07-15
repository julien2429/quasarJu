<template>
  <q-page>
    <section>
      <q-scroll-area class="console" @scroll="scrollEvent" :bar-style="barStyle">
        <div
          :style="line.style"
          v-for="(line, index) in textLines"
          :key="index"
          class="console_line"
        >
          {{ line.text }}
        </div>
      </q-scroll-area>

      <q-checkbox
        v-model="filters.error"
        label="error"
        color="red"
      ></q-checkbox>
      <q-checkbox
        v-model="filters.warning"
        label="warning"
        color="orange"
      ></q-checkbox>
      <q-checkbox v-model="filters.ok" label="ok" color="green"></q-checkbox>
      <q-checkbox v-model="filters.info" label="info(info)" color="cyan"></q-checkbox>
    </section>
  </q-page>
</template>

<script>
import { reactive, ref } from "vue";
export default {
  data() {
    return {
      barStyle: {
        backgroundColor: "#3277D5",
        opacity: "0.5",
      },
      messages: ref([]),
      filters: reactive({
        error: true,
        warning: true,
        info: true,
        ok: true,
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
 
  beforeMount() {
    this.socket = new WebSocket("ws://127.0.0.1:7890/EchoAll");
    this.socket.onmessage = (event) => {
      console.log(event.data);
      const dataParsed = JSON.parse(event.data);
      this.parseMessage(dataParsed);
      
      this.messages.push(dataParsed);
    };
  },
  methods: {
    scrollEvent(info) {
      console.log(info.verticalPercentage);
      if(info.verticalPercentage > 0.9) {
        info.ref.setScrollPercentage("vertical",1);
      }
    },
    parseMessage(message) {
      if (
        (this.filters.error && message.status === "error") ||
        (this.filters.warning && message.status === "warning") ||
        (this.filters.info && message.status === "info") ||
        (this.filters.ok && message.status === "ok")
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
      },

      deep: true,
    },
  },
};
</script>

<style scoped>
.console {
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;

  height: 30vw;
  background-color: rgb(0, 0, 0);
  display: flex;
  flex-direction: column-reverse;
  /* flex-direction: column; */
  overflow-y: auto;
  color: white;
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
</style>
