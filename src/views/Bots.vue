<template>
	<main class="main-container">
		<h2 class="title">{{ $t('bots') }}</h2>

		<div class="bots">
			<bot-card v-for="bot in bots" :bot="bot" :key="bot.name"></bot-card>

			<router-link tag="div" :to="{ name: 'bot-create' }" class="bot-placeholder status--disabled">
				<div class="bot-placeholder__button bot-placeholder__button--add">
					<font-awesome-icon icon="plus" class="bot-placeholder__icon"></font-awesome-icon>
					<span class="bot-placeholder__name">{{ $t('bot-new') }}</span>
				</div>
			</router-link>
		</div>
	</main>
</template>

<script>
	import BotCard from '../components/BotCard.vue';

	import { mapGetters } from 'vuex';

	export default {
		name: 'bots',
		metaInfo: { title: 'Bots' },
		components: { BotCard },
		computed: mapGetters({
			bots: 'bots/bots'
		})
	};
</script>

<style lang="scss">
	.bots {
		grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
		grid-gap: 1em;
		display: grid;


		@media screen and (max-width: 400px) {
			grid-template-columns: 1fr;
		}
	}

	.bot-placeholder {
		height: 2.25em;
		display: flex;
		justify-content: center;
		align-items: center;
		border-top: 3px solid var(--color-status);
		padding: 0.5em;
		background: var(--color-background-light);
		border-radius: 0 0 4px 4px;
		transition: border .3s;
		cursor: pointer;
	}

	.bot-placeholder__button {
		display: flex;
		align-items: center;
	}

	.bot-placeholder__name {
		font-weight: 600;
		font-size: 0.8em;
	}

	.bot-placeholder__icon {
		margin-right: 0.5em;
	}
</style>
