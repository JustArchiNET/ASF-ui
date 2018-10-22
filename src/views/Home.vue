<template>
	<main class="main-container">
		<h2 class="title">{{ $t('changelog') }}</h2>
		<div class="container">
			<changelog></changelog>
		</div>
	</main>
</template>

<script>
	import Changelog from '../components/Changelog.vue';

	export default {
		name: 'home',
		metaInfo: { title: 'Home' },
		components: { Changelog }
	};
</script>
