<template>
	<div class="form-item">
		<input-label :label="label" :has-description="hasDescription"></input-label>

		<div class="form-item__value">
			<input class="form-item__input" type="number" :name="field" :id="field" :placeholder="placeholder" v-model.number="value" @blur="onBlur">
			<span v-if="hasErrors" class="form-item__error">{{ errorText }}</span>
		</div>

		<input-description :description="description" v-if="hasDescription" v-show="showDescription"></input-description>
	</div>
</template>

<script>
	import Input from './Input.vue';

	export default {
		mixins: [Input],
		name: 'input-number',
		methods: {
			onBlur() {
				if (this.value === '') this.value = this.defaultValue;
			}
		}
	};
</script>
