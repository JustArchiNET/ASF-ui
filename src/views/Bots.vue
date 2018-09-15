<template>
    <main class="main-container">
        <h2 class="title">Bots</h2>

        <div class="bots">
            <div class="bot" v-for="bot in bots" :class="[`status--${bot.status}`]">
                <img class="bot__avatar" :src="bot.avatarURL">
                <span class="bot__name">{{ bot.name }}</span>

                <div class="bot-actions">
                    <span class="bot-action"><font-awesome-icon icon="wrench"></font-awesome-icon></span>
                    <span class="bot-action" v-if="bot.paused && bot.active" @click="resume(bot)"><font-awesome-icon icon="play"></font-awesome-icon></span>
                    <span class="bot-action" v-if="!bot.paused && bot.active" @click="pause(bot)"><font-awesome-icon icon="pause"></font-awesome-icon></span>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
  import { command } from '../utils/http';

  import { mapGetters } from 'vuex';

  export default {
    name: 'bots',
    components: {},
    computed: mapGetters({
      bots: 'status/bots'
    }),
    methods: {
      async pause(bot) {
        const response = await command('pause', bot.name);
        console.log(response);
      },
      async resume(bot) {
        const response = await command('resume', bot.name);
        console.log(response);
      }
    }
  };
</script>

<style lang="scss">
    .bots {
        display: flex;
        flex-flow: row wrap;
        margin: -0.5em;
    }

    .bot {
        display: flex;
        width: 220px;
        flex-grow: 1;
        border-top: 3px solid var(--color-status);
        padding: 0.5em;
        margin: 0.5em;
        background: var(--color-background-light);
        border-radius: 0 0 4px 4px;
        align-items: center;
    }

    .bot__avatar {
        width: 30px;
        height: 30px;
        margin-right: 0.5em;
    }

    .bot-actions {
        margin-left: auto;
    }

    .bot-action {
        padding: 0.5em;
        cursor: pointer;
        transition: color .5s;
        color: var(--color-text-disabled);

        &:hover {
            color: var(--color-text-dark);
        }
    }
</style>