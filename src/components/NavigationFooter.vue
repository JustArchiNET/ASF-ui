<template>
    <div class="navigation-footer">
        <div class="navigation-statistic">
            <span class="navigation-statistic__name">Memory usage</span>
            <span class="navigation-statistic__value">{{ memory }}</span>
        </div>
        <div class="navigation-statistic">
            <span class="navigation-statistic__name">Uptime</span>
            <span class="navigation-statistic__value">{{ uptime }}</span>
        </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'navigation-footer',
    computed: mapGetters({
      memory: 'status/memory',
      uptime: 'status/uptime',
    })
  };
</script>

<style lang="scss">
    .navigation-footer {
        margin-top: auto;
    }

    .navigation-statistic {
        padding: .75em 1em;
        background: rgba(black, 0.4);
        text-transform: uppercase;
        font-size: 0.9em;
        color: var(--color-text-disabled);
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: var(--navigation-width);

        .app--small-navigation & {
            display: none;
        }
    }
</style>