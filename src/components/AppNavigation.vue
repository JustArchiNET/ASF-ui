<template>
    <nav class="side-navigation">
        <template v-if="validPassword">
            <div class="navigation-category">
                <navigation-category-title name="Control"></navigation-category-title>
                <navigation-link name="Home" icon="home" :to="{ name: 'home' }"></navigation-link>
                <navigation-link name="Commands" icon="laptop" :to="{ name: 'commands' }"></navigation-link>
                <navigation-link name="Bots" icon="users" :to="{ name: 'bots' }"></navigation-link>
                <navigation-link name="Log" icon="file-alt" :to="{ name: 'log' }"></navigation-link>
            </div>


            <div class="navigation-category">
                <navigation-category-title name="Configuration"></navigation-category-title>
                <navigation-link name="IPC" icon="wrench" :to="{ name: 'ipc-configuration' }"></navigation-link>
            </div>

            <div class="navigation-category navigation-category--pull-bottom">
                <navigation-category-title name="Statistics"></navigation-category-title>
                <navigation-bots></navigation-bots>
                <navigation-statistic name="Memory usage" :value="memory"></navigation-statistic>
                <navigation-statistic name="Uptime" :value="uptime"></navigation-statistic>
            </div>
        </template>

        <template v-else>
            <div class="navigation-category">
                <navigation-category-title name="Configuration"></navigation-category-title>
                <navigation-link name="Setup" icon="wrench" :to="{ name: 'setup' }"></navigation-link>
            </div>
        </template>
    </nav>
</template>

<script>
  import NavigationLink from './NavigationLink.vue';
  import NavigationCategoryTitle from './NavigationCategoryTitle.vue';
  import NavigationBots from './NavigationBots.vue';
  import NavigationStatistic from './NavigationStatistic.vue';

  import { mapGetters } from 'vuex';

  export default {
    name: 'app-navigation',
    components: { NavigationLink, NavigationCategoryTitle, NavigationStatistic, NavigationBots },
    computed: mapGetters({
      validPassword: 'auth/validPassword',
      memory: 'status/memory',
      uptime: 'status/uptime'
    })
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

    .navigation-category--pull-bottom {
        margin-top: auto;
    }
</style>