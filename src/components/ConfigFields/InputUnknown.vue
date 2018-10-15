<template>
	<div class="form-item">
		<input-label :label="label" :has-description="hasDescription"></input-label>

		<div class="form-item__value">
			<span class="input-unknown">Unknown field type</span>
		</div>

		<input-description :description="description" v-if="hasDescription" v-show="showDescription"></input-description>
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
