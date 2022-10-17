<template>
  <div class="navigation-statistics">
    <NavigationStatistic
      v-if="botsFarmingCount !== 0"
      :title="$t('farming-info-cards')"
      :name="$t('farming-info-cards')"
      icon="clone"
      :value="cardsRemaining"
    ></NavigationStatistic>
    <NavigationStatistic
      :title="$t('statistics-memory-usage')"
      :name="$t('statistics-memory-usage')"
      icon="tachometer-alt"
      :value="memory"
    ></NavigationStatistic>
    <NavigationStatistic
      :title="$t('statistics-uptime')"
      :name="$t('statistics-uptime')"
      icon="clock"
      :value="uptime"
    ></NavigationStatistic>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import NavigationStatistic from "./Statistic.vue";

export default {
  name: "NavigationStatistics",
  components: { NavigationStatistic },
  computed: mapGetters({
    memory: "asf/memory",
    uptime: "asf/uptime",
    cardsRemaining: "bots/cardsRemaining",
    botsFarmingCount: "bots/botsFarmingCount",
  }),
};
</script>

<style lang="scss">
.navigation-statistics {
  display: flex;
  flex-direction: column;
}
</style>
