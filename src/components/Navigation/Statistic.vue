<template>
  <div class="navigation-statistic">
    <span class="navigation-statistic__left-side">
      <span v-if="icon" class="navigation-statistic__icon"><FontAwesomeIcon v-tooltip="name" :icon="icon" fixedWidth></FontAwesomeIcon></span>
      <span class="navigation-statistic__name">{{ name }}</span>
    </span>
    <span class="navigation-statistic__value">{{ value }}</span>
  </div>
</template>

<script>
  export default {
    name: 'NavigationStatistic',
    props: {
      name: {
        required: true,
        type: String,
      },
      value: {
        required: true,
        type: [String, Number],
      },
      icon: {
        required: true,
        type: String,
      },
    },
  };
</script>

<style lang="scss">
	.navigation-statistic {
		align-items: center;
		box-sizing: border-box;
		color: var(--color-text-disabled);
		display: flex;
		justify-content: space-between;
		padding: 0.75em 0.5em;
		text-transform: uppercase;
		white-space: nowrap;
		width: 100%;

		.app--small-navigation & {
			padding: 0.75em 0;

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
				background: var(--color-navigation-dark);
				color: var(--color-text);
				position: relative;

				> .navigation-statistic__value {
					align-items: center;
					background: var(--color-navigation-dark);
					border-radius: 0 4px 4px 0;
					display: flex;
					height: 100%;
					left: var(--navigation-width);
					padding: 0 1.25em;
					position: absolute;
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
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.navigation-statistic__name {
		font-size: 0.9em;
	}
</style>
