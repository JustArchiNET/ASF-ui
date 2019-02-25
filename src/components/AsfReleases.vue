<template>
	<div class="releases">
		<h3 v-if="loading && !statusText" class="subtitle">
			<font-awesome-icon icon="spinner" size="lg" spin />
		</h3>

		<h3 v-if="statusText" class="subtitle">
			{{ statusText }}
		</h3>

		<div v-for="release in releases" v-else class="release">
			<div class="release__title">
				<span class="release__version">v{{ release.version }}</span>
				<span class="release__badge" :class="[release.stable ? 'release__badge--stable' : 'release__badge--prerelease']">{{ release.stable ? $t('stable') : $t('pre-release') }}</span>
				<span class="release__time">{{ getTimeText(release) }}</span>
			</div>

			<div class="release__changes" v-html="release.changelog" />

			<a class="release__changelog-link" :href="`https://github.com/JustArchiNET/ArchiSteamFarm/releases/tag/${release.version}`" target="_blank">{{ $t('changelog-full') }}</a>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
	import { timeDifference } from '../utils/timeDifference';
	import * as storage from '../utils/storage';

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
				if (!this.loading && !this.releases.length) return 'No releases found!';
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
			async getReleases() {
				return await this.$http.get('www/github/releases');
			},
			getTimeText({ releasedFor, publishDate }) {
				if (releasedFor.days > 30) {
					return this.$t('released-on', {
						date: (new Date(publishDate)).toLocaleString({
							weekday: 'short',
							year: 'numeric',
							month: 'short',
							day: 'numeric',
							hour: '2-digit',
							minute: '2-digit',
							timeZoneName: 'short'
						})
					});
				}

				if (releasedFor.days > 1) return this.$t('released-ago-days', { n: releasedFor.days }, releasedFor.days);
				if (releasedFor.hours > 1) return this.$t('released-ago-hours', { n: releasedFor.hours }, releasedFor.hours);
				if (releasedFor.minutes > 1) return this.$t('released-ago-minutes', { n: releasedFor.minutes }, releasedFor.minutes);
				return this.$t('released-now');
			},
			async loadReleases() {
				const releasesCache = storage.get('cache:releases');
				if (releasesCache) {
					const { timestamp, releases, version } = releasesCache;
					if (version === this.version && timestamp > Date.now() - 24 * 60 * 60 * 1000) return releases;
				}

				const [latestRelease, ...olderReleases] = await this.getReleases();
				const releases = [latestRelease, ...olderReleases.filter(release => release.Stable || release.Version === this.version)]
					.map(release => {
						const publishDate = new Date(release.ReleasedAt);

						return {
							changelog: release.ChangelogHTML,
							releasedFor: timeDifference(publishDate),
							stable: release.Stable,
							version: release.Version,
							publishDate
						};
					});

				storage.set('cache:releases', { timestamp: Date.now(), releases, version: this.version });
				return releases;
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
