<template>
  <div class="releases">
    <h3 v-if="loading && !statusText" class="subtitle">
      <FontAwesomeIcon icon="spinner" size="lg" spin></FontAwesomeIcon>
    </h3>

    <h3 v-if="statusText" class="subtitle">
      {{ statusText }}
    </h3>

    <div v-for="(release, i) in releases" v-else :key="i" class="release">
      <div class="release__title">
        <span class="release__version">v{{ release.version }}</span>
        <span class="release__badge" :class="[release.stable ? 'release__badge--stable' : 'release__badge--prerelease']">{{ release.stable ? $t('stable') : $t('pre-release') }}</span>
        <span v-if="updatesEnabled && canUpdate && isLatestForUpdateChannel(i) && isNewer(release.version)" class="release__badge release__badge--install" @click="update">{{ $t('releases-install') }}</span>
        <span class="release__time">{{ getTimeText(release.publishedAt) }}</span>
      </div>

      <div class="release__changes" v-html="release.changelog"></div>

      <a class="release__changelog-link" target="_blank" rel="noreferrer noopener" :href="`https://github.com/JustArchiNET/ArchiSteamFarm/releases/tag/${release.version}`">{{ $t('changelog-full') }}</a>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import humanizeDuration from 'humanize-duration';
  import linkifyHtml from 'linkifyjs/html';
  import getLocaleForHD from '../utils/getLocaleForHD';
  import * as storage from '../utils/storage';
  import compareVersion from '../utils/compareVersion';
  import waitForRestart from '../utils/waitForRestart';
  import { UPDATECHANNEL } from '../store/modules/asf';

  export default {
    name: 'AsfReleases',
    data() {
      return {
        loading: true,
        error: null,
        releases: [],
        releaseCount: 5,
        updating: false,
      };
    },
    computed: {
      ...mapGetters({
        version: 'asf/version',
        updateChannel: 'asf/updateChannel',
        updatesEnabled: 'asf/updatesEnabled',
        canUpdate: 'asf/canUpdate',
      }),
      statusText() {
        if (this.error) return this.error;
        if (!this.loading && !this.releases.length) return this.$t('releases-not-found');
      },
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
        const time = humanizeDuration(releasedSeconds, {
          language,
          largest: 2,
          maxDecimalPoints: 0,
          conjunction: this.$t('released-ago-conjunction'),
        });
        return this.$t('released-ago', { time });
      },
      isLatestForUpdateChannel(i) {
        if (this.updateChannel === UPDATECHANNEL.EXPERIMENTAL && i === 0) return true;
        if (this.updateChannel === UPDATECHANNEL.STABLE && i === 1) return true;
        return false;
      },
      isNewer(version) {
        if (version > this.version) return true;
        return false;
      },
      async update() {
        if (this.updating) return;
        this.updating = true;

        const notification = this.$snotify.info(this.$t('update-trying'), this.$t('info'));
        notification.on('click', toast => this.$router.push({ name: 'log' }));

        try {
          await this.$http.post('asf/update');
          await waitForRestart();
          this.$success(this.$t('update-complete'));
        } catch (err) {
          if (!err.result && !err.message.includes('≥')) throw err;
          const { remoteVersion, localVersion } = this.extractVersions(err);
          if (localVersion === remoteVersion) this.$info(this.$t('update-is-up-to-date'));
          else this.$info(this.$t('update-is-newest'));
        } finally {
          this.updating = false;
        }
      },
      async loadReleases() {
        const releasesCache = storage.get('cache:releases');

        if (releasesCache) {
          const { timestamp, releases, version } = releasesCache;
          const currentTimestamp = Date.now() - 60 * 60 * 1000;
          let isReadable = true;

          releases.forEach(r => {
            const cl = r.changelog;
            if (!cl || !cl.startsWith('<p>Changes since')) isReadable = false;
          });

          if (version === this.version && timestamp > currentTimestamp && isReadable) return releases;
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
          const linkifyOptions = { ignoreTags: ['code'] };
          let changelog = linkifyHtml(release.ChangelogHTML, linkifyOptions).replace(/<a href="/g, '<a target="_blank" rel="noreferrer noopener" href="');
          if (!changelog) changelog = this.$t('releases-changelog');
          return {
            changelog,
            stable: release.Stable,
            version: release.Version,
            publishedAt,
          };
        } catch (err) {
          console.warn(err.message);
        }
      },
    },
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

		@media screen and (max-width: 400px) {
			align-items: flex-start;
			flex-direction: column;
      gap: 4px;
		}
	}

	.release__version {
		font-size: 1.3em;
		font-weight: bold;
	}

	.release__time {
		margin-left: auto;

		@media screen and (max-width: 400px) {
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

		@media screen and (max-width: 400px) {
			margin-left: 0;
		}
	}

	.release__badge--prerelease {
		color: #a92616;
	}

	.release__badge--stable {
		color: #00a65a;
	}

  .release__badge--install {
    color: var(--color-text-info);
    cursor: pointer;
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

    details {
      margin-bottom: 1em;
    }

    summary {
      cursor: pointer;
    }

    pre {
      white-space: pre-wrap;
      padding: 0.5em 1em;
      font-size: 90%;
      background-color: #2d333b;
      border-radius: 3px;
      color: var(--color-releases-pre);

      > code {
        background-color: inherit;
      }
    }
	}
</style>
