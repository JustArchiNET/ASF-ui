<template>
	<main class="main-container">
		<h2 class="title">Bot Config</h2>

		<div class="container">
			<config-editor :fields="fields" :model="model"></config-editor>
		</div>
	</main>
</template>

<script>
	import ConfigEditor from '../components/ConfigEditor.vue';

	import fetchConfigSchema from '../utils/fetchConfigSchema';

	export default {
		name: 'bot-config',
		metaInfo: { title: 'Bot Config' },
		components: { ConfigEditor },
		data() {
			return {
				fields: [],
				model: {}
			};
		},
		async created() {
			const schema = await fetchConfigSchema('ArchiSteamFarm.BotConfig');
			this.fields = Object.keys(schema.body).map(key => schema.body[key]);
		}
	};
</script>
