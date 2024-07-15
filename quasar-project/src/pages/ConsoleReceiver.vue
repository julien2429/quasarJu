<template>
  <q-page>
    <section>
      <q-scroll-area ref="scrollArea"  class="console" @scroll="scrollEvent" :thumb-style :bar-style="barStyle">
        <div
          :style="line.style"
          v-for="(line, index) in textLines"
          :key="index"
          class="console_line"
        >
          {{ line.text }}
        </div>
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <div v-if="downButtonVisible">
            <q-btn @click="downButtonVisible=!downButtonVisible"  fab icon="keyboard_arrow_down" color="accent"></q-btn>
          </div>
          <div v-else>
            <q-btn @click="downButtonVisible=!downButtonVisible"  fab icon="pause" color="accent"></q-btn>
          </div>
        </q-page-sticky>
      </q-scroll-area>


      <q-toggle
      v-model="filters.ok"
      label="OK"
      color="green"
    ></q-toggle>

    <q-toggle
      v-model="filters.warning"
      label="Warning"
      color="yellow"
    ></q-toggle>

    <q-toggle
      v-model="filters.error"
      label="Error"
      color="red"
    ></q-toggle>
    <q-toggle 
      v-model="filters.info"
      label="Info"
      color="blue">
    </q-toggle>
    </section>
  </q-page>
</template>

<script>
import { reactive, ref } from "vue";
export default {
  data() {
    return {
      goDown: true,
      scrollArea: ref(null),
      downButtonVisible: false,
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      },

      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: '#027be3',
        width: '9px',
        opacity: 0.2
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

      // console.log(info.verticalPercentage);
      // if(info.verticalPercentage >=0.95  ) {      
      //   this.downButtonVisible = false;
      //   info.ref.setScrollPercentage("vertical",1);
      // }
      // else {
      //   this.downButtonVisible = true;
      // }


      if(this.downButtonVisible) {

      }
      else {
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
    // goDown () {
    //   if (this.goDown) {
    //     this.$refs.scrollArea.setScrollPercentage("vertical", 1);
    //   }
    // },

    filters: {
      handler() {
        this.textArea = "";
        this.textLines = [];
        this.messages.forEach((message) => {
          this.parseMessage(message);
        });

        if(!this.downButtonVisible) {
          this.$refs.scrollArea.setScrollPercentage("vertical", 1);
        }
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
