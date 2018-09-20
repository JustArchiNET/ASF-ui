<template>
	<aside class="side-menu" :class="{ 'side-menu--hidden': !sideMenu }">
		<side-menu-switch name="Boxed layout" icon="square" :checked="boxedLayout" @click="toggleBoxed"></side-menu-switch>
		<side-menu-switch name="Dark mode" icon="moon" :checked="darkMode" @click="toggleDarkMode"></side-menu-switch>

		<div class="side-menu__category">
			<font-awesome-icon icon="palette" fixed-width></font-awesome-icon>
			<span>Theme</span>
		</div>

		<div class="theme-switcher">
			<div class="theme-switcher__theme" :class="[`theme-${theme}`]" v-for="theme in availableThemes" @click="changeTheme(theme)"></div>
		</div>
	</aside>
</template>

<script>
	import { mapActions, mapGetters } from 'vuex';

	import SideMenuSwitch from './SideMenuSwitch.vue';

	export default {
		name: 'app-side-menu',
		components: { SideMenuSwitch },
		computed: mapGetters({
			sideMenu: 'layout/sideMenu',
			availableThemes: 'layout/availableThemes',
			boxedLayout: 'layout/boxed',
			darkMode: 'layout/darkMode'
		}),
		methods: mapActions({
			changeTheme: 'layout/changeTheme',
			toggleBoxed: 'layout/toggleBoxed',
			toggleDarkMode: 'layout/toggleDarkMode'
		})
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

		.app--boxed-layout & {
			position: absolute;
		}
	}

	.side-menu--hidden {
		transform: none;
	}

	.theme-switcher {
		padding: 1em;
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		grid-gap: 0.5em;
	}

	.theme-switcher__theme {
		width: 20px;
		height: 20px;
		box-sizing: border-box;
		background: var(--color-theme);
		margin: auto;
		cursor: pointer;
		transition: background .3s;
		border-radius: 4px;
		border: 3px solid var(--color-theme);

		&:hover {
			background: var(--color-theme-dark);
		}
	}

	.side-menu__category {
		padding: 0 1em;
		margin: 1em 0 0.5em;
		box-sizing: border-box;
		color: var(--color-text-secondary);
	}

</style>
