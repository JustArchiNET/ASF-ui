<template>
  <div class="bots">
    <div v-for="bot in bots" :key="bot.name" class="bot" :class="[`status--${bot.status}`, selectedBots.includes(bot.name) ? 'selected' : null]">
      <a v-if="bot.steamid !== '0'" target="_blank" rel="noreferrer noopener" :href="bot.profileURL">
        <img class="bot__avatar" :src="bot.avatarURL" :alt="bot.name">
      </a>
      <img class="bot__avatar" :src="bot.avatarURL">

      <div class="bot__status" @click="updateSelectedBots(bot.name)">
        <span :title="bot.name" class="bot__status-property bot__status-property--name">{{ bot.viewableName }}</span>
        <span class="bot__status-property bot__status-property--text">{{ bot.statusText }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'EditorBots',
    data() {
      return {
        selectedBots: [],
      };
    },
    computed: {
      ...mapGetters({
        bots: 'bots/bots',
      }),
    },
    methods: {
      updateSelectedBots(botName) {
        if (!this.selectedBots.includes(botName)) this.selectedBots.push(botName);
        else this.selectedBots = this.selectedBots.filter(name => name !== botName);

        this.$emit('update', this.selectedBots);
      },
    },
  };
</script>

<style lang="scss">
	.bots {
		display: grid;
		grid-gap: 1em;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		min-height: 0;

		@media screen and (max-width: 400px) {
			grid-template-columns: 1fr;
		}
	}

	.bot {
		background: var(--color-background-light);
		border-radius: 0 0 4px 4px;
		border-top: 3px solid var(--color-status);
		display: grid;
		grid-template-areas: 'avatar meta buttons';
		grid-template-columns: min-content 1fr auto;
		padding: 0.5em;
		transition: border .3s;
	}

  .selected {
    color: green;
  }

	.bot__avatar {
		cursor: pointer;
		display: block;
		height: 2.25em;
		padding-right: 0.5em;
		width: 2.25em;
	}

	.bot__status {
		cursor: pointer;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.bot__status-property {
		display: inline-block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.bot__status-property--name {
		font-weight: 600;
	}

	.bot__status-property--text {
		font-size: 0.8em;
		font-style: italic;
	}
</style>
