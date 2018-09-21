<template>
	<div class="brand">
		<span class="brand__name brand__name--small"><b>A</b>SF</span>
		<span class="brand__name brand__name--big"><b>Archi</b>SteamFarm</span>
	</div>
</template>

<script>
	export default {
		name: 'navigation-brand'
	};
</script>

<style lang="scss">
	.brand {
		padding: 0 1em;
		background: var(--color-theme-dark);
		width: var(--navigation-width);
		color: var(--color-text);
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		height: var(--navigation-height);
		transition: ease-in-out width .3s;

		.app--small-navigation & {
			.brand__name--big {
				display: none;
			}

			.brand__name--small {
				display: block;
			}
		}
	}

	.brand__name {
		font-size: 1.25em;
	}

	.brand__name--small {
		display: none;
	}
</style>
