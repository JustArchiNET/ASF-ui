<template>
  <div class="bots">
    <div v-for="bot in bots" :key="bot.name" class="bot" :class="[`status--${bot.status}`, { selected: botIsSelected(bot) }]" @click="select(bot)">
      <img class="bot__avatar" :class="{ selectable }" :src="bot.avatarURL">

      <div class="bot__status" :class="{ selectable }">
        <span :title="bot.name" class="bot__status-property bot__status-property--name">{{ bot.viewableName }}</span>
        <span class="bot__status-property bot__status-property--text">{{ bot.statusText }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MassEditorBots',
    props: {
      selectedBotNames: { type: Array },
      selectable: { type: Boolean, default: true },
      bots: { type: Array },
    },
    methods: {
      select(bot) {
        if (this.selectable) this.$emit('update', bot);
      },
      botIsSelected(bot) {
        if (this.selectable) return this.selectedBotNames.includes(bot.name);
        return false;
      },
    },
  };
</script>

<style lang="scss" scoped>
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
    color: var(--color-theme);
    border: 1px solid var(--color-theme);
    border-top: 3px solid var(--color-status);
  }

  .selectable {
    cursor: pointer;
  }

	.bot__avatar {
		display: block;
		height: 2.25em;
		padding-right: 0.5em;
		width: 2.25em;
	}

	.bot__status {
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
