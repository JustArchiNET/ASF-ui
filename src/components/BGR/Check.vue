<template>
	<div class="bgr__check">
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
	import BgrKeys from "./Keys.vue";

	export default {
		components: { BgrKeys },
		props: {
			bot: Object,
			keys: Object,
			confirming: Boolean
		},
		name: 'bgr-check',
		computed: {
			noKeys() {
				return !Object.keys(this.keys).length;
			}
		}
	};
</script>
