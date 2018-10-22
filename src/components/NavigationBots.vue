<template>
	<div class="bot-cards">
		<div class="bot-card" :class="[`status--${type}`]" v-for="type in botTypes">
			<span class="bot-card__value">{{ count(type) }}</span>
			<span class="bot-card__name">{{ $t(`bot-status-${type}`) }}</span>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';

	export default {
		name: 'navigation-bots',
		computed: {
			...mapGetters({
				botsCount: 'bots/count'
			}),
			count() {
				return type => Math.min(99, this.botsCount(type));
			}
		},
		data() {
			return {
				botTypes: ['farming', 'online', 'offline', 'disabled']
			};
		}
	};
</script>

<style lang="scss">
	.bot-cards {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-gap: 0.5em;
		padding: 0.5em;

		.app--small-navigation & {
			grid-template-columns: 1fr;

			.bot-card__name {
				display: none;
			}
		}
	}

	.bot-card {
		padding: 0.25em 0.1em;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 2px;
		color: var(--color-text);
		text-shadow: 0 0 1px var(--color-text-dark);
		background: var(--color-status);
	}

	.bot-card__value {
		font-weight: 600;
		font-size: 1.2em;
	}

	.bot-card__name {
		font-size: 0.9em;
		text-transform: capitalize;
	}
</style>
