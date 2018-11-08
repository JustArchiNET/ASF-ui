<template>
	<main class="main-container main-container--center">
		<div class="container container--small">
			<h2 class="title">{{ $t('ui-configuration') }}</h2>

			<config-editor :fields="fields" :categories="categories" :model="model"></config-editor>

			<div class="form-item">
				<button class="button button--confirm" @click="save">{{ $t('save') }}</button>
			</div>
		</div>
	</main>
</template>

<script>
	import * as storage from '../utils/storage';
	import ConfigEditor from '../components/ConfigEditor.vue';

	export default {
		name: 'ui-configuration',
		metaInfo() {
			return {
				title: this.$t('ui-configuration')
			};
		},
		components: { ConfigEditor },
		data() {
			const categories = [
				{ name: 'General', fields: ['Default page'] }
			];

			const fields = [
				{
					param: 'Default page',
					paramName: 'defaultView',
					type: 'enum',
					defaultValue: 'home',
					values: {
						[this.$t('home')]: 'home',
						[this.$t('commands')]: 'commands',
						[this.$t('bots')]: 'bots',
						[this.$t('log')]: 'log',
						[this.$t('last-visited-page')]: '_last-visited-page'
					}
				}
			];

			return {
				fields,
				categories,
				model: {
					defaultView: storage.get('settings:default-view')
				}
			}
		},
		methods: {
			save() {
				if (this.defaultView) storage.set('settings:default-view', this.defaultView);
				this.$success('Settings saved!');
			}
		}
	};
</script>
