<template>
	<h4 class="subtitle bgr__status" v-if="usedKeysCount || unusedKeysCount">
		<button class="button" @click="$emit('show-used')">{{ $t('bgr-used-keys-count', { count: usedKeysCount }) }}</button>
		<button class="button" @click="$emit('show-unused')">{{ $t('bgr-unused-keys-count', { count: unusedKeysCount }) }}</button>
		<button class="button" @click="$emit('reset')">{{ $t('reset') }}</button>
	</h4>
</template>

<script>
	export default {
		props: {
			usedKeys: Object,
			unusedKeys: Object
		},
		name: 'bgr-status',
		computed: {
			unusedKeysCount() {
				return Object.keys(this.unusedKeys).length;
			},
			usedKeysCount() {
				return Object.keys(this.usedKeys).length;
			}
		}
	};
</script>

<style lang="scss">
	.bgr__status {
		margin: 0.5em 0 1em;
		color: var(--color-text-disabled);
	}
</style>
