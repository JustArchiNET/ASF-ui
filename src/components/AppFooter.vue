<template>
	<footer class="footer">
		<div class="footer__links">
			<a class="footer__link" target="_blank" href="https://github.com/JustArchiNET/ArchiSteamFarm">GitHub</a>
			<a class="footer__link" target="_blank" href="https://github.com/JustArchiNET/ArchiSteamFarm/wiki">{{ $t('wiki') }}</a>
			<a class="footer__link" v-if="authenticated" target="_blank" :href="`https://github.com/JustArchiNET/ArchiSteamFarm/releases/tag/${version}`">{{ $t('changelog') }}</a>
		</div>

		<div class="footer__statistics" v-if="authenticated">
			<span class="footer__statistic"><b>{{ $t('version') }}</b> {{ version }} - {{ buildVariant }}</span>
		</div>
	</footer>
</template>

<script>
	import { mapGetters } from 'vuex';

	export default {
		name: 'app-footer',
		computed: mapGetters({
			authenticated: 'auth/authenticated',
			version: 'status/version',
			buildVariant: 'status/buildVariant'
		})
	};
</script>

<style lang="scss">
	.footer {
		grid-area: footer;
		width: 100%;
		height: var(--navigation-height);
		background: var(--color-background-light);
		border-top: 1px solid var(--color-border);
		box-sizing: border-box;
		display: flex;
		align-items: center;
		font-size: 0.9em;
		padding: 0 0.5em;
	}

	.footer__links {
		display: flex;
		height: 100%;
	}

	.footer__link {
		color: var(--color-theme);
		font-weight: 700;
		text-decoration: none;
		height: 100%;
		padding: 0 0.5em;
		margin: 0 0.5em;
		display: flex;
		align-items: center;

		@media screen and (max-width: 350px) {
			padding: 0 0.2em;
			margin: 0 0.2em;
		}
	}

	.footer__statistics {
		padding: 0 1em;
		margin-left: auto;
		text-align: center;

		@media screen and (max-width: 600px) {
			padding: 0 0.25em;
		}
	}
</style>
