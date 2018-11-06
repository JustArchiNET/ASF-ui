<template>
	<div class="navigation-statistic">
        <span class="navigation-statistic__left-side">
            <span class="navigation-statistic__icon" v-if="icon"><font-awesome-icon :icon="icon" fixed-width :title="name"></font-awesome-icon></span>
            <span class="navigation-statistic__name">{{ name }}</span>
        </span>
		<span class="navigation-statistic__value">{{ value }}</span>
	</div>
</template>

<script>
	export default {
		name: 'navigation-statistic',
		props: {
			name: {
				type: String,
				required: true
			},
			value: {
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
	.navigation-statistic {
		padding: .75em 1em;
		text-transform: uppercase;
		color: var(--color-text-disabled);
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		box-sizing: border-box;
		white-space: nowrap;

		.app--small-navigation & {
			padding: .75em 0;

			.navigation-statistic__icon {
				display: inline-flex;
				width: var(--navigation-width);

				> svg {
					margin: 0 auto;
				}
			}

			.navigation-statistic__name {
				display: none;
			}

			.navigation-statistic__value {
				display: none;
			}

			&:hover {
				position: relative;
				background: var(--color-navigation-dark);
				color: var(--color-text);

				> .navigation-statistic__value {
					background: var(--color-navigation-dark);
					position: absolute;
					left: var(--navigation-width);
					height: 100%;
					display: flex;
					align-items: center;
					padding: 0 1.25em;
					border-radius: 0 4px 4px 0;
					white-space: nowrap;
				}
			}
		}

		svg {
			margin-right: 0.5em;
		}
	}

	.navigation-statistic__left-side {
		justify-content: space-between;
		margin-right: 0.5em;
	}

	.navigation-statistic__name {
		font-size: 0.9em;
	}
</style>
