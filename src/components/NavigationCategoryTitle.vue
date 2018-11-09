<template>
	<div class="navigation-category__title">
		<span>{{ name }}</span>
	</div>
</template>

<script>
	export default {
		name: 'navigation-category__title',
		props: {
			name: {
				type: String,
				required: true
			}
		}
	};
</script>

<style lang="scss">
	.navigation-category__title {
		padding: .75em 1em;
		width: var(--navigation-width);
		background: rgba(black, 0.4);
		text-transform: uppercase;
		font-size: 0.9em;
		color: var(--color-text-disabled);
		display: flex;
		align-items: center;

		.app--small-navigation & {
			display: none;
		}
	}
</style>
