<template>
  <div class="terminal-container">
    <div class="form-item">
      <div class="form-item__buttons">
        <button class="button" :disabled="fullLogLoaded" @click="loadPrevious">
          <FontAwesomeIcon v-if="loading" icon="spinner" spin></FontAwesomeIcon>
          <span v-else>{{ loadLogText }}</span>
        </button>
        <button class="button button--link pull-right" @click="downloadLog">
          <FontAwesomeIcon v-if="downloading" icon="spinner" spin></FontAwesomeIcon>
          <span v-else>{{ $t('log-download') }}</span>
        </button>
      </div>
    </div>

    <div ref="terminal" class="terminal">
      <!-- eslint-disable-next-line vue/no-unused-vars -->
      <div v-for="{ type, message, index } in log" :key="index" class="terminal-message terminal-message--truncated">
        <span class="terminal-message__content">
          <span class="terminal-message__time">[{{ message.time.toLocaleTimeString() }}]</span>
          <span class="terminal-message__level" :class="`terminal-message__level--${message.level.toLowerCase()}`">{{ message.level }}</span>
          <span class="terminal-message__logger">{{ message.logger }}</span>
          <span>></span>
          <span class="terminal-message__text">{{ message.text }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { downloadLog } from '../../utils/download';

  export default {
    name: 'AsfLog',
    data() {
      return {
        log: [],
        loading: false,
        downloading: false,
        inizialized: false,
        lastAt: 0,
        totalLines: 0,
      };
    },
    computed: {
      ...mapGetters({
        password: 'auth/password',
        count: 'settings/previousAmount',
      }),
      fullLogLoaded() {
        return this.lastAt <= 0 && this.inizialized;
      },
      loadLogText() {
        if (this.fullLogLoaded) return this.$t('log-previous-done');
        return this.$t('log-previous', { amount: this.count });
      },
    },
    watch: {
      log() {
        if (this.$refs.terminal.scrollTop < this.$refs.terminal.scrollHeight - this.$refs.terminal.clientHeight - 20) return;

        this.$nextTick(() => {
          this.$refs.terminal.scrollTop = Math.max(0, this.$refs.terminal.scrollHeight - this.$refs.terminal.clientHeight);
        });
      },
    },
    created() {
      const websocketURL = `${window.__BASE_URL__.replace(/^http/, 'ws')}api/nlog${(this.password) ? `?password=${encodeURIComponent(this.password)}` : ''}`;

      this.ws = new WebSocket(websocketURL);
      this.ws.onopen = this.onOpen.bind(this);
      this.ws.onmessage = this.onMessage.bind(this);
      this.ws.onclose = this.onClose.bind(this);
    },
    beforeDestroy() {
      this.ws.close();
    },
    methods: {
      onOpen(event) {
      },
      onMessage(event) {
        const message = JSON.parse(event.data).Result;
        this.log.push({ type: 'in', message: this.parseMessage(message) });
      },
      parseMessage(message) {
        const [time, process, level, logger, ...text] = message.split('|');

        return {
          // older safari versions do not support YYYY-MM-DD, that's why we replace the dashes
          time: new Date(time.replace(/-/g, '/')),
          process,
          level,
          logger,
          text: text.join('|'),
        };
      },
      onClose(event) {

      },
      async downloadLog() {
        if (this.downloading) return;
        this.downloading = true;

        try {
          const intMaxValue = 2_147_483_647;
          const fullLog = await this.$http.get(`nlog/file?count=${intMaxValue}`);
          downloadLog(fullLog.Content);
        } catch (err) {
          this.$error(err.message);
        } finally {
          this.downloading = false;
        }
      },
      async loadPrevious() {
        if (this.loading) return;
        this.loading = true;

        try {
          if (!this.inizialized) {
            const initialCall = await this.$http.get(`nlog/file?count=${this.count}`);
            this.totalLines = initialCall.TotalLines;
            this.lastAt = this.totalLines - this.log.length;
            this.inizialized = true;
          }

          const previous = await this.$http.get(`nlog/file?count=${this.count}&lastAt=${this.lastAt}`);

          if (this.lastAt > 0) this.lastAt -= this.count;

          const newLog = [];

          previous.Content.forEach(line => {
            newLog.push({ type: 'in', message: this.parseMessage(line) });
          });

          this.log = newLog.concat(this.log);
        } catch (err) {
          this.$error(err.message);
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>

<style lang="scss">
	.terminal-container {
    height: 100%;
    display: flex;
    flex-direction: column;
	}
</style>
