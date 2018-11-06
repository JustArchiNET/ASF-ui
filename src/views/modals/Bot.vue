<template>
	<main class="main-container main-container--modal main-container--bot-profile">
		<h2 class="title" v-if="!bot">{{ $t('not-found') }}</h2>

		<div class="bot-profile" :class="[`status--${bot.status}`]" v-else>
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
		<div
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
</style>
