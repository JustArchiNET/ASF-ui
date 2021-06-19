<template>
  <footer class="footer">
    <div class="footer__links">
      <FooterLink name="GitHub" prefix="fab" icon="github" to="https://github.com/JustArchiNET"></FooterLink>
      <FooterLink :name="$t('discussions')" icon="comments" to="https://github.com/JustArchiNET/ArchiSteamFarm/discussions"></FooterLink>
      <FooterLink :name="$t('wiki')" icon="book-open" :to="wikiLink"></FooterLink>
    </div>

    <div v-if="authenticated" class="footer__statistic">
      <FontAwesomeIcon v-if="newReleaseAvailable" class="footer__statistic-notify" :title="$t('update-available')" icon="exclamation" size="sm" @click="redirectToReleases"></FontAwesomeIcon>
      <span class="footer__statistic-name">ASF</span>
      <span class="footer__statistic-value">{{ versionString }}</span>
    </div>
  </footer>
</template>

<script>
  import { mapGetters } from 'vuex';
  import FooterLink from '../FooterLink.vue';
  import { ui, isReleaseAvailable } from '../../utils/ui';
  import delay from '../../utils/delay';

  export default {
    name: 'AppFooter',
    components: { FooterLink },
    data() {
      return {
        newReleaseAvailable: false,
        uiHash: ui.gitCommitHash,
      };
    },
    computed: {
      ...mapGetters({
        authenticated: 'auth/authenticated',
        version: 'asf/version',
        buildVariant: 'asf/buildVariant',
        notifyRelease: 'settings/notifyRelease',
        updatesEnabled: 'asf/updatesEnabled',
        canUpdate: 'asf/canUpdate',
      }),
      versionString() {
        return `${this.version} - ${this.buildVariant} - ${this.uiHash}`;
      },
      wikiLink() {
        // Keep this for the future. ASF-ui will also be translated at some point.
        // const locale = (this.$i18n.locale !== 'en-US') ? `/Home-${this.$i18n.locale}` : '';
        // return `https://github.com/JustArchiNET/ASF-ui/wiki${locale}`;
        return 'https://github.com/JustArchiNET/ASF-ui/wiki';
      },
    },
    async mounted() {
      await delay(3000);
      if (this.authenticated && this.updatesEnabled && this.canUpdate) this.checkForNewRelease();
    },
    methods: {
      async checkForNewRelease() {
        try {
          this.newReleaseAvailable = await isReleaseAvailable();
          if (this.newReleaseAvailable && this.notifyRelease && this.$route.name !== 'releases') {
            const notification = this.$snotify.info(this.$t('update-available'), this.$t('info'));
            notification.on('click', toast => this.redirectToReleases());
          }
        } catch (err) {
          if (err.message === 'HTTP Error 504') return;
          this.$error(err.message);
        }
      },
      redirectToReleases() {
        if (this.$route.name !== 'releases') this.$router.push({ name: 'releases' });
      },
    },
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

	.footer__statistic {
		margin-left: auto;
		text-align: center;
	}

	.footer__statistic-name {
		color: var(--color-theme);
		font-weight: 700;
	}

	.footer__statistic-notify {
		color: var(--color-text-info);
    padding-right: 0.2em;
    cursor: pointer;
	}
</style>
