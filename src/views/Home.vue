<template>
	<main class="main-container home">
		<bot-farming-info></bot-farming-info>

		<div class="container">
			<changelog></changelog>
		</div>
	</main>
</template>

<script>
	import BotFarmingInfo from '../components/BotFarmingInfo.vue';
	import Changelog from '../components/Changelog.vue';
	import SectionTitle from '../components/SectionTitle.vue';

	export default {
		name: 'home',
		metaInfo() {
			return {
				title: this.$t('home')
			};
		},
		components: { SectionTitle, BotFarmingInfo, Changelog }
	};
</script>

<style lang="scss">
	.home {
		display: grid;
		grid-template-rows: auto auto;
		grid-gap: 1rem;
	}
</style>
