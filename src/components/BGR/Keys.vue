<template>
	<div class="bgr__keys">
		<span class="bgr__key" v-if="noKeys"><strong>{{ $t('bgr-no-pairs-detected') }}</strong></span>
		<table>
			<tr v-for="(name, key) in keys" class="key">
				<th class="key__content pull-left">{{ name }}</th>
				<th class="key__content">{{ key }}</th>
			</tr>
		</table>
	</div>
</template>

<script>
	export default {
		props: { keys: Object },
		name: 'bgr-keys',
		computed: {
			noKeys() {
				return Object.keys(this.keys).length === 0;
			}
		}
	};
</script>

<style lang="scss">
	.key {
		background-color: #fff;
	}
	.key:nth-child(2n) {
		background-color: #f6f8fa;
	}
	.key__content {
		border: 0.1em solid #dfe2e5;
		padding: 0.5em 1em;
	}
	.pull-left {
		text-align: left;
	}
</style>
