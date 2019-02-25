<template>
	<div class="info-cards">
		<asf-farming-info-card :title="$t('farming-info-games')" :value="gamesRemaining" icon="gamepad" />
		<asf-farming-info-card :title="$t('farming-info-time')" :value="timeRemaining" icon="clock" />
		<asf-farming-info-card :title="$t('farming-info-cards')" :value="cardsRemaining" icon="clone" />
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
	import humanizeDuration from 'humanize-duration';
	import AsfFarmingInfoCard from './AsfFarmingInfoCard.vue';

	export default {
		name: 'asf-farming-info',
		components: { AsfFarmingInfoCard },
		computed: {
			...mapGetters({ botsFarmingCount: 'bots/botsFarmingCount' }),
			timeRemaining() {
				if (this.botsFarmingCount === 0) return '-';

				const language = ['zh-CN', 'zh-TW'].includes(this.$i18n.locale)
					? this.$i18n.locale.replace('-', '_')
					: this.$i18n.noRegionalLocale;

				return humanizeDuration(this.$store.getters['bots/timeRemaining'] * 1000, { language });
			},
			gamesRemaining() {
				if (this.botsFarmingCount === 0) return '-';
				return this.$store.getters['bots/gamesRemaining'];
			},
			cardsRemaining() {
				if (this.botsFarmingCount === 0) return '-';
				return this.$store.getters['bots/cardsRemaining'];
			}
		}
	};
</script>

<style lang="scss">
	.info-cards {
		display: grid;
		grid-gap: 1em;
		grid-template-columns: repeat(3, 1fr);

		@media screen and (max-width: 650px) {
			grid-template-columns: 1fr;
		}
	}
</style>
