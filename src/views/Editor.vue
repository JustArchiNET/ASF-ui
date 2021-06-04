<template>
  <main class="main-container main-container--fullheight">
    <div class="container">
      <template v-if="loading">
        <h3 class="subtitle">
          <FontAwesomeIcon icon="spinner" size="lg" spin></FontAwesomeIcon>
        </h3>
      </template>
      <template v-else>
        <div v-if="status === 'bots'">
          <div class="accordion" :class="{active: status === 'bots'}">
            {{ $t('editor-bots') }}
            <button class="navigation button" :disabled="selectedBots.length === 0" @click="setStatus('properties')">
              {{ $t('next') }}
            </button>
          </div>
          <div class="panel" :class="{visible: status === 'bots'}">
            <EditorBots :selected-bot-names="selectedBotNames" @update="updateSelectedBots"></EditorBots>
          </div>
        </div>

        <div v-if="status === 'properties'">
          <div class="accordion" :class="{active: status === 'properties'}">
            {{ $t('editor-properties') }}
            <button class="navigation button" :disabled="selectedConfigProperties.length === 0" @click="setStatus('values')">
              {{ $t('next') }}
            </button>
            <button class="navigation button" @click="setStatus('bots')">
              {{ $t('back') }}
            </button>
          </div>
          <div class="panel" :class="{visible: status === 'properties'}">
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
        </div>

        <div v-if="status === 'values'">
          <div class="accordion" :class="{active: status === 'values'}">
            {{ $t('editor-values') }}
            <button class="navigation button" :disabled="selectedConfigValues.length === 0" @click="setStatus('check')">
              {{ $t('next') }}
            </button>
            <button class="navigation button" @click="setStatus('properties')">
              {{ $t('back') }}
            </button>
          </div>
          <div class="panel" :class="{visible: status === 'values'}">
            <ConfigEditor :fields="selectedConfigProperties" :categories="displayCategories ? categories : null" :model="newConfigModel"></ConfigEditor>
          </div>
        </div>

        <div v-if="status === 'check'">
          <div class="accordion" :class="{active: status === 'check'}">
            {{ $t('editor-check') }}
            <button v-if="!saving" class="navigation button" @click="setStatus('values')">
              {{ $t('back') }}
            </button>
          </div>
          <div class="panel" :class="{visible: status === 'check'}">
            <EditorCheck :saving="saving" :selected-bot-names="selectedBotNames" :config="JSON.stringify(newConfigModel)" @save="onSave"></EditorCheck>
          </div>
        </div>
      </template>
    </div>
  </main>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ConfigEditor from '../components/ConfigEditor.vue';
  import EditorBots from '../components/Editor/Bots.vue';
  import EditorCheck from '../components/Editor/Check.vue';
  import fetchConfigSchema from '../utils/fetchConfigSchema';
  import loadParameterDescriptions from '../utils/loadParameterDescriptions';

  export default {
    name: 'Editor',
    metaInfo() {
      return {
        title: this.$t('editor'),
      };
    },
    components: {
      ConfigEditor,
      EditorBots,
      EditorCheck,
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
        status: 'bots',
        selectedBots: [],
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
      selectedBotNames() {
        const names = [];
        this.selectedBots.forEach(bot => names.push(bot.name));
        return names;
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
      updateSelectedBots(bot) {
        if (!this.selectedBots.includes(bot)) this.selectedBots.push(bot);
        else this.selectedBots = this.selectedBots.filter(selectedBot => selectedBot.name !== bot.name);
      },
      setStatus(status) {
        this.status = status;
      },
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
        if (this.saving) return;

        this.saving = true;

        // eslint-disable-next-line no-restricted-syntax
        for (const bot of this.selectedBots) {
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

  .active {
    color: var(--color-theme);
  }

  .panel {
    padding: 1em;
    background: var(--color-background-modal);
    display: none;
    overflow: hidden;

    &.visible {
      display: block;
    }
  }
</style>
