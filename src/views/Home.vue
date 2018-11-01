<template>
	<main class="main-container">
		<bot-farming-info></bot-farming-info>

		<h2 class="title">{{ $t('changelog') }}</h2>
		<div class="container">
			<changelog></changelog>
		</div>
	</main>
</template>

<script>
	import BotFarmingInfo from "../components/BotFarmingInfo.vue";
	import Changelog from '../components/Changelog.vue';

	export default {
		name: 'home',
		metaInfo: { title: 'Home' },
		components: { BotFarmingInfo, Changelog }
	};
</script>
