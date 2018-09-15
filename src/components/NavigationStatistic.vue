<template>
    <div class="navigation-statistic">
        <span class="navigation-statistic__name">{{ name }}</span>
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
</style>