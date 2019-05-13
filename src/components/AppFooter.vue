<template>
	<footer class="footer">
		<div class="footer__links">
			<footer-link name="GitHub" prefix="fab" icon="github" to="https://github.com/JustArchiNET"></footer-link>
			<footer-link :name="$t('wiki')" icon="book" to="https://github.com/JustArchiNET/ArchiSteamFarm/wiki"></footer-link>
			<footer-link v-if="authenticated" :name="$t('changelog')" icon="calendar-check" :to="asfReleaseUrl"></footer-link>
		</div>

		<div class="footer__statistics">
			<footer-statistic :name="$t('ui')" :value="uiVersion" :notify="uiReleaseAvailable" :to="uiReleaseUrl"></footer-statistic>
			<footer-statistic v-if="authenticated" name="ASF" :value="asfVersionString" :notify="asfReleaseAvailable" :to="asfReleaseUrl"></footer-statistic>
		</div>
	</footer>
</template>

<script>
	import { mapGetters } from 'vuex';
	import FooterLink from './FooterLink.vue';
	import FooterStatistic from './FooterStatistic.vue';
	import { ui, newReleaseAvailable } from '../utils/ui';
	import delay from '../utils/delay';
	import { get } from '../utils/storage';

	export default {
		name: 'app-footer',
		components: { FooterLink, FooterStatistic },
		data() {
			return {
				uiVersion: ui.version,
				uiReleaseAvailable: false,
				asfReleaseAvailable: false
			};
		},
		computed: {
			...mapGetters({
				authenticated: 'auth/authenticated',
				asfVersion: 'asf/version',
				buildVariant: 'asf/buildVariant',
				notifyRelease: 'settings/notifyRelease'
			}),
			asfVersionString() {
				return `${this.asfVersion} - ${this.buildVariant}`;
			},
			asfReleaseUrl() {
				const version = this.asfReleaseAvailable ? get('version-latest-ArchiSteamFarm') : this.asfVersion;
				return `https://github.com/JustArchiNET/ArchiSteamFarm/releases/tag/${version}`;
			},
			uiReleaseUrl() {
				const version = this.uiReleaseAvailable ? get('version-latest-ASF-ui') : this.uiVersion;
				return `https://github.com/JustArchiNET/ASF-ui/releases/tag/${version}`;
			}
		},
		async mounted() {
			await delay(3000);
			if (this.authenticated && this.notifyRelease) this.getNewVersions();
		},
		methods: {
			async getNewVersions() {
				try {
					this.uiReleaseAvailable = await newReleaseAvailable('ASF-ui', this.uiVersion);
					this.asfReleaseAvailable = await newReleaseAvailable('ArchiSteamFarm', this.asfVersion);
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
		font-size: 0.9em;
		grid-area: footer;
		height: var(--navigation-height);
		padding: 0 0.5em;
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
