<template>
  <main class="main-container main-container--center">
    <div class="container container--small">
      <h2 class="title">{{ $t('setup') }}</h2>

      <p v-if="status === 'NOT_CONNECTED'" class="status-text status-text--error">{{ $t('setup-not-connected') }}</p>
      <p v-if="status === 'RATE_LIMITED'" class="status-text status-text--error">{{ $t('setup-rate-limited') }}</p>
      <p v-if="status === 'AUTHENTICATED'" class="status-text">{{ $t('setup-authenticated') }}</p>
      <p v-if="status === 'UNAUTHORIZED'" class="status-text">{{ $t('setup-description') }}</p>
      <p v-if="status === 'GATEWAY_TIMEOUT'" class="status-text">{{ $t('setup-gateway-timeout', { n: countdown }) }}</p>
      <p v-if="status === 'NETWORK_ERROR'" class="status-text">{{ $t('setup-network-error', { n: countdown }) }}</p>

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
  import delay from '../utils/delay';

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
        if (this.status === STATUS.AUTHENTICATED) this.redirect();
      },
      countdown: {
        handler(value) {
          if (value > 0) setTimeout(() => this.countdown--, 1000);
        },
        immediate: true,
      },
    },
    async mounted() {
      if (this.status === STATUS.AUTHENTICATED) this.redirect();

      while (this.status === STATUS.GATEWAY_TIMEOUT || this.status === STATUS.NETWORK_ERROR) {
        await delay(5000);
        await this.refreshStatus();
        this.countdown = 5;
      }
    },
    methods: {
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
          if (validPassword) this.$router.replace({ name: 'home' });
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
        this.$router.replace({ name: 'home' });
      },
    },
  };
</script>

<style lang="scss">
	.status-text {
		text-align: center;
	}

	.status-text--error {
		color: var(--color-button-cancel);
	}
</style>
