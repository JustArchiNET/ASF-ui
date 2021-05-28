<template>
  <aside id="side-menu" class="side-menu" :class="{ 'side-menu--hidden': !sideMenu }">
    <SideMenuSwitch class="side-menu__switch--boxed" :name="$t('sidebar-boxed-layout')" icon="square" :checked="boxedLayout" @click="toggleBoxed"></SideMenuSwitch>
    <SideMenuSwitch :name="$t('sidebar-dark-mode')" icon="moon" :checked="darkMode" @click="toggleDarkMode"></SideMenuSwitch>

    <div class="side-menu__category">
      <FontAwesomeIcon icon="palette" fixed-width></FontAwesomeIcon>
      <span>{{ $t('sidebar-theme') }}</span>
    </div>

    <div class="theme-switcher">
      <div v-for="(theme, i) in availableThemes" :key="i" class="theme-switcher__theme" :class="[`theme-${theme}`]" @click="changeTheme(theme)"></div>
    </div>

    <div class="side-menu___info">
      <span v-html="$t('sidebar-info')"></span>
    </div>
  </aside>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import SideMenuSwitch from './SideMenuSwitch.vue';

  export default {
    name: 'AppSideMenu',
    components: { SideMenuSwitch },
    computed: mapGetters({
      sideMenu: 'layout/sideMenu',
      availableThemes: 'layout/availableThemes',
      boxedLayout: 'layout/boxed',
      darkMode: 'layout/darkMode',
    }),
    methods: {
      ...mapActions({
        changeTheme: 'layout/changeTheme',
        toggleBoxed: 'layout/toggleBoxed',
        toggleDarkMode: 'layout/toggleDarkMode',
      }),
    },
  };
</script>

<style lang="scss">
	.side-menu {
		background: var(--color-navigation);
		bottom: 0;
		padding-top: var(--navigation-height);
		position: fixed;
		right: -15em;
		top: 0;
		transition: transform ease-in-out .3s;
		transform: translate(-15em, 0);
		width: 15em;
		z-index: 1001;

		.app--boxed-layout & {
			@media screen and (min-width: 1250px) {
				position: absolute;
			}
		}
	}

	.side-menu--hidden {
		transform: none;
	}

	.theme-switcher {
		display: grid;
		grid-gap: 0.5em;
		grid-template-columns: repeat(6, 1fr);
		padding: 1em;
	}

	.theme-switcher__theme {
		background: var(--color-theme);
		border: 3px solid var(--color-theme);
		border-radius: 4px;
		box-sizing: border-box;
		cursor: pointer;
		height: 20px;
		margin: auto;
		transition: background .3s;
		width: 20px;

		&:hover {
			background: var(--color-theme-dark);
		}
	}

	.side-menu__category {
		box-sizing: border-box;
		color: var(--color-text-secondary);
		margin: 1em 0 0.5em;
		padding: 0 1em;
	}

	.side-menu__switch--boxed {
		@media screen and (max-width: 1249px) {
			display: none;
		}
	}

  .side-menu__info {
    bottom: 0;
    padding: 1em 0.5em;
    position: absolute;
    text-align: center;
    margin-bottom: 0.5em;

    a {
      color: var(--color-theme);
    }
  }
</style>
