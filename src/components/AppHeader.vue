<template>
    <header class="upper-navigation">
        <navigation-brand></navigation-brand>

        <div class="navigation-button" @click="toggleNavigation">
            <font-awesome-icon icon="bars" />
        </div>
    </header>
</template>

<script>
  import NavigationBrand from './NavigationBrand.vue';

  import { mapMutations } from 'vuex';

  export default {
    components: { NavigationBrand },
    name: 'app-header',
    methods: {
      ...mapMutations({ toggleNavigation: 'layout/toggleNavigation' })
    }
  };
</script>

<style lang="scss">
    .upper-navigation {
        background: var(--color-main);
        display: flex;
        height: var(--navigation-height);
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 1002;
    }

    .navigation-button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 1em;
        cursor: pointer;
        color: var(--color-text);

        &.navigation-button--active, &:hover {
            background: var(--color-main-dark);
        }
    }
</style>