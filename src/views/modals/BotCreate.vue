<template>
  <main class="main-container main-container--bot-create">
    <h2 class="title">{{ $t('bot-new') }}</h2>

    <h3 v-if="loading" class="subtitle">
      <FontAwesomeIcon icon="spinner" size="lg" spin></FontAwesomeIcon>
    </h3>

    <div v-else class="container">
      <ConfigEditor v-if="displayCategories" :fields="fields" :model="model" :categories="categories"></ConfigEditor>
      <ConfigEditor v-else :fields="fields" :model="model"></ConfigEditor>

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
  import ConfigEditor from '../../components/ConfigEditor.vue';
  import fetchConfigSchema from '../../utils/fetchConfigSchema';
  import loadParameterDescriptions from '../../utils/loadParameterDescriptions';
  import prepareModelToDownload from '../../utils/prepareModelToDownload';
  import delay from '../../utils/delay';
  import botExists from '../../utils/botExists';

  export default {
    name: 'BotCreate',
    components: { ConfigEditor },
    data() {
      const categories = [
        { name: this.$t('basic'), fields: ['Name', 'SteamLogin', 'SteamPassword', 'Enabled', 'Paused', 'OnlineStatus', 'BotBehaviour'] },
        { name: this.$t('security'), fields: ['PasswordFormat', 'UseLoginKeys'] },
        { name: this.$t('access'), fields: ['SteamUserPermissions', 'SteamParentalCode'] },
        { name: this.$t('trade'), fields: ['SteamTradeToken', 'AcceptGifts', 'SendTradePeriod', 'SendOnFarmingFinished', 'TradingPreferences', 'LootableTypes', 'TransferableTypes', 'MatchableTypes'] },
        { name: this.$t('farming'), fields: ['FarmingOrders', 'AutoSteamSaleEvent', 'IdlePriorityQueueOnly', 'IdleRefundableGames', 'FarmOffline', 'ShutdownOnFarmingFinished'] },
        { name: this.$t('customization'), fields: ['SteamMasterClanID', 'RedeemingPreferences', 'GamesPlayedWhileIdle', 'CustomGamePlayedWhileFarming', 'CustomGamePlayedWhileIdle'] },
        { name: this.$t('performance'), fields: ['HoursUntilCardDrops'] },
      ];

      return {
        loading: true,
        creating: false,
        fields: [],
        model: {},
        categories,
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
          fetchConfigSchema('ArchiSteamFarm.BotConfig'),
          loadParameterDescriptions(this.version, this.$i18n.locale),
        ]);

        this.model = {};

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

        this.loading = false;
      },
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
      async onDownload() {
        // Remove name property from config - Ugly but works
        const config = JSON.parse(JSON.stringify(this.model));
        delete config.Name;

        const element = document.createElement('a');
        element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(prepareModelToDownload(config))}`);
        element.setAttribute('download', `${this.model.Name}.json`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      },
    },
  };
</script>

<style lang="scss">
	.main-container--bot-create {
		max-width: 1000px;
	}
</style>
