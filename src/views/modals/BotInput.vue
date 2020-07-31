<template>
  <main v-if="bot" class="main-container">
    <h2 v-if="bot.nickname && nicknames" class="title">{{ bot.nickname }}</h2>
    <h2 v-else class="title">{{ bot.name }}</h2>

    <div class="form-item">
      <div class="form-item__info">{{ $t(`input-info-${inputType}`) }}</div>
      <div class="form-item__code">
        <div>
          <label for="input" class="form-item__label">{{ $t(`input-label-${inputType}`) }}</label>
          <input id="input" class="form-item__input" type="password" autocomplete="new-password" v-model="code" />
        </div>
        <div class="form-item__buttons form-item__buttons--column">
          <button class="button button--helper" :title="$t('input-switch-visibility')" @click="switchInputType">
            <font-awesome-icon v-if="inputHidden" icon="eye" size="lg"></font-awesome-icon>
            <font-awesome-icon v-else icon="eye-slash" size="lg"></font-awesome-icon>
          </button>
        </div>
      </div>
      <div class="form-item__buttons form-item__buttons--center">
        <button class="button button--confirm" @click="submit">
          <font-awesome-icon v-if="submitting" icon="spinner" spin></font-awesome-icon>
          <span v-else>{{ $t('input-submit') }}</span>
        </button>
      </div>
    </div>
  </main>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'bot-input',
    data() {
      return {
        submitting: false,
        code: '',
        inputHidden: true,
      };
    },
    computed: {
      ...mapGetters({ nicknames: 'settings/nicknames' }),
      bot() {
        return this.$store.getters['bots/bot'](this.$route.params.bot);
      },
      inputType() {
        return this.$route.params.type.toLowerCase();
      },
    },
    created() {
      if (!this.bot || !this.$route.params.type) this.$router.replace({ name: 'bots' });
    },
    mounted() {
      document.getElementById('input').focus();
    },
    methods: {
      switchInputType() {
        this.inputHidden = !this.inputHidden;
        const field = document.getElementById('input');

        if (field.getAttribute('type') === 'password') field.setAttribute('type', 'text');
        else field.setAttribute('type', 'password');
      },
      async submit() {
        if (this.submitting) return;

        this.submitting = true;

        try {
          await this.$http.post(`bot/${this.bot.name}/input`, { type: this.bot.requiredInput, value: this.code });
          await this.$http.botAction(this.bot.name, 'start');
          await this.$store.dispatch('bots/updateBot', { name: this.bot.name, active: true });

          this.$router.back();
        } catch (err) {
          this.$error(err.message);
        } finally {
          this.submitting = false;
        }
      },
    },
  };
</script>

<style lang="scss">
  .form-item__info {
    padding-bottom: 1em;
  }

  .form-item__code {
    display: grid;
    grid-column-gap: 0.5em;
    grid-template-columns: 1fr auto;
    align-items: flex-end;
    padding-bottom: 1em;

    :focus {
      outline: none;
    }
  }

  .button--helper {
    max-width: 2em;
  }
</style>
