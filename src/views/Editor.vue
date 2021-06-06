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
          <div class="accordion">
            {{ $t('editor-bots') }}
            <button class="navigation button" :disabled="selectedBots.length === 0" @click="status = 'properties'">
              {{ $t('next') }}
            </button>
          </div>
          <div class="panel">
            <EditorBots :selectedBotNames="selectedBotNames" @update="updateSelectedBots"></EditorBots>

            <div class="form-item">
              <button class="button" @click="toggleSelectedBots">
                <span v-if="selectedBots.length === bots.length">{{ $t('editor-deselect-bots') }}</span>
                <span v-else>{{ $t('editor-select-bots') }}</span>
              </button>
            </div>
          </div>
        </div>

        <div v-if="status === 'properties'">
          <div class="accordion">
            {{ $t('editor-properties') }}
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
              :multiple="true"
              :options="fields"
              :closeOnSelect="false"
              :placeholder="$t('editor-properties')"
              :deselectLabel="$t('editor-properties-deselect')"
              :selectLabel="$t('editor-properties-select')"
              :selectedLabel="$t('editor-properties-selected')"
              @select="selectProperty"
            ></Multiselect>
          </div>
        </div>

        <div v-if="status === 'values'">
          <div class="accordion">
            {{ $t('editor-values') }}
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
            {{ $t('editor-check') }}
            <button v-if="!saving" class="navigation button" @click="status = 'values'">
              {{ $t('back') }}
            </button>
          </div>
          <div class="panel">
            <EditorCheck
              :saving="saving"
              :selectedBotNames="selectedBotNames"
              :config="JSON.stringify(config)"
              @save="onSave"
            ></EditorCheck>
          </div>
        </div>
      </template>
    </div>
  </main>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Multiselect from 'vue-multiselect';
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
          await this.saveConfigForBot(this.config, bot);
          console.log('finished updating config for bot:', bot.name);
        }

        this.$success(this.$t('editor-check-confirmation'));

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

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

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

  .panel {
    padding: 1em;
    background: var(--color-background-modal);
    display: block;
  }

  .form-item {
    margin-top: 1em;
  }
</style>
