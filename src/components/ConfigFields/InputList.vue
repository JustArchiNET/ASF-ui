<template>
	<div class="form-item">
		<input-label :label="label" :has-description="hasDescription"></input-label>

		<div class="form-item__value">
			<div class="input-option__field">
				<select :id="field" v-model="element" class="form-item__input" :disabled="!availableEnumValues.length">
					<option v-for="value in enumValues" v-show="!value.includes(value)" :value="value">{{ value }}</option>
					<option v-if="!availableEnumValues.length" :value="undefined" disabled>{{ $t('input-all-selected') }}</option>
				</select>

				<button class="button" @click.prevent="addElement">
					{{ $t('add') }}
				</button>
			</div>

			<div class="input-option__items">
				<button v-for="(item, index) in value" class="button input-option__item" @click.prevent="removeElement(index)">
					{{ item }}
				</button>
			</div>
		</div>

		<input-description v-if="hasDescription" v-show="showDescription" :description="description"></input-description>
	</div>
</template>

<script>
	import Input from './Input.vue';

	export default {
		name: 'input-list',
		mixins: [Input],
		data() {
			return {
				element: null
			};
		},
		computed: {
			availableEnumValues() {
				const availableEnumValues = [];

				for (const value of this.enumValues) {
					if (this.value.includes(value)) continue;
					availableEnumValues.push(value);
				}

				return availableEnumValues;
			},
			enumValues() {
				return this.schema.enum;
			}
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
			}
		}
	};
</script>
