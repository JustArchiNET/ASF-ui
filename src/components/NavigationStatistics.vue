<template>
	<div class="navigation-statistics">
		<navigation-statistic v-if="botsFarmingCount !== 0" :title="$t('farming-info-cards')" :name="$t('farming-info-cards')" icon="clone" :value="cardsRemaining" />
		<navigation-statistic :title="$t('statistics-memory-usage')" :name="$t('statistics-memory-usage')" icon="tachometer-alt" :value="memory" />
		<navigation-statistic :title="$t('statistics-uptime')" :name="$t('statistics-uptime')" icon="clock" :value="uptime" />
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
	import NavigationStatistic from './NavigationStatistic.vue';

	export default {
		name: 'navigation-statistics',
		components: { NavigationStatistic },
		computed: mapGetters({
			memory: 'asf/memory',
			uptime: 'asf/uptime',
			cardsRemaining: 'bots/cardsRemaining',
			botsFarmingCount: 'bots/botsFarmingCount'
		})
	};
</script>

<style lang="scss">
	.navigation-statistics {
		display: flex;
		flex-direction: column;
	}
</style>
