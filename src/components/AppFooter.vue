<template>
	<footer class="footer">
		<div class="footer__links">
			<a class="footer__link" target="_blank" href="https://github.com/JustArchiNET/ArchiSteamFarm">GitHub</a>
			<a class="footer__link" target="_blank" href="https://github.com/JustArchiNET/ArchiSteamFarm/wiki">{{ $t('wiki') }}</a>
			<a class="footer__link" v-if="authenticated" target="_blank" :href="`https://github.com/JustArchiNET/ArchiSteamFarm/releases/tag/${asfVersion}`">{{ $t('changelog') }}</a>
		</div>

		<div class="footer__statistics">
			<span class="footer__statistic">
				<span class="footer__statistic-name">{{ $t('version-ui') }}</span>
				<span class="footer__statistic-value">{{ uiVersion }}</span>
			</span>
			<span class="footer__statistic" v-if="authenticated">
				<span class="footer__statistic-name">{{ $t('version-asf') }}</span>
				<span class="footer__statistic-value">{{ asfVersion }} - {{ buildVariant }}</span>
			</span>
		</div>
	</footer>
</template>

<script>
	import { mapGetters } from 'vuex';
	import { ui } from "../utils/ui";

	export default {
		name: 'app-footer',
		data() {
			return {
				uiVersion: ui.version
			}
		},
		computed: mapGetters({
			authenticated: 'auth/authenticated',
			asfVersion: 'asf/version',
			buildVariant: 'asf/buildVariant'
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

		@media screen and (max-width: 600px) {
			padding: 0 0.2em;
			margin: 0 0.2em;
		}
	}

	.footer__statistics {
		margin-left: auto;
		text-align: center;
	}

	.footer__statistic {
		padding: 0 0.5em;

		@media screen and (max-width: 600px) {
			padding: 0 0.2em;
		}
	}

	.footer__statistic-name {
		color: var(--color-theme);
		font-weight: 700;
	}
</style>
