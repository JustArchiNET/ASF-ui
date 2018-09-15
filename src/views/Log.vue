<template>
    <main class="main-container main-container--fullheight">
        <div class="container container--fullheight">
            <div class="terminal">
                <p v-for="message in messages">{{ message }}</p>
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
        messages: []
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
        this.messages.push(JSON.parse(event.data).Result);
      },
      onClose(event) {

      }
    },
    beforeDestroy() {
      this.ws.close();
    }
  };
</script>

<style lang="scss">
    .terminal {
        width: 100%;
        background: black;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
        padding: 1em;
        color: var(--color-text);
        font-family: monospace;
        box-sizing: border-box;
        height: 100%;
        overflow-y: auto;

        > p {
            margin: 0 0 0.1em;
        }
    }
</style>