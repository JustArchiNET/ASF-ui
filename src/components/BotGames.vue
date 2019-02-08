<template>
	<div class="bot-games" v-if="bot.games.length && botsFarmingCount !== 0">
		<template v-if="gameName">
			<div class="bot-game" :title="game.GameName" v-for="game in bot.games">
				<a class="bot-game__name" target="_blank" :href="`https://store.steampowered.com/app/${game.AppID}/`">{{ game.GameName }}</a>
			</div>
		</template>

		<template v-else>
			<div class="bot-game" :title="game.GameName" :class="[game.farming ? 'status--farming' : 'status--disabled']" v-for="game in bot.games">
				<a target="_blank" :href="`https://store.steampowered.com/app/${game.AppID}/`">
					<div class="bot-game__info">
						<span class="bot-game__name">{{ game.GameName }}</span>
					</div>
					<div class="bot-game__background">
						<img class="bot-game__image" :src="`https://steamcdn-a.akamaihd.net/steam/apps/${game.AppID}/header.jpg`">
					</div>
				</a>
			</div>
		</template>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';

	export default {
		name: 'bot-games',
		props: {
			bot: Object
		},
		computed: {
			...mapGetters({
				botsFarmingCount: 'bots/botsFarmingCount',
				gameName: 'settings/gameName'
			})
		}
	};
</script>

<style lang="scss">
	.bot-games {
		margin: 1em 0 0;
		width: 100%;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 0.25em;
		font-size: 0.8em;

		@media screen and (max-width: 1200px) {
			grid-template-columns: repeat(2, 1fr);
			font-size: 1em;
		}

		@media screen and (max-width: 530px) {
			grid-template-columns: none;
			font-size: 1.2em;
		}
	}

	.bot-game {
		min-width: 0;
		width: 100%;
		position: relative;
	}

	.bot-game__info {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		z-index: 2;
		padding: 1em;
		box-sizing: border-box;
	}

	.bot-game__name {
		font-weight: bold;
		color: var(--color-text);
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		width: 100%;
		text-align: center;
	}

	.bot-game__background {
		z-index: 1;
		overflow: hidden;
		line-height: 0;
		border-radius: 4px;
		box-sizing: border-box;
		border: 2px solid var(--color-status);
	}

	.bot-game__image {
		width: 100%;
		filter: blur(1px) brightness(0.4);
	}
</style>
