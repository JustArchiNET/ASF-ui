<template>
  <main class="main-container main-container--center">
    <div class="container container--small">
      <h2 class="title">{{ $t('setup') }}</h2>

      <div v-if="status === 'AUTHENTICATED'">
        <p v-if="$route.params.restart" class="status-text">{{ $t('setup-restart') }}</p>
        <p v-else-if="$route.params.update" class="status-text">{{ $t('setup-update') }}</p>
        <p v-else class="status-text">{{ $t('setup-authenticated') }}</p>
      </div>

      <p v-if="status === 'UNAUTHORIZED'" class="status-text">{{ $t('setup-description') }}</p>
      <p v-if="status === 'NOT_CONNECTED'" class="status-text">{{ $t('setup-not-connected') }}</p>
      <p v-if="status === 'GATEWAY_TIMEOUT'" class="status-text">{{ $t('setup-gateway-timeout', { n: countdown }) }}</p>
      <p v-if="status === 'NETWORK_ERROR'" class="status-text">{{ $t('setup-network-error', { n: countdown }) }}</p>
      <p v-if="status === 'NO_IPC_PASSWORD'" class="status-text" v-html="$t('setup-no-ipc-password')"></p>
      <p v-if="status === 'RATE_LIMITED'" class="status-text" v-html="$t('setup-rate-limited')"></p>

      <div v-if="status === 'UNAUTHORIZED'" class="form-item">
        <label for="password" class="form-item__label">{{ $t('password') }}</label>
        <input id="password" v-model="password" class="form-item__input" type="password" @keydown.enter="updatePassword">
      </div>

      <div class="form-item">
        <div class="form-item__buttons form-item__buttons--center">
          <button class="button button--confirm" @click="onButtonClick">
            <FontAwesomeIcon v-if="processing" icon="spinner" spin></FontAwesomeIcon>
            <span v-else>{{ buttonText }}</span>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { STATUS } from '../utils/getStatus';
  import waitForRestart from '../utils/waitForRestart';

  export default {
    name: 'Setup',
    metaInfo() {
      return {
        title: this.$t('setup'),
      };
    },
    data() {
      return {
        password: this.$store.getters['auth/password'],
        processing: false,
        countdown: 5,
        timer: null,
      };
    },
    computed: {
      ...mapGetters({ status: 'auth/status' }),
      buttonText() {
        switch (this.status) {
          case STATUS.UNAUTHORIZED:
          case STATUS.AUTHENTICATED:
            return this.$t('continue');
          default:
            return this.$t('refresh');
        }
      },
    },
    watch: {
      status() {
        this.cancelAutoUpdate();
        this.checkStatus();
      },
      countdown: {
        immediate: true,
        handler(value) {
          if (value > 0) setTimeout(() => this.countdown--, 1000);
          if (value === 0) this.countdown = 5;
        },
      },
      $route: {
        immediate: true,
        async handler() {
          if (this.$route.params.restart) await this.handleWaiting('restart');
          else if (this.$route.params.update) await this.handleWaiting('update');
          else this.checkStatus();
        },
      },
    },
    beforeDestroy() {
      this.cancelAutoUpdate();
    },
    methods: {
      async handleWaiting(mode = 'restart') {
        this.processing = true;
        await waitForRestart();
        if (mode === 'restart') this.$success(this.$t('restart-complete'));
        else if (mode === 'update') this.$success(this.$t('update-complete'));
        this.processing = false;
        this.checkStatus();
      },
      async onButtonClick() {
        if (this.processing) return;

        switch (this.status) {
          case STATUS.UNAUTHORIZED:
            this.updatePassword();
            break;
          case STATUS.AUTHENTICATED:
            this.redirect();
            break;
          default:
            this.refreshStatus();
        }
      },
      async updatePassword() {
        this.processing = true;

        try {
          await this.$store.dispatch('auth/setPassword', this.password);

          const validPassword = await this.$store.dispatch('auth/validate');
          if (validPassword) this.redirect();
          else this.$error(this.$t('password-invalid'));
        } catch (err) {
          this.$error(err.message);
        } finally {
          this.processing = false;
        }
      },
      async refreshStatus() {
        this.processing = true;

        try {
          await this.$store.dispatch('auth/updateStatus');
        } catch (err) {
          this.$error(err.message);
        } finally {
          this.processing = false;
        }
      },
      redirect() {
        // Add empty onAbort callback, since we are expecting navigation abort and redirect via beforeEnter guard
        // https://router.vuejs.org/guide/advanced/navigation-failures.html#navigation-failures
        this.$router.replace({ name: 'home' }, () => {}, () => {});
      },
      cancelAutoUpdate() {
        clearInterval(this.timer);
      },
      checkStatus() {
        switch (this.status) {
          case STATUS.AUTHENTICATED:
            this.redirect();
            break;
          case STATUS.NO_IPC_PASSWORD:
          case STATUS.RATE_LIMITED:
          case STATUS.UNAUTHORIZED:
            this.cancelAutoUpdate();
            break;
          default:
            this.timer = setInterval(this.refreshStatus, this.countdown * 1000);
        }
      },
    },
  };
</script>

<style lang="scss">
	.status-text {
		text-align: center;

    a {
      color: var(--color-theme);
    }
	}
</style>
