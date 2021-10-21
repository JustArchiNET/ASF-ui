<template>
  <main v-if="bot" class="main-container">
    <h2 v-tooltip="bot.name" class="title">{{ bot.viewableName }}</h2>

    <div v-if="!has2FA">
      <p class="info" v-html="$t('2fa-not-found')"></p>

      <div class="form-item__buttons form-item__buttons--center">
        <input ref="file" type="file" accept=".maFile" class="hidden" @change="onImport">
        <button class="button button--confirm" @click="$refs.file.click()">
          <FontAwesomeIcon v-if="importing" icon="spinner" spin></FontAwesomeIcon>
          <span v-else>{{ $t('2fa-import') }}</span>
        </button>
      </div>
    </div>

    <div v-else class="form-item">
      <div class="form-item__token">
        <input class="form-item__input form-item__input-token" type="text" :value="token" readonly>
        <div class="form-item__buttons form-item__buttons--column">
          <button v-tooltip.left="$t('2fa-token-refresh')" class="button button--helper" @click="refreshToken">
            <FontAwesomeIcon v-if="refreshing" icon="spinner" size="lg" spin></FontAwesomeIcon>
            <FontAwesomeIcon v-else icon="redo-alt" size="lg"></FontAwesomeIcon>
          </button>
          <button v-tooltip.left="$t('2fa-token-copy')" class="button button--helper" @click="copyToken">
            <FontAwesomeIcon icon="clipboard" size="lg"></FontAwesomeIcon>
          </button>
        </div>
      </div>
      <div class="form-item__buttons form-item__buttons--center form-item__buttons--column">
        <button class="button button--confirm" @click="acceptConfirmations">
          <FontAwesomeIcon v-if="accepting" icon="spinner" spin></FontAwesomeIcon>
          <span v-else>{{ $t('2fa-accept') }}</span>
        </button>
        <button class="button button--cancel" @click="rejectConfirmations">
          <FontAwesomeIcon v-if="rejecting" icon="spinner" spin></FontAwesomeIcon>
          <span v-else>{{ $t('2fa-reject') }}</span>
        </button>
      </div>
      <div class="form-item__delete">
        <a @click="$router.push({ name: 'bot-2fa-delete' })">{{ $t('2fa-delete', { name: bot.viewableName }) }}</a>
      </div>
    </div>
  </main>
</template>

<script>
  import * as copy from 'copy-to-clipboard';
  import delay from '../../utils/delay';

  export default {
    name: 'Bot2fa',
    data() {
      return {
        importing: false,
        accepting: false,
        rejecting: false,
        refreshing: false,
        token: '-----',
        has2FA: true,
      };
    },
    computed: {
      bot() {
        return this.$store.getters['bots/bot'](this.$route.params.bot);
      },
    },
    watch: {
      async token() {
        if (this.token === '-----') return;
        await delay(30000); // Steam 2FA token is only valid for 30 seconds
        this.token = '-----';
      },
      $route: {
        immediate: true,
        async handler() {
          if (!this.bot || !this.bot.has2FA) {
            this.has2FA = false;
            return;
          }

          this.has2FA = true;
          this.refreshToken();
        },
      },
    },
    async created() {
      if (!this.bot) this.$router.replace({ name: 'bots' });
    },
    methods: {
      async onImport() {
        if (this.importing) return;

        this.importing = true;

        try {
          const bot = this.bot.name;
          const maFile = this.$refs.file.files[0];
          const maFileContent = await this.readFile(maFile);
          const response = await this.$http.post(`bot/${bot}/twoFactorAuthentication`, JSON.parse(maFileContent));

          if (response[bot].Success) {
            this.$success(this.$t('2fa-import-success', { bot }));
            await delay(1000);
            this.$router.push({ name: 'bots' });
          } else {
            this.$error(response[bot].Message);
          }
        } catch (err) {
          this.$error(err.message);
        } finally {
          this.importing = false;
        }
      },
      readFile(maFile) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = e => {
            resolve(e.target.result);
          };
          reader.onerror = reject;
          reader.readAsText(maFile);
        });
      },
      async acceptConfirmations() {
        if (this.accepting) return;

        this.accepting = true;

        try {
          const bot = this.bot.name;
          const response = await this.$http.post(`bot/${bot}/twoFactorAuthentication/confirmations`, { accept: true });

          if (response[bot].Success) {
            const count = response[bot].Message.match(/\d+/)[0];
            if (count === '0') this.$info(this.$t('2fa-accept-not-found'));
            else this.$success(this.$t('2fa-accept-success', { bot, n: count }));
          } else {
            this.$error(response[bot].Message);
          }
        } catch (err) {
          this.$error(err.message);
        } finally {
          this.accepting = false;
        }
      },
      async rejectConfirmations() {
        if (this.rejecting) return;

        this.rejecting = true;

        try {
          const bot = this.bot.name;
          const response = await this.$http.post(`bot/${bot}/twoFactorAuthentication/confirmations`, { accept: false });

          if (response[bot].Success) {
            const count = response[bot].Message.match(/\d+/)[0];
            if (count === '0') this.$info(this.$t('2fa-reject-not-found'));
            else this.$success(this.$t('2fa-reject-success', { bot, n: count }));
          } else {
            this.$error(response[bot].Message);
          }
        } catch (err) {
          this.$error(err.message);
        } finally {
          this.rejecting = false;
        }
      },
      async refreshToken() {
        if (this.refreshing) return;

        this.refreshing = true;
        this.token = '-----';

        try {
          const bot = this.bot.name;
          const response = await this.$http.get(`bot/${bot}/twoFactorAuthentication/token`);

          if (response[bot].Result && response[bot].Success) {
            this.token = response[bot].Result;
          } else {
            this.$error(response[bot].Message);
          }
        } catch (err) {
          this.$error(err.message);
        } finally {
          this.refreshing = false;
        }
      },
      copyToken() {
        copy(this.token);
        this.$info(this.$t('2fa-token-copied'));
      },
    },
  };
</script>

<style lang="scss">
	.form-item__token {
		display: grid;
		grid-column-gap: 0.75em;
		grid-template-columns: 1fr auto;
		justify-content: center;
		padding-bottom: 1em;

		:focus {
			outline: none;
		}
	}

  .form-item__delete {
    padding-top: 1em;
    text-align: center;

    a {
      color: var(--color-text-dark);
      cursor: pointer;

      &:hover {
        color: red;
      }
    }
  }

	.form-item__input-token {
		font-size: 2.4em;
		font-weight: bold;
		height: 2.3em;
		letter-spacing: 0.3em;
		text-align: center;
		text-indent: 0.3em;
		width: 6em;

		.app--dark-mode & {
			border-color: var(--color-text-dark);
		}
	}

	.button--helper {
		max-width: 2em;
	}

  a {
    color: var(--color-theme);
  }
</style>
