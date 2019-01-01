<template>
	<main class="main-container main-container--fullheight log">
		<section-title>{{ $t('log') }}</section-title>
		<asf-log></asf-log>
	</main>
</template>

<script>
	import AsfLog from '../components/AsfLog.vue';
	import SectionTitle from '../components/SectionTitle.vue';

	export default {
		name: 'log',
		metaInfo() {
			return {
				title: this.$t('log')
			};
		},
		components: { AsfLog, SectionTitle }
	};
</script>

<style lang="scss">
	.log {
		display: grid;
		grid-template-rows: auto 1fr;

		> div {
			min-height: 0;
		}
	}
</style>
