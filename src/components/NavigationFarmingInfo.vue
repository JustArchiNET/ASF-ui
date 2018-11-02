<template>
	<div v-if="cardsRemaining != 0" class="statistic-farming">
		<div class="farming-card">
			<span class="farming-card__value">{{ cardsRemaining }}</span>
			<span class="farming-card__name">{{ $t(`farming-info-cards`) }}</span>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';

	export default {
		name: 'navigation-farming-info',
		computed: {
			...mapGetters({
				cardsRemaining: 'bots/cardsRemaining'
			})
		}
	};
</script>

<style lang="scss">
	.statistic-farming {
		justify-content: center;
		padding: 0 0.5em;

		.app--small-navigation & {
			grid-template-columns: 1fr;

			.farming-card__name {
				display: none;
			}
		}
	}

	.farming-card {
		padding: 0.25em 0.1em;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 2px;
		color: var(--color-text);
		text-shadow: 0 0 1px var(--color-text-dark);
		background: var(--color-theme);

		.app--dark-mode & {
			background: var(--color-theme-dark);
		}
	}

	.farming-card__value {
		font-weight: 600;
		font-size: 1.2em;
	}

	.farming-card__name {
		font-size: 0.9em;
		text-transform: capitalize;
	}
</style>
