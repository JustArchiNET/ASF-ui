<template>
	<main class="main-container main-container--bot-profile">
		<h2 class="title" v-if="!bot">{{ $t('not-found') }}</h2>

		<template v-else>
			<div class="bot-profile" :class="[`status--${bot.status}`]">
				<div class="bot-profile__avatar-wrapper">
					<a target="_blank" :href="bot.profileURL" v-if="bot.steamid !== '0'">
						<img class="bot-profile__avatar" :src="bot.avatarURL">
					</a>
					<img class="bot-profile__avatar" :src="bot.avatarURL" v-else>
				</div>

				<div class="bot-profile__meta">
					<h3 class="bot-profile__name">{{ bot.name }}</h3>
					<p class="bot-profile__status">{{ bot.statusText }}</p>
				</div>

				<div class="bot-profile__actions">
					<router-link tag="span" :to="{ name: 'bot-config', params: { bot: bot.name } }" class="bot-profile__action bot-profile__action--config">
						<font-awesome-icon icon="wrench"></font-awesome-icon>
					</router-link>
					<router-link tag="span" :to="{ name: 'bot-bgr', params: { bot: bot.name } }" class="bot-profile__action bot-profile__action--gbr">
						<font-awesome-icon icon="key"></font-awesome-icon>
					</router-link>

					<span class="bot-profile__action bot-profile__action--resume" v-if="bot.paused && bot.active" @click="resume"><font-awesome-icon icon="play"></font-awesome-icon></span>
					<span class="bot-profile__action bot-profile__action--pause" v-if="!bot.paused && bot.active" @click="pause"><font-awesome-icon icon="pause"></font-awesome-icon></span>
					<span class="bot-profile__action bot-profile__action--start" v-if="!bot.active" @click="start"><font-awesome-icon icon="power-off"></font-awesome-icon></span>
					<span class="bot-profile__action bot-profile__action--stop" v-if="bot.active" @click="stop"><font-awesome-icon icon="power-off"></font-awesome-icon></span>

					<router-link tag="span" :to="{ name: 'bot-delete', params: { bot: bot.name } }" class="bot-profile__action bot-profile__action--delete pull-right">
						<font-awesome-icon icon="trash"></font-awesome-icon>
					</router-link>
				</div>
			</div>

			<div class="bot-games" v-if="bot.games.length">
				<div class="bot-game" :class="[game.farming ? 'status--farming' : 'status--disabled']" v-for="game in bot.games">
					<div class="bot-game__info">
						<span class="bot-game__name">{{ game.GameName }}</span>
					</div>
					<div class="bot-game__background">
						<img class="bot-game__image" :src="`https://steamcdn-a.akamaihd.net/steam/apps/${game.AppID}/header.jpg`">
					</div>
				</div>
			</div>
		</template>
	</main>
</template>

<script>
	export default {
		name: 'bot',
		computed: {
			bot() {
				return this.$store.getters['bots/bot'](this.$route.params.bot);
			}
		},
		methods: {
			async pause() {
				try {
					const message = await this.$http.botAction(this.bot.name, 'pause', { permanent: true, resumeInSeconds: 0 });
					await this.$store.dispatch('bots/updateBot', { name: this.bot.name, paused: true });
				} catch (err) {
					this.$error(err.message);
				}

			},
			async resume() {
				try {
					const message = await this.$http.botAction(this.bot.name, 'resume');
					await this.$store.dispatch('bots/updateBot', { name: this.bot.name, paused: false });
				} catch (err) {
					this.$error(err.message);
				}
			},
			async start() {
				try {
					const message = await this.$http.botAction(this.bot.name, 'start');
					await this.$store.dispatch('bots/updateBot', { name: this.bot.name, active: true });
				} catch (err) {
					this.$error(err.message);
				}
			},
			async stop() {
				try {
					const message = await this.$http.botAction(this.bot.name, 'stop');
					await this.$store.dispatch('bots/updateBot', { name: this.bot.name, active: false, steamid: '0' });
				} catch (err) {
					this.$error(err.message);
				}
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

	.bot-profile__action {
		padding: 0.25em;
		margin: 0 0.1em;
		cursor: pointer;
		transition: color .3s;
		color: var(--color-text-disabled);

		&:hover {
			color: var(--color-text-dark);

			.app--dark-mode & {
				color: var(--color-text);
			}
		}
	}

	.bot-profile__action--start:hover,
	.bot-profile__action--resume:hover {
		color: green;
	}

	.bot-profile__action--pause:hover {
		color: orange;
	}

	.bot-profile__action--stop:hover,
	.bot-profile__action--delete:hover {
		color: red;
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
