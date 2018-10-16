<template>
	<div class="config-editor">
		<template v-if="categories">
			<config-category :name="category.name" v-for="category in categories" :key="category.name" v-if="categoryFields(category.name).length">
				<component v-for="field in categoryFields(category.name)" class="form-item--config" :key="field.param" :is="componentFromField(field)" :schema="field" :current-value="model[field.paramName]" @update="updateModel"></component>
			</config-category>

			<config-category name="Other" v-if="uncategorizedFields.length" key="Other">
				<component v-for="field in uncategorizedFields" class="form-item--config" :key="field.param" :is="componentFromField(field)" :schema="field" :current-value="model[field.paramName]" @update="updateModel"></component>
			</config-category>
		</template>

		<template v-if="!categories">
			<component v-for="field in uncategorizedFields" class="form-item--config" :key="field.param" :is="componentFromField(field)" :schema="field" :current-value="model[field.paramName]" @update="updateModel"></component>
		</template>
	</div>
</template>

<script>
	import InputString from './ConfigFields/InputString.vue';
	import InputBoolean from './ConfigFields/InputBoolean.vue';
	import InputNumber from './ConfigFields/InputNumber.vue';
	import InputFlag from './ConfigFields/InputFlag.vue';
	import InputSet from './ConfigFields/InputSet.vue';
	import InputList from './ConfigFields/InputList.vue';
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
			categories: Array,
			descriptions: Object,
			extendedFields: Object
		},
		components: { ConfigCategory },
		data() {
			return {
				windowWidth: 0
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
					return this.getFields(category.fields).sort((a, b) => category.fields.indexOf(a.paramName) - category.fields.indexOf(b.paramName));
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
					case 'list':
						if (['enum'].includes(field.values.type)) return field.type === 'list' ? InputList : InputSet;
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

				if (fieldSchema && typeof fieldSchema.defaultValue !== 'undefined' && this.isDefault(value, fieldSchema)) {
					delete this.model[field];
				} else {
					this.model[field] = value;
				}
			},
			isDefault(value, fieldSchema) {
				return this.isEqual(value, fieldSchema.defaultValue, fieldSchema.type);
			},
			isEqual(a, b, type) {
				if (typeof a !== typeof b) return false;

				switch (type) {
					case 'number':
					case 'tinyNumber':
					case 'smallNumber':
					case 'bigNumber':
					case 'string':
					case 'boolean':
						return a === b;
					case 'hashSet':
						return a.length === b.length && a.every(item => b.includes(item));
					case 'list':
						return a.length === b.length && a.every((item, index) => item === b[index]);
					case 'dictionary':
						return Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(key => a[key] === b[key]);
				}

				return false;
			},
			getFields(names) {
				return this.fields.filter(field => names.includes(field.param));
			},
			computeLabelWidth() {
				if (window.innerWidth >= 1200 && this.windowWidth < 1200) {
					this.$el.style.setProperty('--label-width', 'auto');

					this.$nextTick(() => {
						const labelWidth = Math.max(...Array.from(this.$el.querySelectorAll('.form-item__label')).map(el => parseInt(getComputedStyle(el).width, 10)));
						this.$el.style.setProperty('--label-width', labelWidth + 'px');
					});
				}

				this.windowWidth = window.innerWidth;
			}
		},
		mounted() {
			window.addEventListener('resize', this.computeLabelWidth);
			this.computeLabelWidth();
		},
		beforeDestroy() {
			window.removeEventListener('resize', this.computeLabelWidth);
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
