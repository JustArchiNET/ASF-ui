<template>
  <div class="bot-filter container" v-if="selectedBots.length !== 0">
    <h3 class="subtitle">{{ $t('bot-filter-title') }}</h3>
    <p>{{ $t('bot-filter-info') }}</p>
    <a class="bot-filter__reset" @click="resetSelectedBots()">{{ $t('bot-filter-reset') }}</a>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'AsfBotFilter',
    computed: {
      ...mapGetters({ selectedBots: 'settings/selectedBots' }),
    },
    methods: {
      resetSelectedBots() {
        this.$store.dispatch('settings/setSelectedBots', []);
      },
    },
  };
</script>

<style lang="scss">
	.bot-filter {
    height: fit-content;
    text-align: center;

    &__reset {
      cursor: pointer;
      color: var(--color-theme);
    }
	}
</style>
