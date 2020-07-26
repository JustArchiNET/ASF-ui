<template>
  <div class="bots">
    <bot-card v-for="bot in bots" v-if="bot.isVisible(selectedBots)" :key="bot.name" :bot="bot"></bot-card>

    <router-link tag="div" :to="{ name: 'bot-create' }" class="bot-placeholder status--disabled" :class="{ 'bot-placeholder--big': selectedButtonsCount > 2 }">
      <div class="bot-placeholder__button bot-placeholder__button--add">
        <font-awesome-icon icon="plus" class="bot-placeholder__icon"></font-awesome-icon>
        <span class="bot-placeholder__name">{{ $t('bot-new') }}</span>
      </div>
    </router-link>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import BotCard from './BotCard.vue';

  export default {
    name: 'asf-bots',
    components: { BotCard },
    computed: {
      ...mapGetters({
        bots: 'bots/bots',
        selectedBots: 'settings/selectedBots',
        favButtons: 'settings/favButtons',
      }),
      selectedButtonsCount() {
        return Array.from(this.favButtons.toString(2)).length;
      },
    },
  };
</script>

<style lang="scss">
	.bots {
		display: grid;
		grid-gap: 1em;
		grid-template-columns: repeat(auto-fill, minmax(225px, 1fr));
		min-height: 0;
		margin-bottom: 1em;

		@media screen and (max-width: 400px) {
			grid-template-columns: 1fr;
		}
	}

	.bot-placeholder {
		align-items: center;
		background: var(--color-background-light);
		border-radius: 0 0 4px 4px;
		border-top: 3px solid var(--color-status);
		cursor: pointer;
		display: flex;
		height: 2.25em;
		justify-content: center;
		padding: 0.5em;
		transition: border .3s;

		&--big {
			font-size: 1.25rem;
			height: auto;
		}
	}

	.bot-placeholder__button {
		align-items: center;
		display: flex;
	}

	.bot-placeholder__name {
		font-size: 0.8em;
		font-weight: 600;
	}

	.bot-placeholder__icon {
		margin-right: 0.5em;
	}
</style>
