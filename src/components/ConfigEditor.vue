<template>
	<div class="config-editor">
		<template v-if="categories">
			<config-category :name="category.name" v-for="category in categories" :key="category.name" v-if="categoryFields(category.name).length">
				<component v-for="field in categoryFields(category.name)" :key="field.param" :is="componentFromField(field)" :schema="field"
									 :current-value="model[field.paramName]" @update="updateModel"></component>
			</config-category>

			<config-category name="Other" v-if="uncategorizedFields.length" key="Other">
				<component v-for="field in uncategorizedFields" :key="field.param" :is="componentFromField(field)" :schema="field"
									 :current-value="model[field.paramName]" @update="updateModel"></component>
			</config-category>
		</template>


		<template v-if="!categories">
			<component v-for="field in uncategorizedFields" :key="field.param" :is="componentFromField(field)" :schema="field"
								 :current-value="model[field.paramName]" @update="updateModel"></component>
		</template>
	</div>
</template>

<script>
	import InputString from './ConfigFields/InputString.vue';
	import InputBoolean from './ConfigFields/InputBoolean.vue';
	import InputNumber from './ConfigFields/InputNumber.vue';
	import InputFlag from './ConfigFields/InputFlag.vue';
	import InputSet from './ConfigFields/InputSet.vue';
	import InputTag from './ConfigFields/InputTag.vue';
	import InputEnum from './ConfigFields/InputEnum.vue';
	import InputDictionary from './ConfigFields/InputDictionary.vue';
	import InputUnknown from './ConfigFields/InputUnknown.vue';

	import ConfigCategory from './ConfigCategory.vue';

	export default {
		name: 'config-editor',
		props: {
			fields: {
				type: Array,
				required: true
			},
			model: {
				type: Object,
				required: true
			},
			categories: Array
		},
		components: { ConfigCategory },
		data() {
			return {
				changed: false
			};
		},
		computed: {
			uncategorizedFields() {
				if (!this.categories) return this.fields;

				const categorizedFields = this.categories.map(category => category.fields).reduce((categorizedFields, categoryFields) => {
					return [...categorizedFields, ...categoryFields];
				}, []);

				return this.fields.filter(field => !categorizedFields.includes(field.param));
			},
			categoryFields() {
				return categoryName => {
					if (!this.categories) return [];
					const category = this.categories.find(({ name }) => name === categoryName);
					if (!category) return [];
					return this.getFields(category.fields);
				};
			}
		},
		methods: {
			componentFromField(field) {
				switch (field.type) {
					case 'string':
					case 'bigNumber':
						return InputString;
					case 'boolean':
						return InputBoolean;
					case 'number':
					case 'smallNumber':
					case 'tinyNumber':
						return InputNumber;
					case 'flag':
						return InputFlag;
					case 'enum':
						return InputEnum;
					case 'hashSet':
					case 'list': // TODO: Implement list field
						if (['enum'].includes(field.values.type)) return InputSet;
						if (['tinyNumber', 'smallNumber', 'number', 'bigNumber', 'string'].includes(field.values.type)) return InputTag;
						return InputUnknown;
					case 'dictionary':
						return InputDictionary;
					default:
						return InputUnknown;
				}
			},
			updateModel(value, field) {
				const fieldSchema = this.fields.find(fieldSchema => fieldSchema.paramName === field);

				if (fieldSchema && typeof fieldSchema.defaultValue !== 'undefined' && this.isEqual(value, fieldSchema.defaultValue)) {
					delete this.model[field];
				} else {
					this.model[field] = value;
				}

				this.changed = true;
			},
			update() {
				this.$emit('update', this.model);
				this.changed = false;
			},
			isEqual(a, b) {
				if (typeof a !== typeof b) return false;

				switch (typeof a) {
					case 'number':
					case 'string':
					case 'boolean':
						return a === b;
					case 'object':
						if (Array.isArray(a) && Array.isArray(b)) {
							return a.length === b.length && a.every((item, index) => item === b[index]);
						}

						if ('' + a === '[object Object]' && '' + b === '[object Object]') {
							return Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(key => a[key] === b[key]);
						}

						return a === b;
				}

				return false;
			},
			getFields(names) {
				return this.fields.filter(field => names.includes(field.param));
			}
		},
		beforeDestroy() {
			if (this.changed) this.update();
		}
	};
</script>

<style lang="scss">
	.config-editor {
		margin-bottom: 1em;

		&:last-child {
			margin-bottom: 0;
		}
	}
</style>
