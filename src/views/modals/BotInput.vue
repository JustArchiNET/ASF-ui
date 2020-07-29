<template>
  <main v-if="bot" class="main-container">
    <h2 v-if="bot.nickname && nicknames" class="title">{{ bot.nickname }}</h2>
    <h2 v-else class="title">{{ bot.name }}</h2>

    <div class="form-item">
      <div class="form-item__info">{{ $t('input-info') }}</div>
      <div class="form-item__code">
        <label for="input" class="form-item__label">{{ $t('input-label') }}</label>
        <input id="input" class="form-item__input" type="text" v-model="code">
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
      };
    },
    computed: {
      ...mapGetters({ nicknames: 'settings/nicknames' }),
      bot() {
        return this.$store.getters['bots/bot'](this.$route.params.bot);
      },
    },
    async created() {
      if (!this.bot) this.$router.replace({ name: 'bots' });
    },
    mounted() {
      document.getElementById('input').focus();
    },
    methods: {
      async submit() {
        if (this.submitting) return;

        this.submitting = true;

        try {
          await this.$http.post(`bot/${this.bot.name}/input`, { type: this.bot.requiredInput, value: this.code });
          await this.$http.botAction(this.bot.name, 'start');
          await this.$store.dispatch('bots/updateBot', { name: this.bot.name, active: true });

          // todo: redirect to bot modal or bots page depending on from where user started bot
          this.$parent.back();
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
		justify-content: center;
    padding-bottom: 1em;

		:focus {
			outline: none;
		}
	}
</style>
