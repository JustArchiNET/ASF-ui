<template>
	<div class="container">
		<div v-if="loading">
			<h3>Loading changelog..</h3>
		</div>

		<div v-else-if="error">
			<h3>{{ error }}</h3>
		</div>

		<div class="release" v-for="release in releases" v-else>
			<div class="release__title">
				<span class="release__version">v{{ release.version }}</span>
				<span class="release__badge" :class="[release.isStable ? 'release__badge--stable' : 'release__badge--prerelease']">{{ release.isStable ? 'Stable': 'Pre-Release' }}</span>
				<span class="release__time">{{ getTimeText(release) }}</span>
			</div>


			<ul class="release__changes">
				<li class="release__change" v-for="change in release.changes">{{ change }}</li>
			</ul>

			<a class="release__changelog-link" :href="release.changelogURL" target="_blank">Full Changelog</a>
		</div>
	</div>
</template>

<script>
	import { get, post } from '../utils/http';
	import { timeDifference } from '../utils/time';

	const changelogRegex = /\n- .*\r/g;

	export default {
		name: 'changelog',
		data() {
			return {
				loading: false,
				error: null,
				releases: [],
				releaseCount: 5
			};
		},
		methods: {
			async getReleases() {
				return await post('WWW/Send', {
					URL: 'https://api.github.com/repos/JustArchi/ArchiSteamFarm/releases'
				});
			},
			async removeMarkdown(text) {
				return await get('WWW/MarkdownToText', { text });
			},
			async parseReleases(releases) {
				console.time('parse-releases');
				const result = [];

				const releasesToShow = releases.slice(0, this.releaseCount);
				for (const release of releasesToShow) {
					result.push(await this.parseRelease(release));
				}

				console.timeEnd('parse-releases');
				return result;
			},
			async parseRelease(release) {
				const rawChanges = [];

				let match;
				while (match = changelogRegex.exec(release.body)) {
					rawChanges.push(match[0].replace(/ \(ref: #\d+\)/, ''));
				}

				const changes = (await this.removeMarkdown(rawChanges.join('||'))).split('||').map(change => change.trim()); // TODO: Find a better solution
				const publishDate = new Date(release.published_at);

				return {
					version: release.tag_name,
					isStable: !release.prerelease,
					releasedFor: timeDifference(publishDate),
					changelogURL: release.html_url,
					publishDate,
					changes
				};
			},
			getTimeText({ releasedFor, publishDate }) {
				if (releasedFor.days > 30) return `Released on ${ publishDate.toLocaleString('en-GB', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short', timeZone: 'UTC' }) }`;
				if (releasedFor.days > 1) return `Released ${releasedFor.days} days ago`;
				if (releasedFor.hours > 1) return `Released ${releasedFor.hours} hours ago`;
				if (releasedFor.minutes > 1) return `Released ${releasedFor.minutes} minutes ago`;
				return 'Released just now';
			}
		},
		async created() {
			const response = JSON.parse(await this.getReleases());
			this.loading = false;

			if (response.message) {
				this.error = 'We have encountered an error while fetching the latest releases from GitHub';
				return;
			}

			this.releases = await this.parseReleases(response);
		}
	};
</script>

<style lang="scss">
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
	}

	.release__version {
		font-weight: bold;
		font-size: 1.3em;
	}

	.release__time {
		margin-left: auto;
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
</style>
