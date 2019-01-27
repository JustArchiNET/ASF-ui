<template>
	<div class="info-cards">
		<asf-farming-info-card :title="$t('farming-info-games')" :value="gamesRemaining" icon="gamepad"></asf-farming-info-card>
		<asf-farming-info-card :title="$t('farming-info-time')" :value="timeRemaining" icon="clock"></asf-farming-info-card>
		<asf-farming-info-card :title="$t('farming-info-cards')" :value="cardsRemaining" icon="clone"></asf-farming-info-card>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
	import humanizeDuration from 'humanize-duration';
	import AsfFarmingInfoCard from './AsfFarmingInfoCard.vue';

	export default {
		name: 'bot-farming-info',
		components: { AsfFarmingInfoCard },
		computed: {
			...mapGetters({
				botsFarmingCount: 'bots/botsFarmingCount'
			}),
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

		@media screen and (max-width: 750px) {
			grid-template-columns: 1fr;
		}
	}

	.info-card {
		background: var(--color-background-light);
		display: grid;
		grid-template-columns: auto 1fr;
	}

	.info-card__icon {
		height: 4rem;
		width: 4rem;
		font-size: 2.1em;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-theme);
		color: var(--color-text);
	}

	.info-card__body {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		padding: 5px 10px;
		justify-content: space-between;
	}

	.info-card__title {
		text-transform: uppercase;
		font-size: 0.9em;
		margin: 0;
	}

	.info-card__value {
		font-weight: 600;
		font-size: 1.2em;
		margin: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
