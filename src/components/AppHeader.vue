<template>
	<header class="upper-navigation">
		<navigation-brand></navigation-brand>

		<div class="navigation__button" @click="toggleNavigation">
			<font-awesome-icon icon="bars" fixed-width></font-awesome-icon>
		</div>

		<div class="navigation__menu">
			<navigation-language-switch></navigation-language-switch>

			<div class="navigation__button" @click="toggleSideMenu">
				<font-awesome-icon icon="cogs" fixed-width></font-awesome-icon>
			</div>
		</div>
	</header>
</template>

<script>
	import NavigationBrand from './NavigationBrand.vue';
	import NavigationLanguageSwitch from './NavigationLanguageSwitch.vue';

	import { mapActions } from 'vuex';

	export default {
		name: 'app-header',
		components: { NavigationBrand, NavigationLanguageSwitch },
		methods: {
			...mapActions({
				toggleNavigation: 'layout/toggleNavigation',
				toggleSideMenu: 'layout/toggleSideMenu'
			})
		}
	};
</script>

<style lang="scss">
	.upper-navigation {
		background: var(--color-theme);
		display: flex;
		height: var(--navigation-height);
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 1002;

		.app--boxed-layout & {
			@media screen and (min-width: 1250px) {
				position: absolute;
			}
		}
	}

	.navigation__button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 1em;
		cursor: pointer;
		color: var(--color-text);

		&.navigation__button--active, &:hover {
			background: var(--color-theme-dark);
		}
	}

	.navigation__menu {
		margin-left: auto;
		display: flex;
		justify-content: space-between;
	}
</style>
