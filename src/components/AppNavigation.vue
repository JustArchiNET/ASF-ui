<template>
    <nav class="side-navigation">
        <template v-if="validPassword">
            <navigation-category name="Home"></navigation-category>
            <navigation-link name="Statistics" icon="tachometer-alt" :to="{ name: 'statistics' }"></navigation-link>

            <navigation-category name="Control"></navigation-category>
            <navigation-link name="Commands" icon="laptop" :to="{ name: 'commands' }"></navigation-link>
            <navigation-link name="Bots" icon="users" :to="{ name: 'bots' }"></navigation-link>
            <navigation-link name="Log" icon="file-alt" :to="{ name: 'log' }"></navigation-link>

            <navigation-category name="Configuration"></navigation-category>
            <navigation-link name="IPC" icon="wrench" :to="{ name: 'ipc-configuration' }"></navigation-link>

            <navigation-footer></navigation-footer>
        </template>

        <template v-else>
            <navigation-category name="Configuration"></navigation-category>
            <navigation-link name="Setup" icon="wrench" :to="{ name: 'setup' }"></navigation-link>
        </template>
    </nav>
</template>

<script>
  import NavigationLink from './NavigationLink.vue';
  import NavigationCategory from './NavigationCategory.vue';
  import NavigationFooter from './NavigationFooter.vue';

  import { mapGetters } from 'vuex';

  export default {
    name: 'app-navigation',
    components: { NavigationLink, NavigationCategory, NavigationFooter },
    computed: mapGetters({ validPassword: 'auth/validPassword' })
  };
</script>

<style lang="scss">
    .side-navigation {
        background: var(--color-navigation);
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        width: var(--navigation-width);
        padding-top: var(--navigation-height);
        z-index: 1001;
        transition: ease-in-out width .3s;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        .app--small-navigation & {
            overflow: initial;
        }
    }
</style>