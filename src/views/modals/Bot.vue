<template>
	<main class="main-container main-container--bot-profile" v-if="bot">
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
				<bot-link icon="lock" :link="{ name: 'bot-2fa', params: { bot: bot.name } }"></bot-link>

				<bot-action icon="play" v-if="bot.paused && bot.active" @click="resume"></bot-action>
				<bot-action icon="pause" v-if="!bot.paused && bot.active" @click="pause"></bot-action>

				<bot-action icon="power-off" v-if="!bot.active" @click="start"></bot-action>
				<bot-action icon="power-off" v-if="bot.active" @click="stop"></bot-action>

				<bot-link icon="trash" :link="{ name: 'bot-delete', params: { bot: bot.name } }" class="pull-right"></bot-link>
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
	import BotAction from '../../components/BotAction.vue';
	import BotFarmingInfo from '../../components/BotFarmingInfo.vue';
	import BotGames from '../../components/BotGames.vue';
	import BotLink from '../../components/BotLink.vue';
	import Dropdown from '../../components/utils/Dropdown.vue';

	import { mapGetters } from 'vuex';
	import humanizeDuration from 'humanize-duration';

	export default {
		name: 'bot',
		components: { BotAction, BotFarmingInfo, BotGames, BotLink, Dropdown },
		computed: {
			...mapGetters({
				nicknames: 'settings/nicknames'
			}),
			bot() {
				return this.$store.getters['bots/bot'](this.$route.params.bot);
			},
			timeRemaining() {
				if (this.bot.status !== 'farming') return '-';

				const language = ['zh-CN', 'zh-TW'].includes(this.$i18n.locale)
						? this.$i18n.locale.replace('-', '_')
						: this.$i18n.noRegionalLocale;

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

	.bot-farming-info {
		margin: 1em 0 0;
		width: 100%;
		display: grid;
		grid-gap: 0.7em;
		grid-template-columns: repeat(3, 1fr);

		@media screen and (max-width: 530px) {
			grid-gap: 0.5em;
			grid-template-columns: 1fr;
		}
	}
</style>
