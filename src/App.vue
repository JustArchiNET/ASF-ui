<template>
    <div class="app">
        <app-header></app-header>
        <app-navigation></app-navigation>

        <router-view></router-view>

        <app-footer></app-footer>
    </div>
</template>

<script>
  import AppHeader from './components/AppHeader.vue';
  import AppNavigation from './components/AppNavigation.vue';
  import AppFooter from './components/AppFooter.vue';

  export default {
    name: 'App',
    components: { AppHeader, AppNavigation, AppFooter }
  };
</script>

<style lang="scss">
    @import './style/settings';
    @import './style/components';

    :root {
        --navigation-width: 15em;
        --color-main: #{$color-theme-blue};
        --color-darker: #{darken($color-theme-blue, 2)};
        --color-text: #fff;
        --color-text-secondary: #{darken(#fff, 10)};
        --color-text-disabled: #{darken(#fff, 25)};
        --color-background: #ecf0f5;
        --color-navigation: #222d32;
    }

    html {
        height: 100%;
        font-family: "Source Sans Pro", "Helvetica Neue", Helvetica, Arial, sans-serif;
    }

    body {
        height: 100%;
        margin: 0;
    }

    .app {
        width: 100%;
        min-height: 100%;
        background: var(--color-background);

        display: grid;
        grid-template-columns: var(--navigation-width) auto;
        grid-template-rows: auto 1fr auto;
        grid-template-areas: 'side-navigation upper-navigation' 'side-navigation content' 'side-navigation footer';
    }
</style>