<template>
  <main v-if="bot" class="main-container main-container--bot-copy">
    <h2 class="title">{{ $t('bot-new') }}</h2>

    <div class="container">
      <p class="container-description">{{ $t('bot-new-copy', {name: bot.name}) }}</p>

      <ConfigEditor v-if="displayCategories" :fields="fields" :model="model" :categories="categories"></ConfigEditor>
      <ConfigEditor v-else :fields="fields" :model="model"></ConfigEditor>

      <div class="form-item">
        <div class="form-item__buttons">
          <button class="button button--confirm" @click="onCreate">
            <FontAwesomeIcon v-if="creating" icon="spinner" spin></FontAwesomeIcon>
            <span v-else>{{ $t('create') }}</span>
          </button>

          <router-link v-slot="{ navigate }" custom :to="{ name: 'bot-config', params: { bot: bot.name } }">
            <button class="button button--cancel pull-right" @click="navigate">{{ $t('cancel') }}</button>
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ConfigEditor from '../../components/ConfigEditor.vue';
  import delay from '../../utils/delay';
  import botExists from '../../utils/botExists';
  import { get } from '../../utils/storage';
  import { newBotCategories } from '../../utils/categories';

  export default {
    name: 'BotCopy',
    components: { ConfigEditor },
    data() {
      const fields = [
        {
          defaultValue: '',
          param: 'Name',
          paramName: 'Name',
          type: 'string',
          description: this.$t('name-description'),
        },
        {
          defaultValue: '',
          param: 'SteamLogin',
          paramName: 'SteamLogin',
          type: 'string',
          description: get(`cache:parameter-descriptions:${this.$i18n.locale}`).descriptions.SteamLogin,

        },
        {
          defaultValue: '',
          param: 'SteamPassword',
          paramName: 'SteamPassword',
          type: 'string',
          description: get(`cache:parameter-descriptions:${this.$i18n.locale}`).descriptions.SteamPassword,
        },
      ];

      return {
        creating: false,
        categories: newBotCategories,
        fields,
        model: {},
      };
    },
    computed: {
      ...mapGetters({
        displayCategories: 'settings/displayCategories',
        bots: 'bots/bots',
      }),
      bot() {
        return this.$store.getters['bots/bot'](this.$route.params.bot);
      },
    },
    watch: {
      $route: {
        immediate: true,
        async handler() {
          if (!this.bot) return;
          this.model = this.bot.config;
        },
      },
    },
    created() {
      if (!this.bot) this.$router.replace({ name: 'bots' });
    },
    methods: {
      async onCreate() {
        if (this.creating) return;

        // Remove name property from config - Ugly but works
        const config = JSON.parse(JSON.stringify(this.model));
        delete config.Name;

        if (!this.model.Name) {
          this.$error(this.$t('bot-create-name'));
          return;
        }

        if (this.model.Name === 'ASF') {
          this.$error(this.$t('bot-create-name-asf'));
          return;
        }

        if (botExists(this.bots, this.model.Name)) {
          this.$error(this.$t('bot-create-name-exist', { name: this.model.Name }));
          return;
        }

        this.creating = true;

        try {
          await this.$http.post(`bot/${this.model.Name}`, { botConfig: config });
          await delay(1000);
          await this.$store.dispatch('bots/updateBot', { name: this.model.Name });
          this.$parent.close();
        } catch (err) {
          this.$error(err.message);
        } finally {
          this.creating = false;
        }
      },
    },
  };
</script>

<style lang="scss">
	.main-container--bot-copy {
		max-width: 1000px;
	}

	.container-description {
		text-align: center;
		margin-bottom: 2em;
	}
</style>
