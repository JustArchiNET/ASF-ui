<template>
	<main class="main-container main-container--center">
		<div class="container container--small">
			<h2 class="title">{{ $t('ui-configuration') }}</h2>

			<div class="form-item">
				<button class="button button--confirm">{{ $t('Save') }}</button>
			</div>
		</div>
	</main>
</template>

<script>
	export default {
		name: 'ui-configuration',
		metaInfo() {
			return {
				title: this.$t('ui-configuration')
			};
		},
		components: {}
	};
</script>
