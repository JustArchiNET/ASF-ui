<template>
	<div class="form-item">
		<input-label :label="label" :has-description="hasDescription"></input-label>

		<div class="form-item__value">
			<input class="form-item__input" type="text" :name="field" :id="field" :placeholder="placeholder" :class="{ error: invalid }" v-model="value" @blur="onBlur">
			<span v-if="invalid" class="form-item__error">{{ errors.join(' ') }}</span>
		</div>

		<input-description :description="description" v-if="hasDescription" v-show="showDescription"></input-description>
	</div>
</template>

<script>
	import Input from './Input.vue';

	export default {
		mixins: [Input],
		name: 'input-string',
		computed: {
			errors() {
				return this.validate(this.value);
			},
			valid() {
				return this.errors.length === 0;
			},
			invalid() {
				return this.errors.length !== 0;
			}
		},
		methods: {
			onBlur() {
				if (this.value === '') this.value = this.defaultValue;
			}
		}
	};
</script>
