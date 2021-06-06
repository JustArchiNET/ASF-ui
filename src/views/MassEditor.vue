<template>
  <main class="main-container main-container--fullheight">
    <div class="container">
      <div v-if="status === 'bots'">
        <div class="accordion">
          {{ $t('mass-editor-bots') }}
          <button class="navigation button" :disabled="selectedBots.length === 0" @click="status = 'properties'">
            {{ $t('next') }}
          </button>
        </div>
        <div class="panel">
          <MassEditorBots :bots="bots" :selectedBotNames="selectedBotNames" @update="updateSelectedBots"></MassEditorBots>

          <div class="form-item">
            <button class="button" @click="toggleSelectedBots">
              <span v-if="selectedBots.length === bots.length">{{ $t('mass-editor-deselect-bots') }}</span>
              <span v-else>{{ $t('mass-editor-select-bots') }}</span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="status === 'properties'">
        <div class="accordion">
          {{ $t('mass-editor-properties') }}
          <button class="navigation button" :disabled="selectedConfigProperties.length === 0" @click="status = 'values'">
            {{ $t('next') }}
          </button>
          <button class="navigation button" @click="status = 'bots'">
            {{ $t('back') }}
          </button>
        </div>
        <div class="panel">
          <Multiselect
            v-model="selectedConfigProperties"
            label="paramName"
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
            @close="placeholder = $t('mass-editor-properties')"
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
          <button class="navigation button" :disabled="selectedConfigProperties.length === 0" @click="status = 'check'">
            {{ $t('next') }}
          </button>
          <button class="navigation button" @click="status = 'properties'">
            {{ $t('back') }}
          </button>
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
          <button v-if="!saving" class="navigation button" @click="status = 'values'">
            {{ $t('back') }}
          </button>
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
        placeholder: this.$t('mass-editor-properties'),
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
    async mounted() {
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
          const description = (!descriptions[key]) ? this.$t('description-not-found') : descriptions[key].replace(/<a href="/g, '<a target="_blank" rel="noreferrer noopener" href="');
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

        this.$success(this.$t('mass-editor-check-confirmation'));
        this.saving = false;
      },
      async saveConfigForBot(config, bot) {
        try {
          // fetch current bot config
          const { [bot.name]: { BotConfig: oldConfig } } = await this.$http.get(`bot/${bot.name}`);

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
    },
  };
</script>

<style lang="scss">
  @import "vue-multiselect/dist/vue-multiselect.min.css";
  @import "../style/multiselect";

  .multiple {
    height: 230px;
  }

  .accordion {
    background: rgba(0, 0, 0, 0.4);
    color: var(--color-text-dark);
    padding: 18px;
    text-align: left;
    border: none;
    outline: none;
    transition: ease-in-out width 0.3s;
  }

  .navigation {
    float: right;
    min-height: 0;
    padding: 0.25em 0.5em;
    margin-left: 0.5em;
  }

  .panel {
    padding: 1em;
    background: var(--color-background-modal);
    display: block;
  }

  .form-item {
    margin-top: 1em;
  }
</style>
