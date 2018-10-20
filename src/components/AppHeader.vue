<template>
	<header class="upper-navigation">
		<navigation-brand></navigation-brand>

		<div class="navigation-button" @click="toggleNavigation">
			<font-awesome-icon icon="bars"></font-awesome-icon>
		</div>

		<div class="navigation-menu">
			<div class="navigation-button" @click="startTour">
				<font-awesome-icon icon="info-circle"></font-awesome-icon>
			</div>
			<div class="navigation-button" @click="toggleSideMenu">
				<font-awesome-icon icon="cogs"></font-awesome-icon>
			</div>
		</div>

		<v-tour name="guideTour" :steps="steps"></v-tour>
	</header>
</template>

<script>
	import NavigationBrand from './NavigationBrand.vue';

	import { mapActions } from 'vuex';

	export default {
		components: { NavigationBrand },
		name: 'app-header',
		data () {
			return {
				steps: [
					{
						target: '.brand',
						content: 'You can click here to access some hidden buttons.'
					},
					{
						target: '.navigation-button',
						content: 'Click here to open or close the side navigation.'
					}
				]
			}
		},
		methods: {
			...mapActions({
				toggleNavigation: 'layout/toggleNavigation',
				toggleSideMenu: 'layout/toggleSideMenu'
			}),
			startTour() {
				this.$tours['guideTour'].start()
			}
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

	.navigation-menu {
		margin-left: auto;
		display: flex;
		justify-content: space-between;
	}
</style>
