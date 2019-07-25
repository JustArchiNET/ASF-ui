<template>
	<main v-if="bot" class="main-container main-container--bot-profile">
		<div class="bot-profile" :class="[`status--${bot.status}`]">
			<div class="bot-profile__avatar-wrapper">
				<a v-if="bot.steamid !== '0'" target="_blank" :href="bot.profileURL">
					<img class="bot-profile__avatar" :src="bot.avatarURL">
				</a>
				<img v-else class="bot-profile__avatar" :src="bot.avatarURL">
			</div>

			<div class="bot-profile__meta">
				<h3 v-if="bot.nickname && nicknames" class="bot-profile__name" :title="bot.name">
					{{ bot.nickname }}
				</h3>
				<h3 v-else class="bot-profile__name">
					{{ bot.name }}
				</h3>
				<p class="bot-profile__status">
					{{ bot.statusText }}
				</p>
			</div>

			<div class="bot-profile__actions">
				<bot-link icon="wrench" :link="{ name: 'bot-config', params: { bot: bot.name } }" :title="$t('bot-fav-buttons-config')"></bot-link>
				<bot-link icon="key" :link="{ name: 'bot-bgr', params: { bot: bot.name } }" :title="$t('bot-fav-buttons-bgr')"></bot-link>
				<bot-link icon="lock" :link="{ name: 'bot-2fa', params: { bot: bot.name } }" :title="$t('bot-fav-buttons-2fa')"></bot-link>

				<bot-action v-if="bot.paused && bot.active" icon="play" :title="$t('bot-resume-title', { bot: bot.name })" @click="resume"></bot-action>
				<bot-action v-if="!bot.paused && bot.active" icon="pause" :title="$t('bot-pause-title', { bot: bot.name })" @click="pause"></bot-action>

				<bot-action v-if="!bot.active" icon="power-off" :title="$t('bot-start-title', { bot: bot.name })" @click="start"></bot-action>
				<bot-action v-if="bot.active" icon="power-off" :title="$t('bot-stop-title', { bot: bot.name })" @click="stop"></bot-action>

				<bot-link icon="trash" :link="{ name: 'bot-delete', params: { bot: bot.name } }" :title="$t('bot-delete-title', { bot: bot.name })" class="pull-right"></bot-link>
			</div>
		</div>

		<div class="bot-farming-info">
			<bot-farming-info :value="gamesRemaining" icon="gamepad"></bot-farming-info>
			<bot-farming-info :value="timeRemaining" icon="clock"></bot-farming-info>
			<bot-farming-info :value="cardsRemaining" icon="clone"></bot-farming-info>
		</div>

		<bot-games :bot="bot"></bot-games>
	</main>
</template>

<script>
	import { mapGetters } from 'vuex';
	import humanizeDuration from 'humanize-duration';
	import getLocaleForHD from '../../utils/getLocaleForHD';
	import BotAction from '../../components/BotAction.vue';
	import BotFarmingInfo from '../../components/BotFarmingInfo.vue';
	import BotGames from '../../components/BotGames.vue';
	import BotLink from '../../components/BotLink.vue';

	export default {
		name: 'bot',
		components: {
			BotAction, BotFarmingInfo, BotGames, BotLink
		},
		computed: {
			...mapGetters({ nicknames: 'settings/nicknames' }),
			bot() {
				return this.$store.getters['bots/bot'](this.$route.params.bot);
			},
			timeRemaining() {
				if (this.bot.status !== 'farming') return '-';
				const language = getLocaleForHD();
				return humanizeDuration(this.bot.timeRemainingSeconds * 1000, { language });
			},
			gamesRemaining() {
				if (this.bot.status !== 'farming') return '-';
				return this.bot.gamesToFarm.length;
			},
			cardsRemaining() {
				if (this.bot.status !== 'farming') return '-';
				return this.bot.cardsRemaining;
			}
		},
		created() {
			if (!this.bot) this.$router.replace({ name: 'bots' });
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

		@media screen and (max-width: 530px) {
			width: auto;
		}
	}

	.bot-profile {
		display: grid;
		grid-column-gap: 0.5em;
		grid-template-areas: 'avatar meta' 'avatar actions';
		grid-template-columns: auto 1fr;
		grid-template-rows: auto auto;
	}

	.bot-profile__avatar-wrapper {
		background: var(--color-status);
		grid-area: avatar;
		height: 75px;
		padding: 2px;
		width: 75px;
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
		font-style: italic;
		margin: 0;
	}

	.bot-profile__name,
	.bot-profile__status {
		display: inline-block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 100%;
	}

	.bot-profile__buttons {
		grid-area: buttons;
	}

	.bot-profile__actions {
		align-items: center;
		grid-area: actions;
		display: flex;
	}

	.bot-farming-info {
		display: grid;
		grid-gap: 0.7em;
		grid-template-columns: repeat(3, 1fr);
		margin: 1em 0 0;
		width: 100%;

		@media screen and (max-width: 530px) {
			grid-gap: 0.5em;
			grid-template-columns: 1fr;
		}
	}
</style>
