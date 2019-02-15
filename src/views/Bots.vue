<template>
	<main class="main-container main-container--fullheight dashboard">
		<asf-farming-info></asf-farming-info>
		<asf-bots></asf-bots>
	</main>
</template>

<script>
	import AsfFarmingInfo from '../components/AsfFarmingInfo.vue';
	import AsfBots from '../components/AsfBots.vue';

	export default {
		name: 'dashboard',
		metaInfo() {
			return {
				title: this.$t('bots')
			};
		},
		components: { AsfBots, AsfFarmingInfo }
	};
</script>

<style lang="scss">
	.dashboard {
		display: grid;
		grid-template-rows: min-content min-content;
		grid-template-columns: 1fr;
		grid-gap: 1rem;
	}
</style>
