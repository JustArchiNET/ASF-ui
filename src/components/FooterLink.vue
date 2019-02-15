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
		color: var(--color-theme);
		font-weight: 700;
		text-decoration: none;
		height: 100%;
		padding: 0 0.5em;
		margin: 0 0.5em;
		display: flex;
		align-items: center;

		@media screen and (max-width: 750px) {
			padding: 0 0.2em;
			margin: 0 0.2em;
		}

		@media screen and (max-width: 530px) {
			padding: 0 0.5em;
			margin: 0 0.5em;
		}

		@media screen and (max-width: 350px) {
			padding: 0 0.2em;
			margin: 0 0.2em;
		}
	}

	.footer__link-name {
		color: var(--color-text-dark);

		@media screen and (max-width: 530px) {
			display: none;
		}
	}

	.footer__link-icon {
		margin-right: 0.5em;

		@media screen and (max-width: 530px) {
			margin-right: 0.2em;
		}
	}
</style>
