<template>
	<main class="main-container">
		<section-title>{{ $t('farming-info') }}</section-title>
		<bot-farming-info></bot-farming-info>

		<section-title>{{ $t('changelog') }}</section-title>
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
