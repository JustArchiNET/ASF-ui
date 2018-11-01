<template>
	<div v-if="gamesRemaining < 0" class="farming-info">
		<h2 class="title">{{ $t('farming-info') }}</h2>

		<div class="info-cards">
			<div class="info-card">
				<div class="info-card__icon"><font-awesome-icon icon="gamepad"></font-awesome-icon></div>
				<div class="info-card__body">
					<p class="info-card__title">{{ $t('farming-info-games') }}</p>
					<p class="info-card__value">{{ gamesRemaining }}</p>
				</div>
			</div>

			<div class="info-card">
				<div class="info-card__icon"><font-awesome-icon icon="clock"></font-awesome-icon></div>
				<div class="info-card__body">
					<p class="info-card__title">{{ $t('farming-info-time') }}</p>
					<p class="info-card__value">{{ timeRemaining }}</p>
				</div>
			</div>
			<div class="info-card">
				<div class="info-card__icon"><font-awesome-icon icon="clone"></font-awesome-icon></div>
				<div class="info-card__body">
					<p class="info-card__title">{{ $t('farming-info-cards') }}</p>
					<p class="info-card__value">{{ cardsRemaining }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
	import humanizeDuration from 'humanize-duration';

	export default {
		name: 'bot-farming-info',
		computed: {
			...mapGetters({
				gamesRemaining: 'bots/gamesRemaining',
				timeRemaining: 'bots/timeRemaining',
				cardsRemaining: 'bots/cardsRemaining'
			}),
			timeRemaining() {
				return humanizeDuration(this.$store.getters['bots/timeRemaining'] * 1000, { language: this.$i18n.noRegionalLocale })
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
