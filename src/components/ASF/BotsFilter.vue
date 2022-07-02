<template>
  <div v-if="isVisible" class="bot-filter container">
    {{ infoText }}
    <a class="bot-filter__reset" @click="resetSelectedBots()">{{ $t('bot-filter-reset') }}</a>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'AsfBotsFilter',
    computed: {
      ...mapGetters({
        bots: 'bots/bots',
        selectedBots: 'settings/selectedBots',
      }),
      filteredBots() {
        return this.bots.filter(bot => bot.isVisible(this.selectedBots));
      },
      isVisible() {
        return this.selectedBots.length !== 0;
      },
      infoText() {
        return this.$t('bot-filter-info', { n: this.filteredBots.length, total: this.bots.length });
      },
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
