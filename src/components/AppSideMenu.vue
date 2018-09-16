<template>
    <aside class="side-menu" :class="{ 'side-menu--hidden': !sideMenu }">

    </aside>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'app-side-menu',
    computed: mapGetters({ sideMenu: 'layout/sideMenu' })
  };
</script>

<style lang="scss">
    .side-menu {
        position: fixed;
        width: 15em;
        background: var(--color-navigation);
        z-index: 1001;
        top: 0;
        bottom: 0;
        right: -15em;
        transform: translate(-15em, 0);
        padding-top: var(--navigation-height);
        transition: transform ease-in-out .3s;
    }

    .side-menu--hidden {
        transform: none;
    }
</style>