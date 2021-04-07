<template>
	<img class="flag-icon" :src="flagImage">
</template>

<script>
	const defaultImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAADCAYAAABbNsX4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAYSURBVBhXY6yvr//PgAaYoDQKwCLIwAAAlooCgtdBJB0AAAAASUVORK5CYII=';

	export default {
		name: 'flag',
		props: {
			country: String
		},
		data() {
			return {
				flagImage: defaultImage
			};
		},
		async created() {
			// Auto generated pre build
			const flags = await import('../../../generated/flags');
      flags.lol = '/lol-US.png';
			this.flagImage = flags[this.country];
		}
	};
</script>

<style lang="scss">
	.flag-icon {
		box-shadow: 1px 1px 1px 0 var(--color-navigation-dark);
		width: 20px;
	}
</style>
