<template>
	<main class="main-container main-container--bot-profile">
		<div class="bot-profile" :class="[`status--${bot.status}`]">
			<div class="bot-profile__avatar-wrapper">
				<a target="_blank" :href="bot.profileURL" v-if="bot.steamid !== '0'">
					<img class="bot-profile__avatar" :src="bot.avatarURL">
				</a>
				<img class="bot-profile__avatar" :src="bot.avatarURL" v-else>
			</div>

			<div class="bot-profile__meta">
				<h3 class="bot-profile__name" v-if="bot.nickname && nicknames">{{ bot.nickname }}</h3>
				<h3 class="bot-profile__name" v-else>{{ bot.name }}</h3>
				<p class="bot-profile__status">{{ bot.statusText }}</p>
			</div>

			<div class="bot-profile__actions">
				<bot-link icon="wrench" :link="{ name: 'bot-config', params: { bot: bot.name } }"></bot-link>
				<bot-link icon="key" :link="{ name: 'bot-bgr', params: { bot: bot.name } }"></bot-link>

				<bot-action icon="play" v-if="bot.paused && bot.active" @click="resume"></bot-action>
				<bot-action icon="pause" v-if="!bot.paused && bot.active" @click="pause"></bot-action>

				<bot-action icon="power-off" v-if="!bot.active" @click="start"></bot-action>
				<bot-action icon="power-off" v-if="bot.active" @click="stop"></bot-action>

				<bot-link icon="trash" :link="{ name: 'bot-delete', params: { bot: bot.name } }" class="pull-right" color="red"></bot-link>
			</div>
		</div>

		<div class="bot-games" v-if="bot.games.length && botsFarmingCount !== 0">
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
		</div>
	</main>
</template>

<script>
	import BotAction from '../../components/BotAction.vue';
	import BotLink from '../../components/BotLink.vue';
	import Dropdown from '../../components/utils/Dropdown.vue';

	import { mapGetters } from 'vuex';

	export default {
		name: 'bot',
		components: { BotAction, BotLink, Dropdown },
		computed: {
			...mapGetters({
				nicknames: 'settings/nicknames',
				botsFarmingCount: 'bots/botsFarmingCount'
			}),
			bot() {
				return this.$store.getters['bots/bot'](this.$route.params.bot);
			}
		},
		methods: {
			async action(name, params = {}) {
				try {
					return await this.$http.botAction(this.bot.name, name, params);
				} catch (err) {
					this.$error(err.message);
				}
			},
			async update(params = {}) {
				return this.$store.dispatch('bots/updateBot', { name: this.bot.name, ...params });
			},
			async pause() {
				await this.action('pause', { permanent: true });
				await this.update({ paused: true });
			},
			async resume() {
				await this.action('resume');
				await this.update({ paused: false });
			},
			async start() {
				await this.action('start');
				await this.update({ active: true });
			},
			async stop() {
				await this.action('stop');
				await this.update({ active: false });
			}
		}
	};
</script>

<style lang="scss">
	.main-container--bot-profile {
		width: 400px;
	}

	.bot-profile {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-template-rows: auto auto;
		grid-column-gap: 0.5em;
		grid-template-areas: 'avatar meta' 'avatar actions';
	}

	.bot-profile__avatar-wrapper {
		grid-area: avatar;
		padding: 2px;
		background: var(--color-status);
		width: 75px;
		height: 75px;
	}

	.bot-profile__avatar {
		height: 100%;
		width: 100%;
	}

	.bot-profile__meta {
		min-width: 0;
	}

	.bot-profile__name {
		margin: 0;
	}

	.bot-profile__status {
		margin: 0;
		font-style: italic;
	}

	.bot-profile__name,
	.bot-profile__status {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		display: inline-block;
		width: 100%;
	}

	.bot-profile__buttons {
		grid-area: buttons;
	}

	.bot-profile__actions {
		grid-area: actions;
		display: flex;
		align-items: center;
	}

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
