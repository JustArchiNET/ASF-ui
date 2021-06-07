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
        :selectedConfigProperties="selectedConfigProperties"
        :options="fields"
        @select="selectProperty"
        @remove="removeProperty"
        @update="updateModel"
        @next="status = 'values'"
        @back="status = 'bots'"
      ></MassEditorSelect>

      <MassEditorValue
        v-if="status === 'values'"
        :selectedConfigProperties="selectedConfigProperties"
        :categories="categories"
        :config="config"
        @next="status = 'check'"
        @back="status = 'properties'"
      ></MassEditorValue>

      <MassEditorCheck
        v-if="status === 'check'"
        :saving="saving"
        :config="config"
        :selectedBots="selectedBots"
        :selectedConfigProperties="selectedConfigProperties"
        @save="onSave"
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
      const categories = [
        { name: this.$t('basic'), fields: ['Name', 'SteamLogin', 'SteamPassword', 'Enabled', 'Paused', 'OnlineStatus', 'BotBehaviour'] },
        { name: this.$t('security'), fields: ['PasswordFormat', 'UseLoginKeys'] },
        { name: this.$t('access'), fields: ['SteamUserPermissions', 'SteamParentalCode'] },
        { name: this.$t('trade'), fields: ['SteamTradeToken', 'AcceptGifts', 'SendTradePeriod', 'SendOnFarmingFinished', 'CompleteTypesToSend', 'TradingPreferences', 'LootableTypes', 'TransferableTypes', 'MatchableTypes'] },
        { name: this.$t('farming'), fields: ['FarmingOrders', 'AutoSteamSaleEvent', 'FarmPriorityQueueOnly', 'FarmNonRefundableGamesOnly', 'FarmOffline', 'ShutdownOnFarmingFinished'] },
        { name: this.$t('customization'), fields: ['SteamMasterClanID', 'UserInterfaceMode', 'RedeemingPreferences', 'GamesPlayedWhileIdle', 'CustomGamePlayedWhileFarming', 'CustomGamePlayedWhileIdle'] },
        { name: this.$t('performance'), fields: ['HoursUntilCardDrops'] },
      ];

      return {
        loading: true,
        saving: false,
        fields: [],
        model: {},
        descriptions: {},
        categories,
        config: {},
        status: 'bots',
        selectedBots: [],
        selectedConfigProperties: [],
        watcherActive: true,
      };
    },
    computed: {
      ...mapGetters({
        version: 'asf/version',
        bots: 'bots/bots',
      }),
    },
    watch: {
      async bots() {
        // Needed because 'this.bots[0].name' is sometimes undefined
        // Would probably be fixed if I would refactor it to its own component
        if (!this.watcherActive) return;
        await this.loadBotConfig();
        this.watcherActive = false;
      },
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
        this.selectedConfigProperties = model;
      },
      async onSave() {
        if (this.saving) return;

        this.saving = true;

        // eslint-disable-next-line no-restricted-syntax
        for (const bot of this.selectedBots) {
          await this.saveConfigForBot(this.config, bot);
        }

        this.$success(this.$t('mass-editor-check-saved'));
        this.saving = false;
      },
      async saveConfigForBot(config, bot) {
        try {
          // fetch current bot config
          const { [bot.name]: { BotConfig: oldConfig } } = await this.$http.get(`bot/${bot.name}`);

          // we do not want to save identical config
          if (this.isSameConfig(config, oldConfig)) return;

          // overwrite current bot config with new one
          const botConfig = { ...oldConfig, ...config };

          await this.$http.post(`bot/${bot.name}`, { botConfig });
        } catch (err) {
          this.$error(err.message);
        }
      },
      toggleSelectedBots() {
        if (this.selectedBots.length === this.bots.length) this.selectedBots = [];
        else this.selectedBots = this.bots;
      },
      isSameConfig(newConfig, oldConfig) {
        // eslint-disable-next-line no-restricted-syntax
        for (const [newProperty, newValue] of Object.entries(newConfig)) {
          const found = Object.entries(oldConfig)
            .find(([oldProperty, oldValue]) => oldProperty === newProperty && oldValue === newValue);

          if (found) return true;
        }

        return false;
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
