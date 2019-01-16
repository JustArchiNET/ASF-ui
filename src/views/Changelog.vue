<template>
	<main class="main-container">
		<div class="container">
			<asf-changelog></asf-changelog>
		</div>
	</main>
</template>

<script>
	import AsfChangelog from '../components/AsfChangelog.vue';

	export default {
		name: 'changelog',
		metaInfo() {
			return {
				title: this.$t('changelog')
			};
		},
		components: { AsfChangelog }
	};
</script>
