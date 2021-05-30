<template>
  <main class="main-container main-container--fullheight">
    <div class="container">
      <template v-if="loading">
        <h3 class="subtitle">
          <FontAwesomeIcon icon="spinner" size="lg" spin></FontAwesomeIcon>
        </h3>
      </template>
      <template v-else>
        <button class="accordion" @click="toggleAccordion($event)">
          Select the bots
          <button class="navigation button" @click="">Next</button>
        </button>
        <div class="panel">
          <EditorBots></EditorBots>
        </div>

        <button class="accordion" @click="toggleAccordion($event)">
          Select the config properties
          <button class="navigation button" @click="">Next</button>
          <button class="navigation button" @click="">Back</button>
        </button>
        <div class="panel">
          <div class="form-item">
            <div class="form-item__value">
              <select v-model="selectedConfigValues" class="form-item__input multiple" multiple @change="loadConfigEditor">
                <option v-for="field in fields" :key="field.param">
                  {{ field.param }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <button class="accordion" @click="toggleAccordion($event)">
          Define the new config values
          <button class="navigation button" @click="">Next</button>
          <button class="navigation button" @click="">Back</button>
        </button>
        <div class="panel">
          <ConfigEditor :fields="selectedConfigProperties" :categories="displayCategories ? categories : null" :model="newConfigModel"></ConfigEditor>
        </div>

        <button class="accordion" @click="toggleAccordion($event)">
          Check and save
          <button class="navigation button" @click="">Back</button>
        </button>
        <div class="panel">
          <EditorOverview :saving="saving" @save="onSave"></EditorOverview>
        </div>
      </template>
    </div>
  </main>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ConfigEditor from '../components/ConfigEditor.vue';
  import EditorBots from '../components/EditorBots.vue';
  import EditorOverview from '../components/EditorOverview.vue';
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
      EditorBots,
      EditorOverview,
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
        selectedConfigValues: [],
        selectedConfigProperties: [],
        newConfigModel: {},
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
    },
    async created() {
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
    methods: {
      loadConfigEditor() {
        this.newConfigModel = {};
        this.selectedConfigProperties = this.fields.filter(field => this.selectedConfigValues.includes(field.param)) || [];
      },
      toggleAccordion(event) {
        if (event.target.classList.contains('active')) return;

        const accordions = document.getElementsByClassName('accordion');
        for (let i = 0; i < accordions.length; i++) {
          const accordion = accordions[i];
          if (accordion.classList.contains('active')) accordion.classList.toggle('active');
          accordion.nextElementSibling.style.display = 'none';
        }

        event.target.classList.toggle('active');
        const panel = event.target.nextElementSibling;
        panel.style.display = 'block';
      },
      async onSave() {
        // Loop through all selected bots and update the bot-config
        // Add some kind of loading bar or info for the user "Updating config for bot 1 (4x bots remaining)..."
        if (this.saving) return;

        this.saving = true;

        // for now we loop through all bots, bot-selecting will come later
        // eslint-disable-next-line no-restricted-syntax
        for (const bot of this.bots) {
          console.log('updating config for bot:', bot.name);
          await this.saveBotConfig(bot, this.newConfigModel);
          console.log('finished updating config for bot:', bot.name);
        }

        this.saving = false;
      },
      async saveBotConfig(bot, newConfig) {
        try {
          // fetch current bot config
          const { [bot.name]: { BotConfig: oldConfig } } = await this.$http.get(`bot/${bot.name}`);

          // overwrite current bot config with new one
          const botConfig = { ...oldConfig, ...newConfig };

          // save config
          await this.$http.post(`bot/${bot.name}`, { botConfig });
        } catch (err) {
          this.$error(err.message);
        }
      },
    },
  };
</script>

<style lang="scss">
  .multiple {
    height: 230px;
  }

  .accordion {
    background: rgba(0, 0, 0, 0.4);
    color: var(--color-text-disabled);
    cursor: pointer;
    padding: 18px;
    width: 100%;
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

  .active, .accordion:hover {
    background: var(--color-theme);
    color: var(--color-text);
  }

  .panel {
    padding: 1em;
    background: var(--color-background-modal);
    display: none;
    overflow: hidden;
  }
</style>
