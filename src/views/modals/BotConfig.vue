<template>
  <main v-if="bot" class="main-container main-container--bot-config">
    <h2 v-if="bot.nickname && nicknames" class="title">{{ bot.nickname }}</h2>
    <h2 v-else class="title">{{ bot.name }}</h2>

    <h3 v-if="loading" class="subtitle">
      <FontAwesomeIcon icon="spinner" size="lg" spin></FontAwesomeIcon>
    </h3>

    <div v-else class="container">
      <ConfigEditor v-if="displayCategories" :fields="fields" :model="model" :categories="categories"></ConfigEditor>
      <ConfigEditor v-else :fields="fields" :model="model"></ConfigEditor>

      <div class="form-item">
        <div class="form-item__buttons">
          <button class="button button--confirm" @click="onSave">
            <FontAwesomeIcon v-if="saving" icon="spinner" spin></FontAwesomeIcon>
            <span v-else>{{ $t('save') }}</span>
          </button>
          <router-link v-slot="{ navigate }" custom :to="{ name: 'bot-copy', params: { bot: bot.name } }">
            <button class="button button--confirm" @click="navigate">{{ $t('bot-copy') }}</button>
          </router-link>

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

  export default {
    name: 'BotConfig',
    components: { ConfigEditor },
    data() {
      const categories = [
        { name: this.$t('basic'), fields: ['Name', 'SteamLogin', 'SteamPassword', 'Enabled', 'Paused', 'OnlineStatus', 'BotBehaviour'] },
        { name: this.$t('security'), fields: ['PasswordFormat', 'UseLoginKeys'] },
        { name: this.$t('access'), fields: ['SteamUserPermissions', 'SteamParentalCode'] },
        { name: this.$t('trade'), fields: ['SteamTradeToken', 'AcceptGifts', 'SendTradePeriod', 'SendOnFarmingFinished', 'CompleteTypesToSend', 'TradingPreferences', 'LootableTypes', 'TransferableTypes', 'MatchableTypes'] },
        { name: this.$t('farming'), fields: ['FarmingOrders', 'AutoSteamSaleEvent', 'IdlePriorityQueueOnly', 'IdleRefundableGames', 'FarmOffline', 'ShutdownOnFarmingFinished'] },
        { name: this.$t('customization'), fields: ['SteamMasterClanID', 'UserInterfaceMode', 'RedeemingPreferences', 'GamesPlayedWhileIdle', 'CustomGamePlayedWhileFarming', 'CustomGamePlayedWhileIdle'] },
        { name: this.$t('performance'), fields: ['HoursUntilCardDrops'] },
      ];

      return {
        loading: false,
        saving: false,
        fields: [],
        model: {},
        categories,
      };
    },
    computed: {
      ...mapGetters({
        version: 'asf/version',
        nicknames: 'settings/nicknames',
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
        handler: 'loadConfig',
      },
    },
    created() {
      if (!this.bot) this.$router.replace({ name: 'bots' });
    },
    methods: {
      async loadConfig() {
        if (this.loading) return;

        this.loading = true;

        try {
          const [
            { body: fields },
            { [this.bot.name]: { BotConfig: model } },
            descriptions,
          ] = await Promise.all([
            fetchConfigSchema('ArchiSteamFarm.BotConfig'),
            this.$http.get(`bot/${this.bot.name}`),
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

          this.fields = Object.keys(fields).map(key => ({
            description: descriptions[key].replace(/<a href="/g, '<a target="_blank" href="'),
            ...fields[key],
            ...(extendedFields[key] || []),
          }));
        } catch (err) {
          this.$error(err.message);
        } finally {
          this.loading = false;
        }
      },
      async onSave() {
        if (this.saving) return;

        if (this.model.Name === 'ASF') {
          this.$error(this.$t('bot-create-name-asf'));
          return;
        }

        this.saving = true;

        try {
          await this.$http.post(`bot/${this.bot.name}`, { botConfig: this.model });
          this.$parent.back();
        } catch (err) {
          this.$error(err.message);
        } finally {
          this.saving = false;
        }
      },
      async onDownload() {
        const element = document.createElement('a');
        element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(prepareModelToDownload(this.model))}`);
        element.setAttribute('download', `${this.bot.name}.json`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      },
    },
  };
</script>

<style lang="scss">
	.main-container--bot-config {
		max-width: 1000px;
	}
</style>
