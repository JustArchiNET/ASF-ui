<template>
	<header class="upper-navigation">
		<navigation-brand></navigation-brand>

		<div class="navigation-button" @click="toggleNavigation">
			<font-awesome-icon icon="bars"></font-awesome-icon>
		</div>

		<div class="navigation-button navigation-button--pull-right" @click="toggleSideMenu">
			<font-awesome-icon icon="cogs"></font-awesome-icon>
		</div>
	</header>
</template>

<script>
	import NavigationBrand from './NavigationBrand.vue';

	import { mapActions } from 'vuex';

	export default {
		components: { NavigationBrand },
		name: 'app-header',
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
			position: absolute;
		}
	}

	.navigation-button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 1em;
		cursor: pointer;
		color: var(--color-text);

		&.navigation-button--active, &:hover {
			background: var(--color-theme-dark);
		}
	}

	.navigation-button--pull-right {
		margin-left: auto;
	}
</style>
