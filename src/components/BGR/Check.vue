<template>
	<div class="bgr__check">
		<h3 class="subtitle bgr__check-title" v-if="!noKeys">{{ title }}</h3>

		<div class="form-item">
			<bgr-keys :keys="keys"></bgr-keys>
		</div>

		<div class="form-item">
			<div class="form-item__buttons form-item__buttons--center">
				<button class="button button--confirm" @click="$emit('confirm')" v-if="!noKeys">
					<font-awesome-icon icon="spinner" v-if="confirming" spin></font-awesome-icon>
					<span v-else>{{ $t('confirm') }}</span>
				</button>

				<button class="button button--cancel" @click="$emit('cancel')" :key="'cancel'">{{ $t('cancel') }}</button>
			</div>
		</div>
	</div>
</template>

<script>
	import BgrKeys from './Keys.vue';

	export default {
		components: { BgrKeys },
		props: {
			bot: Object,
			keys: Object,
			confirming: Boolean,
			title: String
		},
		name: 'bgr-check',
		computed: {
			noKeys() {
				return !Object.keys(this.keys).length;
			}
		}
	};
</script>

<style lang="scss">
	.bgr__check-title {
		margin-bottom: 0.5em;
	}
</style>
