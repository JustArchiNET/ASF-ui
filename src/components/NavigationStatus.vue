<template>
	<div class="navigation-statistic">
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';

	import NavigationStatistic from './NavigationStatistic';

	export default {
		name: 'navigation-footer',
		components: { NavigationStatistic },
		computed: mapGetters({
			memory: 'status/memory',
			uptime: 'status/uptime'
		})
	};
</script>

<style lang="scss">
	.navigation-footer {
		margin-top: auto;
	}
</style>
