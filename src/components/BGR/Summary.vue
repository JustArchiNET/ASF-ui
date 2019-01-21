<template>
	<div class="bgr__summary">
		<h3 class="subtitle bgr__summary-title">{{ title }}</h3>

		<div class="form-item">
			<bgr-keys :keys="keys"></bgr-keys>
		</div>

		<div class="form-item">
			<div class="form-item__buttons form-item__buttons--center">
				<button class="button button--confirm" v-if="!noKeys" @click="copyKeys">{{ $t('keys-copy') }}</button>
				<button class="button button--confirm" @click="$emit('back')" :key="'back'">{{ $t('back') }}</button>
			</div>
		</div>
	</div>
</template>

<script>
	import BgrKeys from './Keys.vue';
	import * as copy from 'copy-to-clipboard';

	export default {
		components: { BgrKeys },
		props: {
			keys: Object,
			title: String
		},
		name: 'bgr-summary',
		computed: {
			noKeys() {
				return Object.keys(this.keys).length === 0;
			}
		},
		methods: {
			copyKeys() {
				let keys = '';

				for (let key in this.keys) {
					if (this.keys.hasOwnProperty(key)) {
						keys += this.keys[key] + '\t' + key + '\n';
					}
				}

				copy(keys);
				this.$info(this.$t('keys-copied'));
			}
		}
	};
</script>

<style lang="scss">
	.bgr__summary-title {
		margin-bottom: 0.5em;
	}
</style>
