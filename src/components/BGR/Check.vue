<template>
	<div class="bgr__check">
		<div class="form-item">
			<div class="bgr__keys">
				<span class="bgr__key" v-if="noKeys"><strong>No key pairs detected</strong></span>
				<span v-for="(name, key) in keys" class="key">{{ key }} - {{ name }}</span>
			</div>
		</div>

		<div class="form-item">
			<div class="form-item__buttons form-item__buttons--center">
				<button class="button button--confirm" @click="$emit('confirm')" v-if="!noKeys">
					<font-awesome-icon icon="spinner" v-if="confirming" spin></font-awesome-icon>
					<span v-else>Confirm</span>
				</button>

				<button class="button button--cancel" @click="$emit('cancel')" :key="'cancel'">Cancel</button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
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
