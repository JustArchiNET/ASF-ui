<template>
	<div class="form-item">
		<input-label :label="label" :has-description="hasDescription"></input-label>

		<div class="form-item__value">
			<div class="input-option__field">
				<select class="form-item__input" v-model="element" :id="field" :disabled="!availableEnumValues.length">
					<option v-for="(enumValue, name) in enumValues" :value="enumValue" v-show="!value.includes(enumValue)">
						{{ name }}
					</option>
					<option v-if="!availableEnumValues.length" :value="undefined" disabled>{{ $t('input-all-selected') }}</option>
				</select>

				<button class="button" @click.prevent="addElement">Add</button>
			</div>

			<div class="input-option__items">
				<button v-for="(item, index) in value" class="button input-option__item" @click.prevent="removeElement(index)">{{ resolveOption(item) }}</button>
			</div>
		</div>

		<input-description :description="description" v-if="hasDescription" v-show="showDescription"></input-description>
	</div>
</template>

<script>
	import Input from './Input.vue';

	export default {
		mixins: [Input],
		name: 'input-list',
		computed: {
			availableEnumValues() {
				const availableEnumValues = [];

				for (const key of Object.keys(this.enumValues)) {
					if (this.value.includes(this.enumValues[key])) continue;
					availableEnumValues.push(this.enumValues[key]);
				}

				return availableEnumValues;
			},
			enumValues() {
				return this.schema.values.values;
			}
		},
		data() {
			return {
				element: null
			};
		},
		created() {
			this.element = this.getDefaultElement();
		},
		methods: {
			getDefaultElement() {
				return this.availableEnumValues[0];
			},
			addElement() {
				if (!this.element && this.element !== 0) return;
				if (this.value.includes(this.element)) return;

				this.value.push(this.element);
				this.element = this.getDefaultElement();
			},
			removeElement(index) {
				this.value.splice(index, 1);
				this.element = this.getDefaultElement();
			},
			resolveOption(value) {
				return Object.keys(this.enumValues).find(key => this.enumValues[key] === value);
			}
		}
	};
</script>
