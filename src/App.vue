<template>
  <div class="app" :class="[{ 'app--not-authorized': !authenticated, 'app--small-navigation': smallNavigation, 'app--boxed-layout': boxedLayout, 'app--dark-mode': darkMode }, themeClass]">
    <app-header></app-header>
    <app-navigation></app-navigation>
    <app-side-menu></app-side-menu>

    <section class="content">
      <router-view></router-view>
      <app-footer @click="smallNavigation = !smallNavigation"></app-footer>
    </section>

    <app-modal></app-modal>
    <vue-snotify></vue-snotify>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import AppHeader from './components/AppHeader.vue';
  import AppNavigation from './components/AppNavigation.vue';
  import AppFooter from './components/AppFooter.vue';
  import AppSideMenu from './components/AppSideMenu.vue';
  import AppModal from './components/AppModal.vue';

  export default {
    name: 'app',
    metaInfo: {
      title: 'ArchiSteamFarm',
      titleTemplate: 'ASF | %s',
    },
    components: {
      AppHeader, AppNavigation, AppFooter, AppSideMenu, AppModal,
    },
    computed: {
      ...mapGetters({
        authenticated: 'auth/authenticated',
        smallNavigation: 'layout/smallNavigation',
        sideMenu: 'layout/sideMenu',
        boxedLayout: 'layout/boxed',
        theme: 'layout/theme',
        darkMode: 'layout/darkMode',
        version: 'asf/version',
        buildVariant: 'asf/buildVariant',
      }),
      themeClass() {
        return `theme-${this.theme}`;
      },
    },
    watch: {
      darkMode: {
        immediate: true,
        handler: value => {
          document.documentElement.style.setProperty('--color-background-dark', value ? '#0c0c0c' : '#a7a7a7');
        },
      },
      $route: {
        immediate: true,
        handler: value => {
          document.body.style.overflowY = value.meta.modal ? 'hidden' : 'auto';
        },
      },
    },
    mounted() {
      window.addEventListener('resize', this.handleResize);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.handleResize);
    },
    methods: {
      ...mapActions({
        toggleNavigation: 'layout/toggleNavigation',
      }),
      handleResize() {
        const width = document.body.clientWidth;

        if ((width <= 700 && !this.smallNavigation) || (width > 700 && this.smallNavigation)) {
          this.toggleNavigation();
        }
      },
    },
  };
</script>

<style lang="scss">
	@import './style/settings';
	@import './style/components';

	:root {
		--navigation-width: #{$size-navigation};
		--navigation-height: #{$size-navigation-small};
		--color-theme: #{$color-theme-blue};
		--color-theme-dark: #{darken($color-theme-blue, 5)};
		--color-theme-light: #{lighten($color-theme-blue, 5)};
		--color-text: #{$color-text};
		--color-text-dark: #{$color-text-dark};
		--color-text-secondary: #{darken($color-text, 10)};
		--color-text-disabled: #{darken($color-text, 25)};
		--color-border: #{darken($color-text, 25)};
		--color-background: #ecf0f5;
		--color-background-modal: #ecf0f5;
		--color-background-light: #fff;
		--color-background-dark: #a7a7a7;
		--color-navigation: #222d32;
		--color-navigation-dark: #{darken(#222d32, 3)};
		--color-navigation-darker: #{darken(#222d32, 10)};

		--color-button-cancel: #{$color-theme-red};
		--color-button-cancel-active: #{lighten($color-theme-red, 5)};
		--color-button-default: #222d32;
	}

	html {
		font-family: "Source Sans Pro", "Helvetica Neue", Helvetica, Arial, sans-serif;
		font-size: 16px;
		height: 100%;
	}

	body {
		background: var(--color-background-dark);
		height: 100%;
		margin: 0;
	}

	@media screen and (max-height: 725px), screen and (max-width: 1366px) {
		html {
			font-size: 14px;
		}
	}

	@media screen and (max-height: 640px), screen and (max-width: 1000px) {
		html {
			font-size: 12px;
		}
	}

	::-webkit-scrollbar {
		background-color: #333;
		height: 10px;
		width: 10px;
	}

	::-webkit-scrollbar-thumb {
		background: var(--color-background-dark);
		border-radius: 2px;
	}

	a {
		text-decoration: none;
	}

	.app {
		background: var(--color-background);
		color: var(--color-text-dark);
		width: 100%;
		-webkit-overflow-scrolling: touch;
	}

	.app--small-navigation {
		--navigation-width: #{$size-navigation-small};
	}

	.app--boxed-layout {
		@media screen and (min-width: 1250px) {
			box-shadow: 0 0 25px 0 var(--color-navigation-dark);
			max-width: 1250px;
			margin: 0 auto;
			overflow-x: hidden;
			position: relative;
		}
	}

	.app--dark-mode {
		--color-background: #111;
		--color-background-light: #222;
		--color-background-modal: #2d2d2d;
		--color-text: #e0e0e0;
		--color-text-dark: #94999b;
		--color-border: rgba(0, 0, 0, .5);
		--color-text-secondary: #{darken(#bfbfbf, 10)};
		--color-text-disabled: #{darken(#bfbfbf, 20)};
		--color-button-default: #4f5454;
	}

	.theme-blue {
		--color-theme: #{$color-theme-blue};
		--color-theme-dark: #{darken($color-theme-blue, 5)};
		--color-theme-light: #{lighten($color-theme-blue, 5)};
	}

	.theme-red {
		--color-theme: #{$color-theme-red};
		--color-theme-dark: #{darken($color-theme-red, 5)};
		--color-theme-light: #{lighten($color-theme-red, 5)};
		--color-button-cancel: #{darken($color-theme-orange, 5)};
		--color-button-cancel-active: #{$color-theme-orange};
	}

	.theme-teal {
		--color-theme: #{$color-theme-teal};
		--color-theme-dark: #{darken($color-theme-teal, 5)};
		--color-theme-light: #{lighten($color-theme-teal, 5)};
	}

	.theme-purple {
		--color-theme: #{$color-theme-purple};
		--color-theme-dark: #{darken($color-theme-purple, 5)};
		--color-theme-light: #{lighten($color-theme-purple, 5)};
	}

	.theme-green {
		--color-theme: #{$color-theme-green};
		--color-theme-dark: #{darken($color-theme-green, 5)};
		--color-theme-light: #{lighten($color-theme-green, 5)};
	}

	.theme-orange {
		--color-theme: #{$color-theme-orange};
		--color-theme-dark: #{darken($color-theme-orange, 5)};
		--color-theme-light: #{lighten($color-theme-orange, 5)};
	}

	.content {
		box-sizing: border-box;
		display: grid;
		grid-template-rows: 1fr auto;
		grid-template-areas: 'main' 'footer';
		min-height: 100vh;
		padding-left: var(--navigation-width);
		padding-top: var(--navigation-height);
		position: relative;
		transition: ease-in-out padding .3s;

		> main {
			box-sizing: border-box;
			grid-area: main;
			min-width: 0;

			&.main-container--fullheight {
				height: calc(100vh - 2 * var(--navigation-height));
			}
		}

		@media screen and (max-width: 700px) {
			padding-left: $size-navigation-small;
		}
	}
</style>
