<template>
    <div class="container">
        <div v-if="rateLimited">
            <h3>We have encountered an error while fetching the latest releases from GitHub</h3>
        </div>
        <div v-else v-for="release in releases">
            <h3>v{{release.version}} 
                <span class="badge" v-bind:class="{ 'stable': release.isStable, 'prerelease': !release.isStable }">{{release.isStable ? "Stable": "Pre-Release"}}</span>
            </h3>
            <span>{{getTimeText(release)}}</span>
            <ul>
                <li v-for="change in release.changes">
                    {{change}}
                </li>
            </ul>
            <a :href="release.url" class="changelog-link" target="_blank">Full Changelog for this version</a>
        </div>
    </div>
</template>

<script>
    import { get, post } from '../utils/http';
    import { timeDifference } from '../utils/time';

    export default {
        name: 'changelog',
        data() {
            return {
                rateLimited: false,
                releases: [],
                releaseCount: 5
            };
        },
        methods: {
            async getReleases() {
                return await post("WWW/Send", {
                URL: "https://api.github.com/repos/JustArchi/ArchiSteamFarm/releases"
                });
            },
            async removeMarkdownAndRefs(text) {
                return await get("WWW/MarkdownToText", { "text":  text.replace(/ \(ref: #\d+\)/,"") });
            },
            async parseReleases(response){
                let releases = [];
                let i = 0;

                for(const release of response){
                    if(++i >= this.releaseCount){
                        break;
                    }
                    releases.push(await this.parseRelease(release));
                }

                return releases;
            },
            async parseRelease(release){
                let result = {};

                result.version = release.tag_name;
                result.isStable = !release.prerelease;
                result.url = release.html_url;
                result.date = new Date(release.published_at);
                result.releasedFor = timeDifference(result.date, new Date());

                result.changes = [];
                let changes = release.body;
                const regex = /\n- .*\r/g;
                let match;
                do {
                    match = regex.exec(changes);
                    if(match){
                        result.changes.push(await this.removeMarkdownAndRefs(match[0]));
                    }
                } while (match);

                return result;
            },
            getTimeText(release){
                if(release.releasedFor.days < 1){
                    return `Released ${release.releasedFor.hours} hours ago`;
                }

                if(release.releasedFor.hours < 1){
                    return `Released ${release.releasedFor.minutes} minutes ago`;
                }

                if(release.releasedFor.minutes < 1){
                    return "Released just now";
                }

                if(release.releasedFor.days < 30){
                    return `Released ${release.releasedFor.days} days ago`;
                }

                return `Released on ${ release.date.toLocaleString("en-GB", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit', timeZoneName: 'short', timeZone: 'UTC'}) }`;
            }
        },
        async created() {
            let response = JSON.parse(await this.getReleases());
            if(response.message !== undefined){
                this.rateLimited = true;
                return;
            }
            
            this.releases = await this.parseReleases(response);
        }
    };
</script>

<style lang="scss">
    .badge {
        background-color: var(--color-background-light);

        border-radius: .25rem;
        border-width: 1px;
        border-style: solid;

        padding: .25em .4em;
        margin-left: .5em;
        font-size: 75%;
        display: inline-block;
        line-height: 1;
        text-align: center;
        vertical-align: baseline;
    }

    .badge {
        &.prerelease {
            color: #a92616;
        }

        &.stable {
            color: #00a65a;
        }
    }

    .changelog-link {
        color: var(--color-theme);
        font-weight: bold;
        text-decoration: none;
    }
</style>
