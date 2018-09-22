<template>
	<div class="form-item">
		<label class="form-item__label" :for="field">
			{{ label }}
			<span v-if="required" class="form-item__required">*</span>
			<span v-if="description" class="form-item__description">{{ description }}</span>
		</label>

		<div class="form-item__buttons">
			<button class="button button--small" :class="{ 'button--active': value }" @click.prevent="value = true">✔</button>
			<button class="button button--small" :class="{ 'button--active': !value }" @click.prevent="value = false">✖</button>
		</div>
	</div>
</template>

<script>
	import Input from './Input.vue';

	export default {
		mixins: [Input],
		name: 'input-boolean'
	};
</script>
