<template>
	<footer class="footer">
		<div class="footer__links">
			<footer-link name="GitHub" prefix="fab" icon="github" to="https://github.com/JustArchiNET"></footer-link>
			<footer-link :name="$t('wiki')" icon="book" to="https://github.com/JustArchiNET/ArchiSteamFarm/wiki"></footer-link>
			<footer-link v-if="authenticated" :name="$t('changelog')" icon="calendar-check" :to="`https://github.com/JustArchiNET/ArchiSteamFarm/releases/tag/${asfVersion}`"></footer-link>
		</div>

		<div class="footer__statistics">
			<footer-statistic :name="$t('ui')" :value="uiVersion" :notify="notifyRelease && newUiReleaseAvailable" :to="`https://github.com/JustArchiNET/ASF-ui/releases/tag/${uiVersion}`"></footer-statistic>
			<footer-statistic v-if="authenticated" name="ASF" :value="`${asfVersion} - ${buildVariant}`" :notify="notifyRelease && newAsfReleaseAvailable" :to="`https://github.com/JustArchiNET/ArchiSteamFarm/releases/tag/${asfVersion}`"></footer-statistic>
		</div>
	</footer>
</template>

<script>
	import FooterLink from './FooterLink.vue';
	import FooterStatistic from "./FooterStatistic.vue";

	import { mapGetters } from 'vuex';
	import { ui, newReleaseAvailable } from "../utils/ui";

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
				try {
					this.newUiReleaseAvailable = await newReleaseAvailable('ASF-ui', ui.version);
					this.newAsfReleaseAvailable = await newReleaseAvailable('ArchiSteamFarm', this.asfVersion);
				} catch (err) {
					if (err.message === 'HTTP Error 504') return;
					this.$error(err.message);
				}
			}
		}
	};
</script>

<style lang="scss">
	.footer {
		align-items: center;
		background: var(--color-background-light);
		border-top: 1px solid var(--color-border);
		box-sizing: border-box;
		display: flex;
		font-size: .9em;
		grid-area: footer;
		height: var(--navigation-height);
		padding: 0 .5em;
		width: 100%;
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
