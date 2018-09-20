<template>
    <div class="container">
        <div v-if="releases['message']">
            <h3>We have encountered an Error while fetching the latest releases from GitHub</h3>
        </div>
        <div v-for="(release, i) in releases" v-if="!releases['message'] && releases.length > 0 && i < releaseCount">
            <h3>v{{release.Version}} 
                <span class="badge stable" v-if="release.Stable">Stable</span>
                <span class="badge prerelease" v-else>Pre-Release</span>            
            </h3>
            <span v-if="release.ReleasedFor.Days < 1">
                Released {{release.ReleasedFor.Hours}} hours ago
            </span>
            <span v-else-if="release.ReleasedFor.Hours < 1">
                Released {{release.ReleasedFor.Minutes}} minutes ago
            </span>
            <span v-else-if="release.ReleasedFor.Minutes < 1">
                Released just now
            </span>
            <span v-else-if="release.ReleasedFor.Days < 30">
                Released {{release.ReleasedFor.Days}} days ago
            </span>
            <span v-else>
                Released on {{release.Date.toLocaleString("en-GB", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit', timeZoneName: 'short', timeZone: 'UTC'})}}
            </span>
            <ul>
                <li v-for="change in release.Changes">
                    {{change}}
                </li>
            </ul>
            <a :href="release.URL" class="changelog-link" target="_blank">full Changelog for this version</a>
        </div>
    </div>
</template>

<script>
    import { get, post } from '../utils/http';

    export default {
        name: 'changelog',
        data() {
            return {
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
                return (await get("WWW/MarkdownToText?text=" + encodeURIComponent(text))).replace(/ \(ref: #\d+\)/,"");
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

                result.Version = release["tag_name"];
                result.Stable = !release["prerelease"];
                result.URL = release["html_url"];
                result.Date = new Date(release["published_at"]);

                result.ReleasedFor = {};
                let timeDiff = new Date() - result.Date;
                let days = result.ReleasedFor.Days = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); timeDiff -= days * (1000 * 60 * 60 * 24);
                let hours = result.ReleasedFor.Hours = Math.floor(timeDiff / (1000 * 60 * 60)); timeDiff -= hours * (1000 * 60 * 60);
                let minutes = result.ReleasedFor.Minutes = Math.floor(timeDiff / (1000 * 60));

                result.Changes = [];
                let changes = release["body"];
                const regex = /\n- .*\r/g;
                let match;
                do {
                    match = regex.exec(changes);
                    if(match){
                        result.Changes.push(await this.removeMarkdownAndRefs(match[0]));
                    }
                } while (match);

                return result;
            }
        },
        async created() {
            let response = JSON.parse(await this.getReleases());
            if(response.message !== undefined){
                this.releases = response;
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
