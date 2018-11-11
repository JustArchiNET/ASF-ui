<template>
	<div class="changelog">
		<h3 class="subtitle" v-if="loading && !statusText">
			<font-awesome-icon icon="spinner" size="lg" spin></font-awesome-icon>
		</h3>

		<h3 class="subtitle" v-if="statusText">{{ statusText }}</h3>

		<div class="release" v-for="release in releases" v-else>
			<div class="release__title">
				<span class="release__version">v{{ release.version }}</span>
				<span class="release__badge" :class="[release.stable ? 'release__badge--stable' : 'release__badge--prerelease']">{{ release.stable ? $t('stable') : $t('pre-release') }}</span>
				<span class="release__time">{{ getTimeText(release) }}</span>
			</div>

			<div class="release__changes" v-html="release.changelog"></div>

			<a class="release__changelog-link" :href="`https://github.com/JustArchiNET/ArchiSteamFarm/releases/tag/${release.version}`" target="_blank">{{ $t('changelog-full') }}</a>
		</div>
	</div>
</template>

<script>
	import { timeDifference } from '../utils/timeDifference';
	import * as storage from '../utils/storage';
	import { mapGetters } from 'vuex';

	export default {
		name: 'changelog',
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
		methods: {
			async getReleases() {
				return await this.$http.get('WWW/GitHub/Releases');
			},
			getTimeText({ releasedFor, publishDate }) {
				if (releasedFor.days > 30) return this.$t('released-on', {
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

				storage.set('cache:releases', JSON.stringify({ timestamp: Date.now(), releases, version: this.version }));
				return releases;
			}
		},
		async created() {
			try {
				this.releases = await this.loadReleases();
				this.loading = false;
			} catch (err) {
				this.error = err.message;
			}
		}
	};
</script>

<style lang="scss">
	.changelog {
		word-break: break-word;
	}

	.release {
		margin-bottom: 1em;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.release__title {
		display: flex;
		align-items: center;
		margin-top: 0;

		@media screen and (max-width: 600px) {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	.release__version {
		font-weight: bold;
		font-size: 1.3em;
	}

	.release__time {
		margin-left: auto;

		@media screen and (max-width: 600px) {
			margin-left: 0;
		}
	}

	.release__badge {
		background-color: var(--color-background-light);
		border-radius: 4px;
		border: 2px solid currentColor;
		padding: .25em .5em;
		margin-left: .5em;
		display: inline-block;
		line-height: 1;
		text-align: center;
		vertical-align: baseline;

		@media screen and (max-width: 600px) {
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
	}
</style>
