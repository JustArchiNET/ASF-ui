<template>
  <div v-if="bot.games.length && botsFarmingCount !== 0" :class="[gameName ? 'bot-games-text' : 'bot-games']">
    <template v-if="gameName">
      <div v-html="games"></div>
    </template>

    <template v-else>
      <div v-for="(game, i) in bot.games" :key="i" v-tooltip="game.GameName" class="bot-game" :class="[game.farming ? 'status--farming' : 'status--disabled']">
        <a target="_blank" rel="noreferrer noopener" :href="`https://store.steampowered.com/app/${game.AppID}/`">
          <div class="bot-game__info">
            <span class="bot-game__name">{{ game.GameName }}</span>
          </div>
          <div class="bot-game__background">
            <img class="bot-game__image" :src="`https://steamcdn-a.akamaihd.net/steam/apps/${game.AppID}/header.jpg`">
          </div>
        </a>
      </div>
    </template>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'BotGames',
    props: {
      bot: Object,
    },
    computed: {
      ...mapGetters({
        botsFarmingCount: 'bots/botsFarmingCount',
        gameName: 'settings/gameName',
      }),
      games() {
        let html = '';

        this.bot.games.forEach(game => {
          const aTag = `<a class="text-dark" target="_blank" rel="noreferrer noopener" href="https://store.steampowered.com/app/${game.AppID}/">${game.GameName}</a>`;
          html = `${html + aTag}, `;
        });

        return html.slice(0, -2);
      },
    },
  };
</script>

<style lang="scss">
  .bot-games {
    display: grid;
    font-size: 0.8em;
    grid-gap: 0.25em;
    grid-template-columns: repeat(3, 1fr);
    margin: 1em 0 0;
    width: 100%;

    @media screen and (max-width: 1200px) {
      font-size: 1em;
      grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width: 530px) {
      font-size: 1.2em;
      grid-template-columns: none;
    }
  }

  .bot-game {
    min-width: 0;
    position: relative;
    width: 100%;
  }

  .bot-game__info {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    left: 0;
    padding: 1em;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 2;
  }

  .bot-game__name {
    color: var(--color-text);
    font-weight: bold;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }

  .bot-game__background {
    border: 2px solid var(--color-status);
    border-radius: 4px;
    box-sizing: border-box;
    line-height: 0;
    overflow: hidden;
    z-index: 1;
  }

  .bot-game__image {
    filter: blur(1px) brightness(0.4);
    width: 100%;
  }

  .text-dark {
    color: var(--color-text-dark)
  }

  .bot-games-text {
    display: flex;
    margin: 1em 0 0;
    width: 100%;
  }
</style>
