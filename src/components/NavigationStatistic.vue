<template>
    <div class="navigation-statistic">
        <div class="left-side">
            <span class="navigation-statistic__icon" v-if="icon"><font-awesome-icon :icon="icon" fixed-width></font-awesome-icon></span>
            <span class="navigation-statistic__name">{{ name }}</span>
        </div>
        <span class="navigation-statistic__value">{{ value }}</span>
    </div>
</template>

<script>
  export default {
    name: 'navigation-statistic',
    props: {
      name: {
        type: String,
        required: true
      },
      value: {
        required: true
      },
      icon: {
        type: String,
        required: true
      }
    }
  };
</script>

<style lang="scss">
    .navigation-statistic {
        padding: .75em 1em;
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

    .left-side {
        justify-content: space-between;
    }

    .navigation-statistic__icon {
        > svg {
            margin-right: 0.5em;
        }
    }
</style>