<template>
	<div class="form-item">
		<input-label :label="label" :has-description="hasDescription"></input-label>

		<div class="form-item__value">
			<select class="form-item__input" :name="field" :id="field" v-model="value">
				<option v-for="(enumValue, name) in values" :value="enumValue">{{ name }}</option>
			</select>
		</div>

		<input-description :description="description" v-if="hasDescription" v-show="showDescription"></input-description>
	</div>
</template>

<script>
	import Input from './Input.vue';

	export default {
		mixins: [Input],
		name: 'input-enum',
		computed: {
			values() {
				return this.schema.values;
			}
		}
	};
</script>
