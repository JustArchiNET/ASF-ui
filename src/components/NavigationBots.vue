<template>
	<div class="bot-cards">
		<div v-for="(type, i) in botTypes" :key="i" class="bot-card" :class="[`status--${type}`, { 'bot-card--selected': selectedBots.includes(type) }]" @click.prevent="selectType(type)">
			<fit-text ref="count" :max="1.2" class="bot-card__value">
				{{ count(type) }}
			</fit-text>
			<span class="bot-card__name">{{ $t(`bot-status-${type}`) }}</span>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
	import FitText from './utils/FitText.vue';

	export default {
		name: 'navigation-bots',
		components: { FitText },
		data() {
			return {
				botTypes: ['farming', 'online', 'offline', 'disabled']
			};
		},
		computed: {
			...mapGetters({
				botsCount: 'bots/count',
				selectedBots: 'settings/selectedBots'
			}),
			count() {
				return type => this.botsCount(type);
			}
		},
		methods: {
			recalculateText() {
				this.$refs.count.forEach(fitText => fitText.calculate());
				if (this.transitioning) requestAnimationFrame(() => this.recalculateText());
			},
			onTransitionStart() {
				if (this.transitioning) return;
				this.transitioning = true;
				this.recalculateText();
			},
			onTransitionEnd() {
				this.transitioning = false;
			},
			selectType(type) {
				if (this.$route.name !== 'bots') this.$router.push({ name: 'bots' });

				let selectedBots = this.selectedBots.includes(type)
					? this.selectedBots.filter(botType => botType !== type)
					: [...this.selectedBots, type];

				if (selectedBots.length === this.botTypes.length) selectedBots = [];

				this.$store.dispatch('settings/setSelectedBots', selectedBots);
			}
		}
	};
</script>

<style lang="scss">
	.bot-cards {
		display: grid;
		grid-gap: 0.5em;
		grid-template-columns: 1fr 1fr;
		padding: 0.5em;

		.app--small-navigation & {
			grid-template-columns: 1fr;

			.bot-card__name {
				display: none;
			}
		}
	}

	.bot-card {
		align-items: center;
		background: var(--color-status);
		border: 1px solid var(--color-navigation);
		border-radius: 2px;
		color: var(--color-text);
		cursor: pointer;
		display: flex;
		flex-direction: column;
		min-width: 0;
		overflow: hidden;
		padding: 0.25em 0.1em;
		text-shadow: 0 0 1px var(--color-text-dark);
	}

	.bot-card__value {
		font-size: 1.2em;
		font-weight: 600;
		word-break: break-all;
	}

	.bot-card__name {
		font-size: 0.9em;
		text-transform: capitalize;
	}

	.bot-card--selected {
		border: 1px solid #fff;
		box-shadow: 0 0 0.5em #0dc10a;
	}
</style>
