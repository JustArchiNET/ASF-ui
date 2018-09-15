<template>
    <nav class="side-navigation">
        <navigation-category name="Home"></navigation-category>
        <navigation-link name="Statistics" icon="tachometer-alt" :to="{ name: 'statistics' }"></navigation-link>

        <navigation-category name="Control"></navigation-category>
        <navigation-link name="Commands" icon="laptop" :to="{ name: 'commands' }"></navigation-link>
        <navigation-link name="Bots" icon="users" :to="{ name: 'bots' }"></navigation-link>
        <navigation-link name="Log" icon="file-alt" :to="{ name: 'log' }"></navigation-link>

        <navigation-category name="Configuration"></navigation-category>
        <navigation-link name="Setup" icon="wrench" :to="{ name: 'setup' }"></navigation-link>
    </nav>
</template>

<script>
  import NavigationLink from './NavigationLink.vue';
  import NavigationCategory from './NavigationCategory.vue';

  export default {
    name: 'app-navigation',
    components: { NavigationLink, NavigationCategory }
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

        .app--small-navigation & {
            overflow: initial;
        }
    }
</style>