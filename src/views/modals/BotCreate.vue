<template>
  <main class="main-container main-container--bot-create">
    <h2 class="title">{{ $t('bot-new') }}</h2>

    <h3 v-if="loading" class="subtitle">
      <FontAwesomeIcon icon="spinner" size="lg" spin></FontAwesomeIcon>
    </h3>

    <div v-else class="container">
      <ConfigEditor :fields="fields" :model="model" :categories="displayCategories ? categories : null"></ConfigEditor>

      <div class="form-item">
        <div class="form-item__buttons">
          <button class="button button--confirm" @click="onCreate">
            <FontAwesomeIcon v-if="creating" icon="spinner" spin></FontAwesomeIcon>
            <span v-else>{{ $t('create') }}</span>
          </button>

          <button class="button button--link pull-right" @click="onDownload">
            {{ $t('download-raw-config') }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ConfigEditor from '../../components/Config/Editor.vue';
  import fetchConfigSchema from '../../utils/fetchConfigSchema';
  import loadParameterDescriptions from '../../utils/loadParameterDescriptions';
  import downloadConfig from '../../utils/downloadConfig';
  import delay from '../../utils/delay';
  import botExists from '../../utils/botExists';
  import { botCategories } from '../../utils/configCategories';

  export default {
    name: 'BotCreate',
    components: { ConfigEditor },
    data() {
      return {
        loading: true,
        creating: false,
        fields: [],
        model: {},
        categories: botCategories,
      };
    },
    computed: mapGetters({
      version: 'asf/version',
      displayCategories: 'settings/displayCategories',
      bots: 'bots/bots',
    }),
    async created() {
      await this.loadConfig();
      const botNameField = document.getElementById('Name');
      if (botNameField) botNameField.focus();
    },
    methods: {
      async loadConfig() {
        const [{ body: fields }, descriptions] = await Promise.all([
          fetchConfigSchema('ArchiSteamFarm.Steam.Storage.BotConfig'),
          loadParameterDescriptions(this.version, this.$i18n.locale),
        ]);

        this.fields = [
          {
            defaultValue: '',
            param: 'Name',
            paramName: 'Name',
            type: 'string',
            description: this.$t('name-description'),
          },
          ...Object.keys(fields).map(key => ({
            description: descriptions[key],
            ...fields[key],
          })),
        ];

        this.model = {};
        this.loading = false;
      },
      async onCreate() {
        if (this.creating) return;

        const { Name: name, ...config } = JSON.parse(JSON.stringify(this.model));

        if (!name) {
          this.$error(this.$t('bot-create-name'));
          return;
        }

        if (name === 'ASF') {
          this.$error(this.$t('bot-create-name-asf'));
          return;
        }

        if (botExists(this.bots, name)) {
          this.$error(this.$t('bot-create-name-exist', { name }));
          return;
        }

        this.creating = true;

        try {
          await this.$http.post(`bot/${name}`, { botConfig: config });
          await delay(1000);
          await this.$store.dispatch('bots/updateBot', { name });
          this.$parent.close();
        } catch (err) {
          this.$error(err.message);
        } finally {
          this.creating = false;
        }
      },
      async onDownload() {
        const { Name: name, ...config } = JSON.parse(JSON.stringify(this.model));
        downloadConfig(config, name);
      },
    },
  };
</script>

<style lang="scss">
	.main-container--bot-create {
		max-width: 1000px;
	}
</style>
