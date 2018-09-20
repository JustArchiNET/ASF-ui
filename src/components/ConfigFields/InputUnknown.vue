<template>
	<div class="form-item">
		<label class="form-item__label" :for="field">
			{{ label }}
			<span v-if="required" class="form-item__required">*</span>
			<span v-if="description" class="form-item__description">{{ description }}</span>
		</label>

		<span class="input-unknown">Unknown field type</span>
	</div>
</template>

<script>
	import Input from './Input.vue';

	export default {
		mixins: [Input],
		name: 'input-unknown'
	};
</script>

<style lang="scss">
	.input-unknown {
		color: var(--color-theme);
		font-weight: 600;
	}
</style>
