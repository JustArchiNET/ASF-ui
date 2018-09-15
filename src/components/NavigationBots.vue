<template>
    <div class="bot-cards">
        <div class="bot-card status--farming">
            <span class="bot-card__value">{{ botsCount('farming') }}</span>
            <span class="bot-card__name">Farming</span>
        </div>
        <div class="bot-card status--idling">
            <span class="bot-card__value">{{ botsCount('idling') }}</span>
            <span class="bot-card__name">Idling</span>
        </div>
        <div class="bot-card status--disabled">
            <span class="bot-card__value">{{ botsCount('disabled') }}</span>
            <span class="bot-card__name">Disabled</span>
        </div>
        <div class="bot-card status--offline">
            <span class="bot-card__value">{{ botsCount('offline') }}</span>
            <span class="bot-card__name">Offline</span>
        </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'navigation-bots',
    computed: mapGetters({
      botsCount: 'status/botsCount'
    })
  };
</script>

<style lang="scss">
    .bot-cards {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 0.5em;
        padding: 0.5em;

        .app--small-navigation & {
            grid-template-columns: 1fr;

            .bot-card__name {
                display: none;
            }
        }
    }

    .bot-card {
        padding: 0.5em;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 2px;
        color: var(--color-text);
        text-shadow: 0 0 1px var(--color-text-dark);
        background: var(--color-status);
    }

    .bot-card__value {
        font-weight: 600;
        font-size: 1.2em;
    }

    .bot-card__name {
        font-size: 0.9em;
    }
</style>