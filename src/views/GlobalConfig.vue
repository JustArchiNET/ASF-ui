<template>
	<main class="main-container main-container--fullheight">
		<div class="container">
			<template v-if="loading">
				<h3 class="subtitle">
					<font-awesome-icon icon="spinner" size="lg" spin></font-awesome-icon>
				</h3>
			</template>
			<template v-else>
				<config-editor :fields="fields" :model="model" :categories="displayCategories ? categories : null"></config-editor>

        <div class="form-item">
          <div class="form-item__buttons">
            <button class="button button--confirm" @click="onSave">
              <font-awesome-icon v-if="saving" icon="spinner" spin></font-awesome-icon>
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
	import prepareModelToDownload from '../utils/prepareModelToDownload';
	import waitForRestart from '../utils/waitForRestart';
	import { getType } from '../utils/swagger/parse';

  export default {
    name: 'global-config',
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
        { name: this.$t('remote-access'), fields: ['Headless', 'IPC', 'IPCPassword'] },
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
      const [model, schema, descriptions] = await Promise.all([
				this.getModel(),
				getType('GlobalConfig'),
				loadParameterDescriptions(this.version, this.$i18n.locale)
			]);

      Object.keys(schema).forEach(name => {
				if (name.startsWith('s_')) {
					const paramName = name.substr(2);
					delete model[paramName]
					delete schema[paramName]
				}
			});

      this.fields = Object.keys(schema).map(name => ({
				description: descriptions[name.replace('s_', '')],
				...schema[name],
				param: name.replace('s_', ''),
				paramName: name
			}));

      this.model = model;
      this.loading = false;

      await getType('BotConfig').then(c => console.log(c))
    },
    methods: {
      async getModel () {
				const { GlobalConfig: model } = await this.$http.get('asf');
				return model;
			},
      async onSave() {
        if (this.saving) return;

        this.saving = true;

        try {
          await this.$http.post('asf', { globalConfig: this.model });
          this.$info(this.$t('restart-initiated'));
          await waitForRestart();
          this.$success(this.$t('restart-complete'));
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
