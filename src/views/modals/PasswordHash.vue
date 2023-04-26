<template>
  <main v-if="label" class="main-container main-container--bot-profile">
    <h2 class="title">{{ $t('hash') }}</h2>

    <template v-if="loading">
      <h3 class="subtitle">
        <FontAwesomeIcon icon="spinner" size="lg" spin></FontAwesomeIcon>
      </h3>
    </template>
    <template v-else>
      <div class="form-item">
        <ConfigEditor
          :fields="fields"
          :model="config"
          :deleteDefaultValues="false"
        ></ConfigEditor>

        <div class="form-item__code">
          <div>
            <label for="hash" class="form-item__label">{{ label }}</label>
            <input id="hash" v-model="hash" class="form-item__input" type="password" autocomplete="new-password" @keydown.enter="savePassword">
          </div>
          <div class="form-item__buttons form-item__buttons--column">
            <button v-tooltip="$t('input-switch-visibility')" class="button button--helper" @click="switchInputType">
              <FontAwesomeIcon v-if="inputHidden" icon="eye" size="lg"></FontAwesomeIcon>
              <FontAwesomeIcon v-else icon="eye-slash" size="lg"></FontAwesomeIcon>
            </button>
          </div>
        </div>

        <div class="form-item__buttons form-item__buttons--center">
          <button class="button" :disabled="!hash" @click="savePassword">
            <FontAwesomeIcon v-if="saving" icon="spinner" spin></FontAwesomeIcon>
            <span v-else>{{ $t('hash') }}</span>
          </button>

          <button class="button" @click="$router.back()">
            {{ $t('cancel') }}
          </button>
        </div>
      </div>
    </template>
  </main>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ConfigEditor from '../../components/Config/Editor.vue';
  import fetchConfigSchema from '../../utils/fetchConfigSchema';
  import loadParameterDescriptions from '../../utils/loadParameterDescriptions';

  export default {
    name: 'PasswordHash',
    components: {
      ConfigEditor,
    },
    data() {
      return {
        hash: '',
        inputHidden: true,
        config: {},
        loading: true,
        fields: [],
        saving: false,
      };
    },
    computed: {
      ...mapGetters({
        version: 'asf/version',
      }),
      label() {
        return this.$route.params.label;
      },
      key() {
        return `${this.$route.params.label}Format`;
      },
    },
    async created() {
      if (!this.label) this.$router.replace({ name: 'asf-config' });

      const [
        { GlobalConfig: model },
        { body: fields },
        descriptions,
      ] = await Promise.all([
        this.$http.get('asf'),
        fetchConfigSchema('ArchiSteamFarm.Storage.GlobalConfig'),
        loadParameterDescriptions(this.version, this.$i18n.locale),
      ]);

      this.config = { [this.key]: model[this.key] };

      const description = (!descriptions[this.key])
        ? this.$t('description-not-found')
        : descriptions[this.key].replace(/<a href="/g, '<a target="_blank" rel="noreferrer noopener" href="');
      this.fields = [{ description, ...fields[this.key] }];

      this.loading = false;
    },
    methods: {
      switchInputType() {
        this.inputHidden = !this.inputHidden;
        const field = document.getElementById('hash');

        if (field.getAttribute('type') === 'password') field.setAttribute('type', 'text');
        else field.setAttribute('type', 'password');
      },
      async savePassword() {
        if (this.saving) return;
        this.saving = true;

        try {
          const ipcPassword = await this.$http.post('asf/hash', {
            HashingMethod: this.config[this.key],
            StringToHash: this.hash,
          });

          const params = { ipcPassword, ipcPasswordFormat: this.config[this.key] };

          this.$info(this.$t('hash-success'));
          this.$router.push({ name: 'asf-config', params });
        } finally {
          this.saving = false;
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
.form-item__code {
  padding: 0 1em 1em;
}
</style>
