<template>
	<a class="footer__statistic" :href="to" target="_blank">
		<span class="footer__statistic-shortname">{{ shortName }}</span>
		<span class="footer__statistic-name">{{ name }}</span>
		<span class="footer__statistic-value">{{ value }}</span>
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
			shortName: {
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
			}
		}
	};
</script>

<style lang="scss">
	.footer__statistic {
		padding: 0 0.5em;
		color: var(--color-text-dark);

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
</style>
