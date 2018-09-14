<template>
    <router-link tag="div" :to="to" class="navigation-link" active-class="navigation-link--active" :exact="true">
        <font-awesome-icon :icon="icon" v-if="icon"></font-awesome-icon>
        <span>{{ name }}</span>
    </router-link>
</template>

<script>
    export default {
      props: {
        name: {
          type: String,
          required: true
        },
        to: {
          required: true
        },
        icon: String
      },
      name: 'navigation-link'
    }
</script>

<style lang="scss">
    .navigation-link {
        padding: .95em 1.25em;
        width: 100%;
        box-sizing: border-box;
        color: var(--color-text-secondary);
        transition: background .2s;
        cursor: pointer;
        display: flex;
        align-items: center;
        border-left: 3px solid transparent;

        &.navigation-link--active, &:hover {
            background: rgba(black, 0.2);
            color: var(--color-text);
        }

        &.navigation-link--active {
            border-color: var(--color-main);
        }

        > svg {
            margin-right: 0.5em;
        }
    }
</style>