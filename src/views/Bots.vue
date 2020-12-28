<template>
  <main class="main-container main-container--fullheight bots-overview">
    <AsfFarmingInfo></AsfFarmingInfo>
    <AsfBots></AsfBots>
  </main>
</template>

<script>
  import AsfFarmingInfo from '../components/AsfFarmingInfo.vue';
  import AsfBots from '../components/AsfBots.vue';

  export default {
    name: 'BotsOverview',
    metaInfo() {
      return {
        title: this.$t('bots'),
      };
    },
    components: { AsfBots, AsfFarmingInfo },
  };
</script>

<style lang="scss">
	.bots-overview {
		display: grid;
		grid-gap: 1rem;
		grid-template-columns: 1fr;
		grid-template-rows: min-content min-content;
	}
</style>
