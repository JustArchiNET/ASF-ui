<template>
    <div class="navigation-category">
        <span>{{ name }}</span>
    </div>
</template>

<script>
  export default {
    props: {
      name: {
        type: String,
        required: true
      }
    },
    name: 'navigation-category'
  };
</script>

<style lang="scss">
    .navigation-category {
        padding: .75em 1em;
        width: 100%;
        box-sizing: border-box;
        background: rgba(black, 0.4);
        text-transform: uppercase;
        font-size: 0.9em;
        color: var(--color-text-disabled);
        display: flex;
        align-items: center;

        .app--small-navigation & {
            display: none;
        }
    }
</style>