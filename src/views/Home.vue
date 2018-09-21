<template>
	<main class="main-container">
		<h2 class="title">Home</h2>

		<div class="container">
			<button class="button" @click.prevent="executeASFAction('Exit')">Exit</button>
			<button class="button" @click.prevent="executeASFAction('Restart')">Restart</button>
			<button class="button" @click.prevent="executeASFAction('Update')">Update</button>
		</div>

		<changelog></changelog>
	</main>
</template>

<script>
	import Changelog from '../components/Changelog.vue';

	import { post } from '../utils/http';

	export default {
		name: 'home',
		metaInfo: { title: 'Home' },
		components: { Changelog },
		methods: {
			async executeASFAction(action) {
				await post(`ASF/Action/${action}`);
			}
		}
	};
</script>
