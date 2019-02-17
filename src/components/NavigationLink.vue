<template>
	<router-link :to="to" :href="$router.resolve(to).href" class="navigation-link" active-class="navigation-link--active" :exact="true">
		<span class="navigation-link__icon" v-if="icon"><font-awesome-icon :icon="icon" fixed-width></font-awesome-icon></span>
		<span class="navigation-link__name">{{ name }}</span>
	</router-link>
</template>

<script>
	export default {
		name: 'navigation-link',
		props: {
			name: {
				type: String,
				required: true
			},
			to: {
				required: true
			},
			icon: {
				type: String,
				required: true
			}
		}
	};
</script>

<style lang="scss">
	.navigation-link {
		align-items: center;
		border-left: 3px solid transparent;
		box-sizing: border-box;
		color: var(--color-text-secondary);
		cursor: pointer;
		display: flex;
		padding: .95em 1.25em;
		text-decoration: none;
		transition: background .2s;
		white-space: nowrap;
		width: 100%;

		&.navigation-link--active, &:hover {
			background: var(--color-navigation-dark);
			color: var(--color-text);
		}

		&.navigation-link--active {
			border-color: var(--color-theme);
		}

		.app--small-navigation & {
			padding: .95em 0;

			.navigation-link__icon {
				display: inline-flex;
				width: var(--navigation-width);

				> svg {
					margin: 0 auto;
				}
			}

			.navigation-link__name {
				display: none;
			}

			&:hover {
				position: relative;

				> .navigation-link__name {
					align-items: center;
					background: var(--color-navigation-dark);
					border-radius: 0 4px 4px 0;
					display: flex;
					height: 100%;
					left: calc(var(--navigation-width) - 3px);
					padding: 0 1.25em;
					position: absolute;
				}
			}
		}

		svg {
			margin-right: 0.5em;
		}
	}
</style>
