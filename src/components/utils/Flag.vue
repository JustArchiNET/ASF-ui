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
			this.flagImage = flags[this.country];
		}
	};
</script>

<style lang="scss">
	.flag-icon {
		width: 20px;
	}
</style>
