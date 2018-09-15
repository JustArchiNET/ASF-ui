<template>
    <div class="app" :class="{ 'app--small-navigation': smallNavigation }">
        <app-header></app-header>
        <app-navigation></app-navigation>

        <section class="content">
            <router-view></router-view>
            <app-footer @click="smallNavigation = !smallNavigation"></app-footer>
        </section>
    </div>
</template>

<script>
  import AppHeader from './components/AppHeader.vue';
  import AppNavigation from './components/AppNavigation.vue';
  import AppFooter from './components/AppFooter.vue';

  import { mapGetters } from 'vuex';

  export default {
    name: 'App',
    components: { AppHeader, AppNavigation, AppFooter },
    computed: {
      ...mapGetters({ smallNavigation: 'layout/smallNavigation' })
    }
  };
</script>

<style lang="scss">
    @import './style/settings';
    @import './style/components';

    :root {
        --navigation-width: 15em;
        --navigation-height: 3em;
        --color-main: #{$color-theme-blue};
        --color-main-dark: #{darken($color-theme-blue, 2)};
        --color-text: #{$color-text};
        --color-text-dark: #{$color-text-dark};
        --color-text-secondary: #{darken($color-text, 10)};
        --color-text-disabled: #{darken($color-text, 25)};
        --color-box-border: #{$color-theme-blue};
        --color-border: #{darken($color-text, 25)};
        --color-background: #ecf0f5;
        --color-background-light: #fff;
        --color-navigation: #222d32;
        --color-navigation-dark: #{darken(#222d32, 3)};
        --color-navigation-darker: #{darken(#222d32, 10)};
    }

    html {
        height: 100%;
        font-family: "Source Sans Pro", "Helvetica Neue", Helvetica, Arial, sans-serif;
    }

    body {
        height: 100%;
        margin: 0;
    }

    ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
        background-color: #333;
    }

    ::-webkit-scrollbar-thumb {
        -webkit-border-radius: 2px;
        border-radius: 2px;
        background: rgb(167, 167, 167);
    }

    .app {
        width: 100%;
        background: var(--color-background);
    }

    .app--small-navigation {
        --navigation-width: 3em;
    }

    .content {
        padding-top: var(--navigation-height);
        padding-left: var(--navigation-width);
        transition: ease-in-out padding .3s;

        > main {
            min-height: calc(100vh - 2 * var(--navigation-height));
            box-sizing: border-box;
        }
    }
</style>