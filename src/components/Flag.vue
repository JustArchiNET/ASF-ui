<template>
  <span class="flag-icon" :class="flagCountryClass"></span>
</template>

<script>
	import 'flag-icon-css/sass/flag-icon.scss';

	export default {
		name: 'Flag',
		props: {
			country: String
		},
		computed: {
			flagCountryClass() {
				return `flag-icon-${this.country}`;
			}
		}
	};
</script>

<style lang="scss">
	.flag-icon {
		width: 20px;
	}
</style>
