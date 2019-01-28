<template>
	<div class="bot-cards">
		<div class="bot-card" :class="[`status--${type}`, { 'bot-card--selected': selectedBots.includes(type) }]" @click.prevent="select(type)" v-for="type in botTypes">
			<fit-text ref="count" :max="1.2" class="bot-card__value">{{ count(type) }}</fit-text>
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
			select(type) {
				if (this.$route.name !== 'bots') this.$router.push({ name: 'bots' });

				const index = this.selectedBots.indexOf(type);

				if (index >= 0) {
					this.selectedBots.splice(index, 1);
				} else {
					this.selectedBots.push(type);
				}

				if (this.selectedBots.length === this.botTypes.length) this.selectedBots = [];

				this.$store.dispatch('settings/setSelectedBots', this.selectedBots);
			}
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
		min-width: 0;
		padding: 0.25em 0.1em;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 2px;
		border: 1px solid var(--color-navigation);
		color: var(--color-text);
		text-shadow: 0 0 1px var(--color-text-dark);
		background: var(--color-status);
		overflow: hidden;
		cursor: pointer;
	}

	.bot-card__value {
		word-break: break-all;
		font-weight: 600;
		font-size: 1.2em;
	}

	.bot-card__name {
		font-size: 0.9em;
		text-transform: capitalize;
	}

	.bot-card--selected {
		border: 1px solid #0dc10a;
		box-shadow: 0 0 0.5em #0dc10a;
	}
</style>
