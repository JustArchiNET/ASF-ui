<template>
  <main class="main-container main-container--fullheight bots-overview">
    <AsfFarmingInfo></AsfFarmingInfo>
    <AsfBots></AsfBots>
    <AsfBotsFilter></AsfBotsFilter>
  </main>
</template>

<script>
import AsfFarmingInfo from "../components/ASF/FarmingInfo.vue";
import AsfBots from "../components/ASF/Bots.vue";
import AsfBotsFilter from "../components/ASF/BotsFilter.vue";

export default {
  name: "BotsOverview",
  metaInfo() {
    return {
      title: this.$t("bots"),
    };
  },
  components: { AsfBots, AsfFarmingInfo, AsfBotsFilter },
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
