<template>
	<div class="form-item">
		<input-label :label="label" :has-description="hasDescription" />

		<div class="form-item__value">
			<select :id="field" v-model="value" class="form-item__input" :name="field">
				<option v-for="(enumValue, name) in values" v-if="!(name === 'Max' && isLastValue(enumValue))" :value="enumValue">
					{{ name }}
				</option>
			</select>
		</div>

		<input-description v-if="hasDescription" v-show="showDescription" :description="description" />
	</div>
</template>

<script>
	import Input from './Input.vue';

	export default {
		name: 'input-enum',
		mixins: [Input],
		computed: {
			values() {
				return this.schema.values;
			}
		},
		methods: {
			isLastValue(value) {
				return value === Math.max(...Object.values(this.values));
			}
		}
	};
</script>
