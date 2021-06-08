<template>
  <div class="navigation-category__title">
    <span>{{ name }}</span>
  </div>
</template>

<script>
  export default {
    name: 'NavigationCategoryTitle',
    props: {
      name: {
        type: String,
        required: true,
      },
    },
  };
</script>

<style lang="scss">
	.navigation-category__title {
		align-items: center;
		background: rgba(black, 0.4);
		color: var(--color-text-disabled);
		display: flex;
		font-size: 0.9em;
		padding: 0.75em 1em;
		text-transform: uppercase;
		width: var(--navigation-width);

		.app--small-navigation & {
			display: none;
		}
	}
</style>
