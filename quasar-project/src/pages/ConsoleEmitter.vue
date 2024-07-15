<template>
  <q-page>
  <button @click="start=!start">Start {{ start }}</button>
  </q-page>
</template>



<script>
export default {
  data() {
    return {
      count: 0,
      start: false,
      socket: null,
      types : ['error', 'warning', 'info', 'ok'],
    }
  },
  beforeMount() {
    this.socket = new WebSocket('ws://127.0.0.1:7890/EchoAll');
  },
  watch: {
    start() {
      console.log('start changed');
      if (this.start) {
        this.interval = setInterval(() => {
          
          const id = this.count;
          this.count++;
          const payload={
            status: this.types[id%4],
            Id: id,
          }
          console.log(payload, " + ", JSON.stringify(payload));
          this.socket.send(JSON.stringify(payload));
        }, 30);

        
      } else {
        clearInterval(this.interval);
      }
    }
  }
};
</script>