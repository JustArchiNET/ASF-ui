<template>
	<a class="footer__link" target="_blank" :href="to">
		<span class="footer__link-icon">
			<font-awesome-icon :icon="[prefix, icon]" size="lg" :title="name" fixed-width></font-awesome-icon>
		</span>
		<span class="footer__link-name">{{ name }}</span>
	</a>
</template>

<script>
	export default {
		name: 'footer-link',
		props: {
			name: {
				type: String,
				required: true
			},
			to: {
				required: true
			},
			prefix: {
				type: String,
				default: 'fas'
			},
			icon: {
				type: String,
				required: true
			}
		}
	};
</script>

<style lang="scss">
	.footer__link {
		align-items: center;
		color: var(--color-theme);
		display: flex;
		font-weight: 700;
		height: 100%;
		margin: 0 .5em;
		padding: 0 .5em;
		text-decoration: none;

		@media screen and (max-width: 530px) {
			margin: 0 .2em;
			padding: 0 .2em;
		}

		@media screen and (max-width: 460px) {
			margin: 0 .5em;
			padding: 0 .5em;
		}

		@media screen and (max-width: 350px) {
			margin: 0 .2em;
			padding: 0 .2em;
		}
	}

	.footer__link-name {
		color: var(--color-text-dark);

		@media screen and (max-width: 460px) {
			display: none;
		}
	}

	.footer__link-icon {
		margin-right: .5em;

		@media screen and (max-width: 530px) {
			margin-right: .2em;
		}
	}
</style>
