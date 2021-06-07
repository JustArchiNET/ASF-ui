<template>
  <main class="main-container main-container--fullheight">
    <div class="container">
      <div v-if="status === 'bots'">
        <div class="accordion">
          {{ $t('mass-editor-bots') }}
          <div class="navigation pull-right">
            <button
              class="button"
              :disabled="selectedBots.length === 0"
              :title="[selectedBots.length === 0 ? $t('mass-editor-bots-disabled') : null]"
              @click="status = 'properties'"
            >
              {{ $t('next') }}
            </button>
          </div>
        </div>
        <div class="panel">
          <MassEditorBots :bots="bots" :selectedBotNames="selectedBotNames" @update="updateSelectedBots"></MassEditorBots>

          <button class="button mt" @click="toggleSelectedBots">
            <span v-if="selectedBots.length === bots.length">{{ $t('mass-editor-bots-deselect') }}</span>
            <span v-else>{{ $t('mass-editor-bots-select') }}</span>
          </button>
        </div>
      </div>

      <div v-if="status === 'properties'">
        <div class="accordion">
          {{ $t('mass-editor-properties') }}
          <div class="navigation pull-right">
            <button class="button" @click="status = 'bots'">
              {{ $t('back') }}
            </button>
            <button
              class="button"
              :disabled="selectedConfigProperties.length === 0"
              :title="[selectedConfigProperties.length === 0 ? $t('mass-editor-properties-disabled') : null]"
              @click="status = 'values'"
            >
              {{ $t('next') }}
            </button>
          </div>
        </div>
        <div class="panel">
          <Multiselect
            v-model="selectedConfigProperties"
            label="param"
            trackBy="param"
            :loading="loading"
            :multiple="true"
            :options="fields"
            :closeOnSelect="false"
            :placeholder="placeholder"
            :deselectLabel="$t('mass-editor-properties-deselect')"
            :selectLabel="$t('mass-editor-properties-select')"
            :selectedLabel="$t('mass-editor-properties-selected')"
            @select="selectProperty"
            @open="placeholder = $t('mass-editor-search')"
            @close="placeholder = $t('mass-editor-properties-placeholder')"
          >
            <span slot="noResult">
              {{ $t('mass-editor-search-not-found') }}
            </span>
          </Multiselect>
        </div>
      </div>

      <div v-if="status === 'values'">
        <div class="accordion">
          {{ $t('mass-editor-values') }}
          <div class="navigation pull-right">
            <button class="button" @click="status = 'properties'">
              {{ $t('back') }}
            </button>
            <button class="button" @click="status = 'check'">
              {{ $t('next') }}
            </button>
          </div>
        </div>
        <div class="panel">
          <ConfigEditor
            :fields="selectedConfigProperties"
            :categories="displayCategories ? categories : null"
            :model="config"
            :deleteDefaultValues="false"
          ></ConfigEditor>
        </div>
      </div>

      <div v-if="status === 'check'">
        <div class="accordion">
          {{ $t('mass-editor-check') }}
          <div class="navigation pull-right">
            <button v-if="!saving" class="button" @click="status = 'values'">
              {{ $t('back') }}
            </button>
          </div>
        </div>
        <div class="panel">
          <MassEditorCheck
            :saving="saving"
            :config="JSON.stringify(config)"
            :selectedBots="selectedBots"
            @save="onSave"
          ></MassEditorCheck>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Multiselect from 'vue-multiselect';
  import ConfigEditor from '../components/ConfigEditor.vue';
  import MassEditorBots from '../components/MassEditor/Bots.vue';
  import MassEditorCheck from '../components/MassEditor/Check.vue';
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
      ConfigEditor,
      MassEditorBots,
      MassEditorCheck,
      Multiselect,
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
        placeholder: this.$t('mass-editor-properties-placeholder'),
        watcherActive: true,
      };
    },
    computed: {
      ...mapGetters({
        version: 'asf/version',
        displayCategories: 'settings/displayCategories',
        bots: 'bots/bots',
      }),
      configProperties() {
        return this.fields.filter(field => field.param);
      },
      configOptions() {
        return this.fields.map(field => field.param);
      },
      selectedBotNames() {
        return this.selectedBots.map(bot => bot.name);
      },
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
        if (this.selectedBotNames.includes(bot.name)) {
          this.selectedBots = this.selectedBots.filter(selectedBot => selectedBot.name !== bot.name);
        } else {
          this.selectedBots.push(bot);
        }
      },
      selectProperty(property) {
        // initialize config property with default value
        this.config[property.param] = property.defaultValue;
      },
      async onSave() {
        if (this.saving) return;

        this.saving = true;

        // eslint-disable-next-line no-restricted-syntax
        for (const bot of this.selectedBots) {
          console.log('updating config for bot:', bot.name);
          await this.saveConfigForBot(this.config, bot);
          console.log('finished updating config for bot:', bot.name);
        }

        this.$success(this.$t('mass-editor-check-saved'));
        this.saving = false;
      },
      async saveConfigForBot(config, bot) {
        try {
          // fetch current bot config
          const { [bot.name]: { BotConfig: oldConfig } } = await this.$http.get(`bot/${bot.name}`);

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
  @import "../style/partials/multiselect";

  .accordion {
    background: var(--color-background);
    color: var(--color-text-dark);
    padding: 1em;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--color-text-dark);
  }

  .navigation {
    display: flex;
    padding-left: 0.7em;
    gap: 0.5em;
  }

  .panel {
    padding: 1em;
    background: var(--color-background-modal);
    display: block;
  }

  .mt {
    margin-top: 1em;
  }
</style>
