<template>
    <main class="main-container main-container--fullheight log">
        <h2 class="title">Log</h2>

        <div class="container container--fullheight">
            <div class="terminal" ref="terminal">
                <div class="terminal__message" v-for="{ type, message } in log">
                    <span class="terminal__sign">{{ type === 'out' ? '>' : '<' }}</span>
                    <span class="terminal__text">{{ message }}</span>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'log',
    data() {
      return {
        log: []
      };
    },
    computed: mapGetters({
      baseURL: 'auth/baseURL',
      password: 'auth/password'
    }),
    created() {
      const websocketURL = `${this.baseURL.replace(/^http/, 'ws')}/Api/Log?password=${encodeURIComponent(this.password)}`;

      this.ws = new WebSocket(websocketURL);
      this.ws.onopen = this.onOpen.bind(this);
      this.ws.onmessage = this.onMessage.bind(this);
      this.ws.onclose = this.onClose.bind(this);
    },
    methods: {
      onOpen(event) {

      },
      onMessage(event) {
        this.log.push({ type: 'in', message: JSON.parse(event.data).Result });
      },
      onClose(event) {

      }
    },
    watch: {
      log() {
        if (this.$refs.terminal.scrollTop < this.$refs.terminal.scrollHeight - this.$refs.terminal.clientHeight - 20) return;

        this.$nextTick(() => {
          this.$refs.terminal.scrollTop = Math.max(0, this.$refs.terminal.scrollHeight - this.$refs.terminal.clientHeight);
        });
      }
    },
    beforeDestroy() {
      this.ws.close();
    }
  };
</script>

<style lang="scss">
    .log {
        display: grid;
        grid-template-rows: auto 1fr;
    }
</style>