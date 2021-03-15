<template>
  <main class="main-container main-container--fullheight">
    <div class="container">
      <template v-if="loading">
        <h3 class="subtitle">
          <FontAwesomeIcon icon="spinner" size="lg" spin></FontAwesomeIcon>
        </h3>
      </template>
      <template v-else>
        <ConfigEditor v-if="displayCategories" :fields="fields" :model="model" :categories="categories" :descriptions="descriptions"></ConfigEditor>
        <ConfigEditor v-else :fields="fields" :model="model" :descriptions="descriptions"></ConfigEditor>

        <div class="form-item">
          <div class="form-item__buttons">
            <button class="button button--confirm" @click="onSave">
              <FontAwesomeIcon v-if="saving" icon="spinner" spin></FontAwesomeIcon>
              <span v-else>{{ $t('save') }}</span>
            </button>

            <button class="button button--link pull-right" @click="onDownload">
              {{ $t('download-raw-config') }}
            </button>
          </div>
        </div>
      </template>
    </div>
  </main>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ConfigEditor from '../components/ConfigEditor.vue';
  import loadParameterDescriptions from '../utils/loadParameterDescriptions';
  import fetchConfigSchema from '../utils/fetchConfigSchema';
  import prepareModelToDownload from '../utils/prepareModelToDownload';
  import waitForRestart from '../utils/waitForRestart';
  import delay from '../utils/delay';

  export default {
    name: 'GlobalConfig',
    metaInfo() {
      return {
        title: this.$t('global-config'),
      };
    },
    components: { ConfigEditor },
    data() {
      const categories = [
        { name: this.$t('basic'), fields: ['SteamOwnerID'] },
        { name: this.$t('trade'), fields: ['MaxTradeHoldDuration'] },
        { name: this.$t('customization'), fields: ['AutoRestart', 'Blacklist', 'CommandPrefix', 'CurrentCulture', 'Statistics', 'SteamMessagePrefix'] },
        { name: this.$t('remote-access'), fields: ['Headless', 'IPC', 'IPCPassword', 'IPCPasswordFormat'] },
        { name: this.$t('connection'), fields: ['ConnectionTimeout', 'SteamProtocols', 'WebProxy', 'WebProxyPassword', 'WebProxyUsername'] },
        { name: this.$t('farming'), fields: ['FarmingDelay', 'IdleFarmingPeriod', 'MaxFarmingTime'] },
        { name: this.$t('performance'), fields: ['OptimizationMode', 'ConfirmationsLimiterDelay', 'GiftsLimiterDelay', 'InventoryLimiterDelay', 'LoginLimiterDelay', 'WebLimiterDelay'] },
        { name: this.$t('updates'), fields: ['UpdateChannel', 'UpdatePeriod'] },
        { name: this.$t('advanced'), fields: ['Debug'] },
      ];

      return {
        loading: true,
        saving: false,
        fields: [],
        model: {},
        descriptions: {},
        categories,
      };
    },
    computed: mapGetters({
      version: 'asf/version',
      displayCategories: 'settings/displayCategories',
    }),
    async created() {
      const [
        { GlobalConfig: model },
        { body: fields },
        descriptions,
      ] = await Promise.all([
        this.$http.get('asf'),
        fetchConfigSchema('ArchiSteamFarm.GlobalConfig'),
        loadParameterDescriptions(this.version, this.$i18n.locale),
      ]);

      Object.keys(model).forEach(key => {
        if (key.startsWith('s_')) delete model[key.substr(2)];
      });

      this.model = model;

      const extendedFields = {
        IPCPassword: { placeholder: this.$t('keep-unchanged') },
      };

      this.fields = Object.keys(fields).map(key => {
        const description = (!descriptions[key]) ? this.$t('description-not-found') : descriptions[key].replace(/<a href="/g, '<a target="_blank" href="');
        return { description, ...fields[key], ...(extendedFields[key] || []) };
      });

      this.loading = false;
    },
    methods: {
      async onSave() {
        if (this.saving) return;
        this.saving = true;

        try {
          await this.$http.post('asf', { globalConfig: this.model });
          this.$info(this.$t('restart-initiated'));
          await waitForRestart();
          this.$success(this.$t('restart-complete'));
          await delay(3000);
          window.location.reload();
        } catch (err) {
          this.$error(err.message);
        } finally {
          this.saving = false;
        }
      },
      async onDownload() {
        const element = document.createElement('a');
        element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(prepareModelToDownload(this.model))}`);
        element.setAttribute('download', 'ASF.json');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      },
    },
  };
</script>
