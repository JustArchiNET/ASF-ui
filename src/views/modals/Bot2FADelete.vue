<template>
  <main v-if="bot" class="main-container main-container--bot-profile">
    <h2 v-tooltip="bot.name" class="title">{{ $t('2fa-delete', { name: bot.viewableName }) }}</h2>

    <p class="info">{{ $t('2fa-delete-info', { name: bot.viewableName }) }}</p>

    <div class="form-item">
      <div class="form-item__confirmation">
        <label for="input" class="form-item__label" v-html="$t('bot-delete-confirmation', { name: bot.viewableName })"></label>
        <input id="input" v-model="confirmationText" class="form-item__input" type="text" autocomplete="off">
      </div>

      <div class="form-item__buttons form-item__buttons--center">
        <button class="button button--cancel" :disabled="!confirmed" @click="onDelete">
          <FontAwesomeIcon v-if="deleting" icon="spinner" spin></FontAwesomeIcon>
          <span v-else>{{ $t('delete') }}</span>
        </button>

        <button class="button button--confirm" @click="$parent.back()">
          {{ $t('cancel') }}
        </button>
      </div>
    </div>
  </main>
</template>

<script>
  import delay from '../../utils/delay';

  export default {
    name: 'Bot2faDelete',
    data() {
      return {
        deleting: false,
        confirmationText: '',
      };
    },
    computed: {
      bot() {
        return this.$store.getters['bots/bot'](this.$route.params.bot);
      },
      confirmed() {
        return this.confirmationText === this.bot.viewableName;
      },
    },
    created() {
      if (!this.bot) this.$router.replace({ name: 'bots' });
    },
    methods: {
      async onDelete() {
        this.deleting = true;

        try {
          const bot = this.bot.name;
          const response = await this.$http.del(`bot/${bot}/twoFactorAuthentication`);

          if (response[bot].Success) {
            this.$success(this.$t('2fa-delete-success', { bot }));
            await delay(1000);
            this.$router.push({ name: 'bots' });
          } else {
            this.$error(response[bot].Message);
          }
        } catch (err) {
          this.$error(err.message);
        } finally {
          this.deleting = false;
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
	.info {
    text-align: center;
    margin: 1em;
    position: relative;
	}

  .form-item__confirmation {
    margin-bottom: 1em;
  }

  .form-item__label ::v-deep {
    font-weight: 400;
    display: block;
    margin-bottom: 4px;
    height: inherit;

    strong {
      font-weight: 800;
      color: var(--color-theme);
    }
  }
</style>
