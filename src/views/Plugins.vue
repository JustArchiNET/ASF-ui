<template>
	<main class="main-container main-container--fullheight">
		<div class="container">
			<asf-plugins></asf-plugins>
		</div>
	</main>
</template>

<script>
	import AsfPlugins from '../components/AsfPlugins.vue';

	export default {
		name: 'plugins',
		metaInfo() {
			return {
				title: this.$t('plugins')
			};
		},
		components: { AsfPlugins }
	};
</script>
