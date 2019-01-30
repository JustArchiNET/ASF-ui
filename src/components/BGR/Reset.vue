<template>
	<div class="bgr__reset">
		<h3 class="subtitle">{{ title }}</h3>

		<div class="form-item">
			<div class="form-item__buttons form-item__buttons--center">
				<button class="button button--cancel" @click="$emit('reset')">
					<font-awesome-icon icon="spinner" v-if="resetting" spin></font-awesome-icon>
					<span v-else>{{ $t('reset') }}</span>
				</button>

				<button class="button button--confirm" @click="$emit('cancel')" :key="'cancel'">{{ $t('cancel') }}</button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			resetting: Boolean,
			title: String
		},
		name: 'bgr-reset'
	};
</script>
