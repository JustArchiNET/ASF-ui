<template>
	<div class="releases">
		<h3 v-if="loading && !statusText" class="subtitle">
			<font-awesome-icon icon="spinner" size="lg" spin></font-awesome-icon>
		</h3>

		<h3 v-if="statusText" class="subtitle">
			{{ statusText }}
		</h3>

		<div v-for="release in releases" v-else class="release">
			<div class="release__title">
				<span class="release__version">v{{ release.version }}</span>
				<span class="release__badge" :class="[release.stable ? 'release__badge--stable' : 'release__badge--prerelease']">{{ release.stable ? $t('stable') : $t('pre-release') }}</span>
				<span class="release__time">{{ getTimeText(release.publishedAt) }}</span>
			</div>

			<div class="release__changes" v-html="release.changelog"></div>

			<a class="release__changelog-link" :href="`https://github.com/JustArchiNET/ArchiSteamFarm/releases/tag/${release.version}`" target="_blank">{{ $t('changelog-full') }}</a>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
	import humanizeDuration from 'humanize-duration';
	import getLocaleForHD from '../utils/getLocaleForHD';
	import * as storage from '../utils/storage';
	import compareVersion from '../utils/compareVersion';

	export default {
		name: 'asf-releases',
		data() {
			return {
				loading: true,
				error: null,
				releases: [],
				releaseCount: 5
			};
		},
		computed: {
			...mapGetters({ version: 'asf/version' }),
			statusText() {
				if (this.error) return this.error;
				if (!this.loading && !this.releases.length) return this.$t('releases-not-found');
			}
		},
		async created() {
			try {
				this.releases = await this.loadReleases();
				this.loading = false;
			} catch (err) {
				this.error = err.message;
			}
		},
		methods: {
			getTimeText(releaseDate) {
				const language = getLocaleForHD();
				const releasedSeconds = new Date() - new Date(releaseDate);
				const time = humanizeDuration(releasedSeconds, { language, largest: 2 });
				return this.$t('released-ago', { time });
			},
			async loadReleases() {
				const releasesCache = storage.get('cache:releases');
				if (releasesCache) {
					const { timestamp, releases, version } = releasesCache;
					if (version === this.version && timestamp > Date.now() - 24 * 60 * 60 * 1000) return releases;
				}

				const releases = await this.fetchReleases();
				storage.set('cache:releases', { timestamp: Date.now(), releases, version: this.version });
				return releases;
			},
			async fetchReleases() {
				const releases = [];

				releases.push(await this.fetchRelease()); // Fetch latest release
				if (!releases[0] || !releases[0].stable) releases.push(await this.fetchRelease('latest')); // If the latest releases is not stable, fetch latest stable release
				if (!releases.some(release => release.version === this.version)) releases.push(await this.fetchRelease(this.version)); // If current version is neither latest nor latest stable, fetch it

				return releases
					.filter((value, index) => !!value && releases.findIndex(release => release.version === value.version) === index) // Clean the list in case any of the fetches failed, remove any duplicates
					.sort((lhs, rhs) => compareVersion(rhs.version, lhs.version)); // Order the releases descending by version
			},
			async fetchRelease(version = '') {
				try {
					const release = await this.$http.get(`www/github/release/${version}`);
					const publishedAt = new Date(release.ReleasedAt);
					return {
						changelog: release.ChangelogHTML,
						stable: release.Stable,
						version: release.Version,
						publishedAt
					};
				} catch (err) {}
			}
		}
	};
</script>

<style lang="scss">
	.releases {
		word-break: break-word;
	}

	.release {
		border-bottom: 1px solid var(--color-background);
		margin-bottom: 1em;
		padding-bottom: 1em;

		&:last-child {
			border-bottom: none;
			margin-bottom: 0;
			padding-bottom: 0;
		}
	}

	.release__title {
		align-items: center;
		display: flex;
		margin-top: 0;

		@media screen and (max-width: 350px) {
			align-items: flex-start;
			flex-direction: column;
		}
	}

	.release__version {
		font-size: 1.3em;
		font-weight: bold;
	}

	.release__time {
		margin-left: auto;

		@media screen and (max-width: 350px) {
			margin-left: 0;
		}
	}

	.release__badge {
		background-color: var(--color-background-light);
		border: 2px solid currentColor;
		border-radius: 4px;
		display: inline-block;
		line-height: 1;
		margin-left: 0.5em;
		padding: 0.25em 0.5em;
		text-align: center;
		vertical-align: baseline;

		@media screen and (max-width: 350px) {
			margin-left: 0;
		}
	}

	.release__badge--prerelease {
		color: #a92616;
	}

	.release__badge--stable {
		color: #00a65a;
	}

	.release__changelog-link {
		color: var(--color-theme);
		font-weight: 600;
		text-decoration: none;
	}

	.release__changes {
		font-family: monospace, monospace;

		a {
			color: var(--color-theme);
			text-decoration: none;
		}

		ul {
			@media screen and (max-width: 450px) {
				margin-inline-end: 0.2em;
				margin-inline-start: 0.2em;
				padding-inline-start: 1.2em;
			}
		}
	}
</style>
