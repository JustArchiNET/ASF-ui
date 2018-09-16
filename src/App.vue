<template>
    <div class="app" :class="[{ 'app--small-navigation': smallNavigation, 'app--boxed-layout': boxedLayout, 'app--dark-mode': darkMode }, themeClass]">
        <app-header></app-header>
        <app-navigation></app-navigation>
        <app-side-menu></app-side-menu>

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
  import AppSideMenu from './components/AppSideMenu.vue';

  import { mapGetters } from 'vuex';

  export default {
    name: 'App',
    metaInfo: {
      title: 'ASF',
      titleTemplate: 'ASF | %s'
    },
    components: { AppHeader, AppNavigation, AppFooter, AppSideMenu },
    computed: {
      ...mapGetters({
        smallNavigation: 'layout/smallNavigation',
        sideMenu: 'layout/sideMenu',
        boxedLayout: 'layout/boxed',
        theme: 'layout/theme',
        darkMode: 'layout/darkMode'
      }),
      themeClass() {
        return `theme-${this.theme}`;
      }
    },
    watch: {
      darkMode: {
        immediate: true,
        handler: value => {
          document.documentElement.style.setProperty('--color-background-dark', value ? '#0c0c0c' : '#a7a7a7')
        }
      }
    }
  };
</script>

<style lang="scss">
    @import './style/settings';
    @import './style/components';

    :root {
        --navigation-width: 15rem;
        --navigation-height: 3rem;
        --color-theme: #{$color-theme-blue};
        --color-theme-dark: #{darken($color-theme-blue, 2)};
        --color-text: #{$color-text};
        --color-text-dark: #{$color-text-dark};
        --color-text-secondary: #{darken($color-text, 10)};
        --color-text-disabled: #{darken($color-text, 25)};
        --color-border: #{darken($color-text, 25)};
        --color-background: #ecf0f5;
        --color-background-light: #fff;
        --color-background-dark: #a7a7a7;
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
        background: var(--color-background-dark);
    }

    ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
        background-color: #333;
    }

    ::-webkit-scrollbar-thumb {
        -webkit-border-radius: 2px;
        border-radius: 2px;
        background: var(--color-background-dark);
    }

    .app {
        width: 100%;
        background: var(--color-background);
        color: var(--color-text-dark);
    }

    .app--small-navigation {
        --navigation-width: 3em;
    }

    .app--boxed-layout {
        position: relative;
        overflow-x: hidden;
        max-width: 1250px;
        margin: 0 auto;
        box-shadow: 0 0 25px 0 var(--color-navigation-dark);
    }

    .app--dark-mode {
        --color-background: #111;
        --color-background-light: #222;
        --color-text-dark: #94999b;
        --color-border: rgba(0,0,0,.5);
    }

    .theme-blue {
        --color-theme: #{$color-theme-blue};
        --color-theme-dark: #{darken($color-theme-blue, 5)};
    }

    .theme-red {
        --color-theme: #{$color-theme-red};
        --color-theme-dark: #{darken($color-theme-red, 5)};
    }

    .theme-teal {
        --color-theme: #{$color-theme-teal};
        --color-theme-dark: #{darken($color-theme-teal, 5)};
    }

    .theme-purple {
        --color-theme: #{$color-theme-purple};
        --color-theme-dark: #{darken($color-theme-purple, 5)};
    }

    .theme-green {
        --color-theme: #{$color-theme-green};
        --color-theme-dark: #{darken($color-theme-green, 5)};
    }

    .content {
        padding-top: var(--navigation-height);
        padding-left: var(--navigation-width);
        transition: ease-in-out padding .3s;
        position: relative;

        > main {
            min-height: calc(100vh - 2 * var(--navigation-height));
            box-sizing: border-box;

            &.main-container--fullheight {
                height: calc(100vh - 2 * var(--navigation-height));
            }
        }
    }
</style>