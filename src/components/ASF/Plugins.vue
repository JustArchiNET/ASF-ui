<template>
  <div class="plugins">
    <h3 v-if="loading" class="subtitle">
      <FontAwesomeIcon icon="spinner" size="lg" spin></FontAwesomeIcon>
    </h3>

    <h3 v-if="statusText" class="subtitle">
      {{ statusText }}
    </h3>

    <div v-for="(plugin, i) in plugins" v-else :key="i" class="plugin">
      <div class="plugin__title">
        <span class="plugin__name">{{ plugin.Name }}</span>
        <span class="plugin__version">{{ plugin.Version }}</span>
        <span v-if="plugin.IsOfficialPlugin" class="plugin__label">{{ $t('official') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AsfPlugins',
    data() {
      return {
        loading: true,
        error: null,
        plugins: [],
      };
    },
    computed: {
      statusText() {
        if (this.error) return this.error;
        if (!this.loading && !this.plugins.length) return this.$t('plugins-not-loaded');
      },
    },
    async created() {
      try {
        const officialPlugins = await this.$http.get('Plugins', { official: true, custom: false });
        officialPlugins.forEach(plugin => {
          plugin.IsOfficialPlugin = true;
        });

        const customPlugins = await this.$http.get('Plugins', { official: false, custom: true });
        customPlugins.forEach(plugin => {
          plugin.IsOfficialPlugin = false;
        });

        this.plugins = [...officialPlugins, ...customPlugins];

        this.plugins.forEach((plugin, i) => {
          if (!Object.prototype.hasOwnProperty.call(plugin, 'Name')) plugin.Name = this.$t('plugin-unknown-name', { number: i });
          if (!Object.prototype.hasOwnProperty.call(plugin, 'Version')) plugin.Version = this.$t('plugin-unknown-version');
        });
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  };
</script>

<style lang="scss">
  .plugins {
    display: flex;
    flex-direction: column;
  }

  .plugin {
    border-bottom: 1px solid var(--color-background);
    margin-bottom: 1em;
    padding-bottom: 1em;

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
  }

  .plugin__title {
    display: flex;
    align-items: baseline;

    @media screen and (max-width: 400px) {
      align-items: flex-start;
      flex-direction: column;
      gap: 4px;
    }
  }

  .plugin__name {
    font-size: 1.3em;
    font-weight: bold;
  }

  .plugin__version {
    padding-left: 0.8em;

    @media screen and (max-width: 400px) {
      padding-left: 0;
    }
  }

  .plugin__label {
    color: #00a65a;
    background-color: var(--color-background-light);
    border: 2px solid currentColor;
    border-radius: 4px;
    display: inline-block;
    line-height: 1;
    margin-left: 0.8em;
    padding: 0.25em 0.5em;

    @media screen and (max-width: 400px) {
      margin-left: 0;
    }
  }
</style>
