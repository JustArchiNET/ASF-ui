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
				{ name: 'General', fields: ['Default page'] },
				{ name: this.$t('commands'), fields: [this.$t('timestamps')] }
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
				},
				{
					param: this.$t('timestamps'),
					paramName: 'timestamps',
					type: 'boolean',
					description: this.$t('timestamps-description')
				}
			];

			return {
				fields,
				categories,
				model: {
					defaultView: storage.get('settings:default-view'),
					timestamps: storage.get('settings:timestamps')
				}
			}
		},
		methods: {
			save() {
				const model = this.model;
				if (model.defaultView) storage.set('settings:default-view', model.defaultView);
				storage.set('settings:timestamps', model.timestamps);
				this.$success(this.$t('settings-saved'));
			}
		}
	};
</script>
