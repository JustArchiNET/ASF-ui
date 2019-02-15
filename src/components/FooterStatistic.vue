<template>
	<span class="footer__statistic">
		<span class="footer__statistic-shortname">{{ shortName }}</span>
		<span class="footer__statistic-name">{{ name }}</span>
		<span class="footer__statistic-value">
			{{ value }} <font-awesome-icon v-if="notify" class="footer__statistic-value--notify" icon="exclamation" size="sm"></font-awesome-icon>
		</span>
	</span>
</template>

<script>
	export default {
		name: 'footer-statistic',
		props: {
			name: {
				type: String,
				required: true
			},
			shortName: {
				type: String,
				required: true
			},
			value: {
				type: String,
				required: true
			},
			notify: {
				type: Boolean
			}
		}
	};
</script>

<style lang="scss">
	.footer__statistic {
		padding: 0 0.5em;

		@media screen and (max-width: 750px) {
			padding: 0 0.2em;
		}
	}

	.footer__statistic-name {
		color: var(--color-theme);
		font-weight: 700;

		@media screen and (max-width: 460px) {
			display: none;
		}
	}

	.footer__statistic-shortname {
		display: none;
		color: var(--color-theme);
		font-weight: 700;

		@media screen and (max-width: 460px) {
			display: inline;
		}
	}

	.footer__statistic-value--notify {
		color: #ffa500;
	}
</style>
