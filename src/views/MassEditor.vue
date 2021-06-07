<template>
  <main class="main-container main-container--fullheight">
    <div class="container">
      <MassEditorBots
        v-if="status === 'bots'"
        :bots="bots"
        :selectedBots="selectedBots"
        @toggle="toggleSelectedBots"
        @update="updateSelectedBots"
        @next="status = 'properties'"
      ></MassEditorBots>

      <MassEditorSelect
        v-if="status === 'properties'"
        :loading="loading"
        :status="status"
        :selectedProperties="selectedProperties"
        :options="fields"
        @select="selectProperty"
        @remove="removeProperty"
        @update="updateModel"
        @next="status = 'values'"
        @back="status = 'bots'"
      ></MassEditorSelect>

      <MassEditorValue
        v-if="status === 'values'"
        :selectedProperties="selectedProperties"
        :categories="categories"
        :config="config"
        @next="status = 'check'"
        @back="status = 'properties'"
      ></MassEditorValue>

      <MassEditorCheck
        v-if="status === 'check'"
        :config="config"
        :selectedBots="selectedBots"
        :selectedProperties="selectedProperties"
        @back="status = 'values'"
      ></MassEditorCheck>
    </div>
  </main>
</template>

<script>
  import { mapGetters } from 'vuex';
  import MassEditorBots from '../components/MassEditor/Bots.vue';
  import MassEditorValue from '../components/MassEditor/Value.vue';
  import MassEditorCheck from '../components/MassEditor/Check.vue';
  import MassEditorSelect from '../components/MassEditor/Select.vue';
  import fetchConfigSchema from '../utils/fetchConfigSchema';
  import loadParameterDescriptions from '../utils/loadParameterDescriptions';
  import { botCategories } from '../utils/categories';

  export default {
    name: 'MassEditor',
    metaInfo() {
      return {
        title: this.$t('mass-editor'),
      };
    },
    components: {
      MassEditorBots,
      MassEditorCheck,
      MassEditorSelect,
      MassEditorValue,
    },
    data() {
      return {
        loading: true,
        fields: [],
        model: {},
        descriptions: {},
        categories: botCategories,
        config: {},
        status: 'bots',
        selectedBots: [],
        selectedProperties: [],
      };
    },
    computed: {
      ...mapGetters({
        version: 'asf/version',
        bots: 'bots/bots',
      }),
    },
    async created() {
      await this.loadBotConfig();
    },
    methods: {
      async loadBotConfig() {
        const [
          { [this.bots[0].name]: { BotConfig: model } },
          { body: fields },
          descriptions,
        ] = await Promise.all([
          this.$http.get(`bot/${this.bots[0].name}`),
          fetchConfigSchema('ArchiSteamFarm.Steam.Storage.BotConfig'),
          loadParameterDescriptions(this.version, this.$i18n.locale),
        ]);

        Object.keys(model).forEach(key => {
          if (key.startsWith('s_')) delete model[key.substr(2)];
        });

        this.model = model;

        const extendedFields = {
          SteamLogin: { placeholder: this.$t('keep-unchanged') },
          SteamPassword: { placeholder: this.$t('keep-unchanged') },
          SteamParentalCode: { placeholder: this.$t('keep-unchanged') },
        };

        this.fields = Object.keys(fields).map(key => {
          const description = (!descriptions[key])
            ? this.$t('description-not-found')
            : descriptions[key].replace(/<a href="/g, '<a target="_blank" rel="noreferrer noopener" href="');

          return { description, ...fields[key], ...(extendedFields[key] || []) };
        });

        this.loading = false;
      },
      updateSelectedBots(bot) {
        const selectedBotNames = this.selectedBots.map(bot => bot.name);
        if (selectedBotNames.includes(bot.name)) {
          this.selectedBots = this.selectedBots.filter(selectedBot => selectedBot.name !== bot.name);
        } else {
          this.selectedBots.push(bot);
        }
      },
      selectProperty(property) {
        // initialize config property with default value
        this.config[property.param] = property.defaultValue;
      },
      removeProperty(property) {
        delete this.config[property.param];
      },
      updateModel(model) {
        this.selectedProperties = model;
      },
      toggleSelectedBots() {
        if (this.selectedBots.length === this.bots.length) this.selectedBots = [];
        else this.selectedBots = this.bots;
      },
    },
  };
</script>

<style lang="scss">
  .mass-editor__title {
    background: var(--color-background);
    color: var(--color-text-dark);
    padding: 1em;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--color-text-dark);
  }

  .mass-editor__navigation {
    display: flex;
    padding-left: 0.7em;
    gap: 0.5em;
  }

  .mass-editor__content {
    padding: 1em;
    background: var(--color-background-modal);
    display: block;
  }
</style>
