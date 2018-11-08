<template>
	<main class="main-container main-container--center">
		<div class="container container--small">
			<h2 class="title">{{ $t('ui-configuration') }}</h2>

			<config-category name="General">
				<input-select :current-value="defaultView" @update="updateSettings" :schema="{
					label: 'Default page',
					defaultValue: 'home',
					paramName: 'defaultView',
					values: {
						[$t('home')]: 'home',
						[$t('bots')]: 'bots',
						[$t('commands')]: 'commands',
						[$t('log')]: 'log',
						[$t('last-visited-page')]: '_last-visited-page'
					}
				}"></input-select>
			</config-category>

			<div class="form-item">
				<button class="button button--confirm" @click="save">{{ $t('Save') }}</button>
			</div>
		</div>
	</main>
</template>

<script>
	import InputSelect from '../components/ConfigFields/InputEnum.vue';
	import ConfigCategory from '../components/ConfigCategory.vue';
	import { get, set } from '../utils/storage';

	export default {
		name: 'ui-configuration',
		metaInfo() {
			return {
				title: this.$t('ui-configuration')
			};
		},
		components: { InputSelect, ConfigCategory },
		data() {
			return {
				defaultView: get('settings:default-view')
			}
		},
		methods: {
			updateSettings(value, field) {
				this[field] = value;
			},
			save() {
				if (this.defaultView) set('settings:default-view', this.defaultView);
			}
		}
	};
</script>
