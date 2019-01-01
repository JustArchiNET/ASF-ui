<template>
	<main class="main-container dashboard">
		<asf-log class="log"></asf-log>
		<bot-farming-info class="farming-info"></bot-farming-info>

		<div class="bots">
			<bot-card v-for="bot in bots" :bot="bot" :key="bot.name" v-if="bot.isVisible(hiddenBots)"></bot-card>
		</div>
	</main>
</template>

<script>
	import BotFarmingInfo from '../components/BotFarmingInfo.vue';
	import AsfLog from '../components/AsfLog.vue';
	import BotCard from '../components/BotCard.vue';
	import { mapGetters } from 'vuex';

	export default {
		name: 'dashboard',
		metaInfo() {
			return {
				title: this.$t('dashboard')
			};
		},
		components: { BotFarmingInfo, AsfLog, BotCard },
		computed: mapGetters({
			bots: 'bots/bots',
			hiddenBots: 'settings/hiddenBots'
		})
	}
</script>

<style lang="scss">
	.dashboard {
		display: grid;
		grid-template-columns: 1fr 20rem;
		grid-template-rows: 14rem min-content;
		grid-gap: 1rem;
		grid-template-areas: 'log info' 'bots bots';

		@media screen and (max-width: 1330px) {
			grid-template-columns: 1fr;
			grid-template-rows: 14rem min-content min-content;
			grid-template-areas: 'log' 'info' 'bots';
		}
	}

	.log {
		min-height: 0;
		margin-bottom: 0;
		grid-area: log;
	}

	.farming-info {
		grid-area: info;
		grid-template-rows: repeat(3, 4rem);
		grid-template-columns: 1fr;

		@media screen and (max-width: 1330px) {
			grid-template-columns: repeat(3, 1fr);
			grid-template-rows: 1fr;
		}
	}

	.bots {
		grid-area: bots;
		min-height: 0;
		grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
		grid-gap: 1em;
		display: grid;

		@media screen and (max-width: 400px) {
			grid-template-columns: 1fr;
		}
	}
</style>
