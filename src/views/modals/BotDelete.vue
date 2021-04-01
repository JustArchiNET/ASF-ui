<template>
  <main v-if="bot" class="main-container main-container--bot-profile">
    <h2 class="title">{{ $t('bot-delete', { name }) }}</h2>

    <p class="info">{{ $t('bot-delete-info', { name }) }}</p>

    <div class="form-item">
      <div class="form-item__buttons form-item__buttons--center">
        <button class="button button--cancel" @click="onDelete">
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
  import { mapGetters } from 'vuex';
  import delay from '../../utils/delay';

  export default {
    name: 'BotDelete',
    data() {
      return {
        deleting: false,
      };
    },
    computed: {
      ...mapGetters({ nicknames: 'settings/nicknames' }),
      bot() {
        return this.$store.getters['bots/bot'](this.$route.params.bot);
      },
      name() {
        return (this.bot.nickname && this.nicknames) ? this.bot.nickname : this.bot.name;
      },
    },
    created() {
      if (!this.bot) this.$router.replace({ name: 'bots' });
    },
    methods: {
      async onDelete() {
        this.deleting = true;

        try {
          await this.$http.del(`bot/${this.bot.name}`);
          await delay(1000);
          await this.$store.dispatch('bots/updateBot', { name: this.bot.name });
          this.$router.push({ name: 'bots' });
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
</style>
