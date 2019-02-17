<template>
	<a class="footer__statistic" :href="to" target="_blank">
		<span class="footer__statistic-name">{{ name }}</span>
		<span class="footer__statistic-value">
			{{ value }} <font-awesome-icon v-if="notify" class="footer__statistic-value--notify" :title="$t('update-available')" icon="exclamation" size="sm"></font-awesome-icon>
		</span>
	</a>
</template>

<script>
	export default {
		name: 'footer-statistic',
		props: {
			name: {
				type: String,
				required: true
			},
			value: {
				type: String,
				required: true
			},
			to: {
				type: String,
				required: true
			},
			notify: {
				type: Boolean,
				default: false
			}
		}
	};
</script>

<style lang="scss">
	.footer__statistic {
		color: var(--color-text-dark);
		padding: 0 0.5em;

		@media screen and (max-width: 530px) {
			padding: 0 0.2em;
		}
	}

	.footer__statistic-name {
		color: var(--color-theme);
		font-weight: 700;
	}

	.footer__statistic-value--notify {
		color: #ffa500;
	}
</style>
