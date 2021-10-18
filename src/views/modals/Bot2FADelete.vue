<template>
  <main v-if="bot" class="main-container main-container--bot-profile">
    <h2 v-tooltip="bot.name" class="title">{{ $t('confirmation-title') }}</h2>

    <p class="info" v-html="$t('2fa-delete-warning', { name: bot.viewableName })"></p>

    <div class="form-item">
      <div class="form-item__confirmation">
        <label for="input" class="form-item__label" v-html="$t('confirmation', { name: bot.viewableName })"></label>
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
  .form-item__label ::v-deep {
    font-weight: 400;
    display: block;
    margin-bottom: 4px;
    height: inherit;
    font-size: inherit;

    strong {
      color: var(--color-theme);
    }
  }
</style>
