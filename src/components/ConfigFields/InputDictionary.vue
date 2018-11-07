<template>
	<div class="form-item">
		<input-label :label="label" :has-description="hasDescription"></input-label>

		<div class="form-item__value">
			<div class="input-option__field input-option__field--three">
				<input class="form-item__input" type="text" :id="`${field}-key`" v-model="elementKey" @keydown.enter="addElement" v-if="keyIsString">

				<select class="form-item__input" v-model="elementValue" :id="`${field}-value`" v-if="valueIsEnum">
					<option v-for="(enumValue, name) in schema.value.values" :value="enumValue">
						{{ name }}
					</option>
				</select>

				<button class="button" @click.prevent="addElement">Add</button>
			</div>

			<div class="input-option__items">
				<button v-for="(keyValue, key) in value" class="button input-option__item" @click.prevent="removeElement(key)">
					{{ key }} => {{ resolveValue(keyValue) }}
				</button>
			</div>
		</div>

		<input-description :description="description" v-if="hasDescription" v-show="showDescription"></input-description>
	</div>
</template>

<script>
	import Input from './Input.vue';

	export default {
		mixins: [Input],
		name: 'input-dictionary',
		computed: {
			keyIsString() {
				return ['string', 'uint64'].includes(this.schema.key.type);
			},
			valueIsEnum() {
				return this.schema.value.type === 'enum';
			},
			valueAvailableEnumValues() {
				const availableEnumValues = [];

				for (const key of Object.keys(this.schema.value.values)) {
					availableEnumValues.push(this.schema.value.values[key]);
				}

				return availableEnumValues;
			}
		},
		data() {
			return {
				elementKey: null,
				elementValue: null
			};
		},
		created() {
			this.elementKey = this.getDefaultKey();
			this.elementValue = this.getDefaultValue();
		},
		methods: {
			getDefaultKey() {
				return null;
			},
			getDefaultValue() {
				if (this.valueIsEnum) return this.valueAvailableEnumValues[0];
				return null;
			},
			resolveValue(value) {
				if (!this.valueIsEnum) return value;
				return Object.keys(this.schema.value.values).find(key => this.schema.value.values[key] === value);
			},
			addElement() {
				if (!this.elementValue && this.elementValue !== 0 || !this.elementKey && this.elementKey !== 0) return;

				this.$set(this.value, this.elementKey, this.elementValue);
				this.elementValue = this.getDefaultValue();
				this.elementKey = this.getDefaultKey();
			},
			removeElement(key) {
				this.$delete(this.value, key);
			}
		}
	};
</script>
