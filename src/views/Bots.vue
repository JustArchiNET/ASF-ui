<template>
	<main class="main-container dashboard">
		<bot-farming-info></bot-farming-info>
		<asf-bots></asf-bots>
	</main>
</template>

<script>
	import BotFarmingInfo from '../components/BotFarmingInfo.vue';
	import AsfBots from '../components/AsfBots.vue';

	export default {
		name: 'dashboard',
		metaInfo() {
			return {
				title: this.$t('bots')
			};
		},
		components: { AsfBots, BotFarmingInfo },
	}
</script>

<style lang="scss">
	.dashboard {
		display: grid;
		grid-template-rows: min-content min-content;
		grid-template-columns: 1fr;
		grid-gap: 1rem;
	}
</style>
