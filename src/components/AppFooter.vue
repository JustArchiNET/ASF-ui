<template>
	<footer class="footer">
		<div class="footer__links">
			<footer-link name="GitHub" prefix="fab" icon="github" to="https://github.com/JustArchiNET"></footer-link>
			<footer-link :name="$t('wiki')" icon="book" to="https://github.com/JustArchiNET/ArchiSteamFarm/wiki"></footer-link>
			<footer-link v-if="authenticated" :name="$t('changelog')" icon="calendar-check" :to="asfReleaseUrl"></footer-link>
		</div>

		<div class="footer__statistics">
			<div v-if="authenticated" class="footer__statistic">
				<font-awesome-icon class="footer__statistic-value--notify" :title="$t('update-available')" icon="exclamation" size="sm">{{ $t('update-available') }}</font-awesome-icon>
				<span class="footer__statistic-name">ASF</span>
				<span class="footer__statistic-value">{{ asfVersionString }}</span>
			</div>
		</div>
	</footer>
</template>

<script>
	import { mapGetters } from 'vuex';
	import FooterLink from './FooterLink.vue';
	import { ui, newReleaseAvailable } from '../utils/ui';
	import delay from '../utils/delay';
	import { get } from '../utils/storage';

	export default {
		name: 'app-footer',
		components: { FooterLink },
		data() {
			return {
				uiRelease: ui.release,
				uiReleaseShort: ui.release.slice(0, 7),
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
				return `${this.asfVersion} - ${this.buildVariant} - ${this.uiReleaseShort}`;
			},
			asfReleaseUrl() {
				const version = this.asfReleaseAvailable ? get('version-latest-ArchiSteamFarm') : this.asfVersion;
				return `https://github.com/JustArchiNET/ArchiSteamFarm/releases/tag/${version}`;
			}
		},
		async mounted() {
			await delay(3000);
			if (this.authenticated && this.notifyRelease) this.getNewVersions();
		},
		methods: {
			async getNewVersions() {
				try {
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
