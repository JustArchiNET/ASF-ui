<template>
	<main class="main-container">
		<h2 class="title">Bots</h2>

		<div class="bots">
			<div class="bot" v-for="bot in bots" :class="[`status--${bot.status}`]">
				<a target="_blank" :href="bot.profileURL">
					<img class="bot__avatar" :src="bot.avatarURL">
				</a>

				<div class="bot__status">
					<router-link tag="span" :to="{ name: 'bot', params: { bot: bot.name } }" class="bot__status-property bot__status-property--name">{{ bot.name }}</router-link>
					<span class="bot__status-property bot__status-property--text">{{ bot.statusText }}</span>
				</div>

				<div class="bot__actions">
					<router-link tag="span" :to="{ name: 'bot', params: { bot: bot.name } }" class="bot__action bot__action--config"><font-awesome-icon icon="wrench"></font-awesome-icon></router-link>
					<span class="bot__action bot__action--resume" v-if="bot.paused && bot.active" @click="resume(bot)"><font-awesome-icon icon="play"></font-awesome-icon></span>
					<span class="bot__action bot__action--pause" v-if="!bot.paused && bot.active" @click="pause(bot)"><font-awesome-icon icon="pause"></font-awesome-icon></span>
					<span class="bot__action bot__action--start" v-if="!bot.active" @click="start(bot)"><font-awesome-icon icon="power-off"></font-awesome-icon></span>
					<span class="bot__action bot__action--stop" v-if="bot.active" @click="stop(bot)"><font-awesome-icon icon="power-off"></font-awesome-icon></span>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
	import { botAction } from '../utils/http';

	import { mapGetters } from 'vuex';

	export default {
		name: 'bots',
		metaInfo: { title: 'Bots' },
		components: {},
		computed: mapGetters({
			bots: 'bots/bots'
		}),
		methods: {
			async pause(bot) {
				const message = await botAction(bot.name, 'pause', { permanent: true, resumeInSeconds: 0 });
				await this.$store.dispatch('bots/updateBot', { name: bot.name, paused: true });
			},
			async resume(bot) {
				const message = await botAction(bot.name, 'resume');
				await this.$store.dispatch('bots/updateBot', { name: bot.name, paused: false });
			},
			async start(bot) {
				const message = await botAction(bot.name, 'start');
				await this.$store.dispatch('bots/updateBot', { name: bot.name, active: true });
			},
			async stop(bot) {
				const message = await botAction(bot.name, 'stop');
				await this.$store.dispatch('bots/updateBot', { name: bot.name, active: false, steamid: '0' });
			}
		}
	};
</script>

<style lang="scss">
	.bots {
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		grid-gap: 1em;
		display: grid;
	}

	.bot {
		display: grid;
		grid-template-columns: auto 1fr auto;
		border-top: 3px solid var(--color-status);
		padding: 0.5em;
		background: var(--color-background-light);
		border-radius: 0 0 4px 4px;
		transition: border .3s;
	}

	.bot__avatar {
		min-width: 2.25em;
		margin-right: 0.5em;
		max-height: 100%;
	}

	.bot__status {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.bot__status-property {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		display: inline-block;
	}

	.bot__status-property--name {
		font-weight: 600;
		cursor: pointer;
	}

	.bot__status-property--text {
		font-size: 0.8em;
		font-style: italic;
	}

	.bot__actions {
		display: flex;
		align-items: center;
	}

	.bot__action {
		padding: 0.5em;
		cursor: pointer;
		transition: color .3s;
		color: var(--color-text-disabled);

		&:hover {
			color: var(--color-text-dark);
		}
	}

	.bot__action--resume:hover {
		color: green;
	}

	.bot__action--pause:hover {
		color: orange;
	}

	.bot__action--stop:hover {
		color: red;
	}

	.bot__action--start:hover {
		color: green;
	}
</style>
