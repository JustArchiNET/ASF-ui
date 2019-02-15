<template>
	<footer class="footer">
		<div class="footer__links">
			<footer-link name="GitHub" prefix="fab" icon="github" to="https://github.com/JustArchiNET/ArchiSteamFarm"></footer-link>
			<footer-link :name="$t('wiki')" icon="book" to="https://github.com/JustArchiNET/ArchiSteamFarm/wiki"></footer-link>
			<footer-link v-if="authenticated" :name="$t('changelog')" icon="calendar-check" :to="`https://github.com/JustArchiNET/ArchiSteamFarm/releases/tag/${asfVersion}`"></footer-link>
		</div>

		<div class="footer__statistics">
			<footer-statistic :name="$t('version-ui')" :short-name="$t('ui')" :value="uiVersion" :notify="notifyRelease && newUiReleaseAvailable"></footer-statistic>
			<footer-statistic v-if="authenticated" :name="$t('version-asf')" short-name="ASF" :value="`${asfVersion} - ${buildVariant}`" :notify="notifyRelease && newAsfReleaseAvailable"></footer-statistic>
		</div>
	</footer>
</template>

<script>
	import FooterLink from './FooterLink.vue';
	import FooterStatistic from "./FooterStatistic.vue";

	import { mapGetters } from 'vuex';
	import { ui } from "../utils/ui";
	import { newReleaseAvailable } from '../utils/ui';

	export default {
		name: 'app-footer',
		components: { FooterLink, FooterStatistic },
		data() {
			return {
				uiVersion: ui.version,
				newUiReleaseAvailable: false,
				newAsfReleaseAvailable: false
			}
		},
		computed: mapGetters({
			authenticated: 'auth/authenticated',
			asfVersion: 'asf/version',
			buildVariant: 'asf/buildVariant',
			notifyRelease: 'settings/notifyRelease'
		}),
		created() {
			this.getNewVersions();
		},
		methods: {
			async getNewVersions() {
				this.newUiReleaseAvailable = await newReleaseAvailable('ASF-ui', ui.version);
				this.newAsfReleaseAvailable = await newReleaseAvailable('ArchiSteamFarm', this.asfVersion);
			}
		}
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

	.footer__statistics {
		margin-left: auto;
		text-align: center;
	}
</style>
