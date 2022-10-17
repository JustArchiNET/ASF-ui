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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AsfPlugins",
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
      if (!this.loading && !this.plugins.length)
        return this.$t("plugins-not-loaded");
    },
  },
  async created() {
    try {
      this.plugins = await this.$http.get("Plugins");
      this.plugins.forEach((plugin, i) => {
        if (!Object.prototype.hasOwnProperty.call(plugin, "Name"))
          plugin.Name = this.$t("plugin-unknown-name", { number: i });
        if (!Object.prototype.hasOwnProperty.call(plugin, "Version"))
          plugin.Version = this.$t("plugin-unknown-version");
      });
      this.loading = false;
    } catch (err) {
      this.error = err.message;
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

.plugin__name {
  font-size: 1.3em;
  font-weight: bold;
}

.plugin__version {
  padding-left: 10px;
}
</style>
