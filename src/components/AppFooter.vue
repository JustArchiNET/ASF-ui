<template>
  <footer class="footer">
    <div class="footer__links">
      <footer-link name="GitHub" prefix="fab" icon="github" to="https://github.com/JustArchiNET"></footer-link>
      <footer-link :name="$t('wiki')" icon="book-open" to="https://github.com/JustArchiNET/ArchiSteamFarm/wiki"></footer-link>
      <footer-link v-if="authenticated" :name="$t('changelog')" icon="calendar-check" :to="releaseUrl"></footer-link>
    </div>

    <div v-if="authenticated" class="footer__statistic">
      <font-awesome-icon v-if="releaseAvailable" class="footer__statistic-notify" :title="$t('update-available')" icon="exclamation" size="sm"></font-awesome-icon>
      <span class="footer__statistic-name">ASF</span>
      <span class="footer__statistic-value">{{ versionString }}</span>
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
        releaseAvailable: false,
        uiHash: ui.gitCommitHash,
      };
    },
    computed: {
      ...mapGetters({
        authenticated: 'auth/authenticated',
        version: 'asf/version',
        buildVariant: 'asf/buildVariant',
        notifyRelease: 'settings/notifyRelease',
      }),
      versionString() {
        return `${this.version} - ${this.buildVariant} - ${this.uiHash}`;
      },
      releaseUrl() {
        const v = this.releaseAvailable ? get('latest-release') : this.version;
        return `https://github.com/JustArchiNET/ArchiSteamFarm/releases/tag/${v}`;
      },
    },
    async mounted() {
      await delay(3000);
      if (this.authenticated) this.checkForNewRelease();
    },
    methods: {
      async checkForNewRelease() {
        try {
          const newVersionAvailable = await newReleaseAvailable();
          this.releaseAvailable = newVersionAvailable;
          if (newVersionAvailable && this.notifyRelease) {
            const notification = this.$snotify.info(this.$t('update-available'), this.$t('info'));
            notification.on('click', toast => this.$router.push({ name: 'releases' }));
          }
        } catch (err) {
          if (err.message === 'HTTP Error 504') return;
          this.$error(err.message);
        }
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
		color: #ffa500;
		padding-right: 0.2em;
	}
</style>
