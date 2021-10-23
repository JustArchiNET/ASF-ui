<template>
  <div class="bots">
    <BotCard v-for="bot in visibleBots" :key="bot.name" :bot="bot"></BotCard>

    <router-link v-slot="{ navigate }" custom :to="{ name: 'bot-create' }">
      <div class="bot-placeholder status--disabled" :class="{ 'bot-placeholder--big': selectedButtonsCount > 2 }" @click="navigate">
        <div class="bot-placeholder__button bot-placeholder__button--add">
          <FontAwesomeIcon icon="plus" class="bot-placeholder__icon"></FontAwesomeIcon>
          <span class="bot-placeholder__name">{{ $t('bot-new') }}</span>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import BotCard from '../Bot/Card.vue';
  import { BotStatus } from '../../models/Bot';

  export default {
    name: 'AsfBots',
    components: { BotCard },
    computed: {
      ...mapGetters({
        bots: 'bots/bots',
        selectedBots: 'settings/selectedBots',
        favButtons: 'settings/favButtons',
        orderDisabledBotsLast: 'settings/orderDisabledBotsLast',
      }),
      selectedButtonsCount() {
        return Array.from(this.favButtons.toString(2)).length;
      },
      visibleBots() {
        const visibleBots = this.bots.filter(bot => bot.isVisible(this.selectedBots));
        if (this.orderDisabledBotsLast) return visibleBots.sort(this.sortByStatus());
        return visibleBots;
      },
    },
    methods: {
      sortByStatus() {
        // eslint-disable-next-line func-names
        return function(a, b) {
          if (a.status === b.status) return 0;

          // oh lord forgive me - i have no idea what i'm doing but it works...
          switch (a.status) {
            case BotStatus.FARMING:
              if (b.status === BotStatus.ONLINE) return -1;
              if (b.status === BotStatus.OFFLINE) return -1;
              break;

            case BotStatus.ONLINE:
              if (b.status === BotStatus.OFFLINE) return -1;
              if (b.status === BotStatus.DISABLED) return -1;
              break;

            case BotStatus.OFFLINE:
              if (b.status === BotStatus.DISABLED) return -1;
              break;
          }

          return 1;
        };
      },
    },
  };
</script>

<style lang="scss">
	.bots {
		display: grid;
		grid-gap: 1em;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		min-height: 0;
		margin-bottom: 1em;

    @media screen and (max-width: 1366px) {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }

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
