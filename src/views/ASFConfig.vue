<template>
  <main class="main-container main-container--fullheight">
    <div class="container">
      <template v-if="loading">
        <h3 class="subtitle">
          <FontAwesomeIcon icon="spinner" size="lg" spin></FontAwesomeIcon>
        </h3>
      </template>
      <template v-else>
        <ConfigEditor :fields="fields" :model="model" :categories="displayCategories ? categories : null" :descriptions="descriptions"></ConfigEditor>

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
  import downloadConfig from '../utils/downloadConfig';
  import { asfCategories } from '../utils/categories';
  import isSameConfig from '../utils/isSameConfig';

  export default {
    name: 'ASFConfig',
    metaInfo() {
      return {
        title: this.$t('asf-config'),
      };
    },
    components: { ConfigEditor },
    data() {
      return {
        loading: true,
        saving: false,
        fields: [],
        model: {},
        descriptions: {},
        categories: asfCategories,
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
        fetchConfigSchema('ArchiSteamFarm.Storage.GlobalConfig'),
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
        const description = (!descriptions[key])
          ? this.$t('description-not-found')
          : descriptions[key].replace(/<a href="/g, '<a target="_blank" rel="noreferrer noopener" href="');

        return { description, ...fields[key], ...(extendedFields[key] || []) };
      });

      this.loading = false;
    },
    methods: {
      async onSave() {
        if (this.saving) return;
        this.saving = true;

        try {
          // fetch current ASF config
          const { GlobalConfig: oldConfig } = await this.$http.get('asf');

          // we do not want to save identical config
          if (isSameConfig(this.model, oldConfig)) {
            this.$info(this.$t('config-no-changes'));
            return;
          }

          await this.$http.post('asf', { globalConfig: this.model });
          this.$info(this.$t('restart-initiated'));
          this.$router.push({ name: 'setup', params: { restart: true } });
        } catch (err) {
          this.$error(err.message);
        } finally {
          this.saving = false;
        }
      },
      async onDownload() {
        downloadConfig(this.model, 'ASF');
      },
    },
  };
</script>
