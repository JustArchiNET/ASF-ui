<template>
	<div class="form-item">
		<input-label :label="label" :has-description="hasDescription"></input-label>

		<div class="form-item__value">
			<input class="form-item__input" type="text" :name="field" :id="field" :placeholder="placeholder" v-model="value" @blur="onBlur" @keypress="onKeyPress">
			<span v-if="!isValid" class="form-item__error">{{ errorText }}</span>
		</div>

		<input-description :description="description" v-if="hasDescription" v-show="showDescription"></input-description>
	</div>
</template>

<script>
	import Input from './Input.vue';

	export default {
		mixins: [Input],
		name: 'input-string',
		methods: {
			onBlur() {
				if (this.value === '') this.value = this.defaultValue;
			},
			onKeyPress($event) {
				if (this.schema.type !== 'uint64') return true;

				const charCode = $event.which ? $event.which : $event.keyCode;
				if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) $event.preventDefault();
				else return true;
			}
		}
	};
</script>
