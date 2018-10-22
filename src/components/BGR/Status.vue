<template>
	<h4 class="subtitle bgr__status" v-if="usedKeysCount || unusedKeysCount"><span class="bgr__status-link" @click="$emit('show-used')">{{ $t('bgr-used-keys-count', { count: usedKeysCount }) }}</span>, <span class="bgr__status-link"
																																																																																																							@click="$emit('show-unused')">{{ $t('bgr-unused-keys-count', { count: unusedKeysCount }) }}</span>
		- <span class="bgr__status-link" @click="$emit('reset')">{{ $t('reset') }}</span></h4>
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

	.bgr__status-link {
		cursor: pointer;
		text-transform: lowercase;
	}
</style>
