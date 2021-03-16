<template>
  <div class="brand" @click="toggleBrandMenu">
    <span class="brand__name brand__name--small"><b>A</b>SF</span>
    <span class="brand__name brand__name--big"><b>Archi</b>SteamFarm</span>
    <div v-if="authenticated" class="brand__icon">
      <FontAwesomeIcon v-if="brandMenu" icon="times"></FontAwesomeIcon>
      <FontAwesomeIcon v-else icon="angle-down"></FontAwesomeIcon>
    </div>

    <transition name="brand__menu">
      <div v-if="brandMenu && authenticated" class="brand__menu">
        <div v-if="updatesEnabled && canUpdate" class="brand__menu-item" @click="update">
          <FontAwesomeIcon class="brand__menu-icon" icon="cloud-download-alt" fixed-width></FontAwesomeIcon>
          <span>{{ $t('update') }}</span>
        </div>

        <div class="brand__menu-item" @click="restart">
          <FontAwesomeIcon class="brand__menu-icon" icon="undo-alt" fixed-width></FontAwesomeIcon>
          <span>{{ $t('restart') }}</span>
        </div>

        <div class="brand__menu-item" @click="shutdown">
          <FontAwesomeIcon class="brand__menu-icon" icon="power-off" fixed-width></FontAwesomeIcon>
          <span>{{ $t('shutdown') }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import { isReleaseAvailable } from '../utils/ui';
  import delay from '../utils/delay';
  import waitForRestart from '../utils/waitForRestart';

  export default {
    name: 'NavigationBrand',
    data() {
      return {
        brandMenu: false,
        restarting: false,
        updating: false,
      };
    },
    computed: mapGetters({
      authenticated: 'auth/authenticated',
      version: 'asf/version',
      updatesEnabled: 'asf/updatesEnabled',
      sideMenu: 'layout/sideMenu',
      canUpdate: 'asf/canUpdate',
    }),
    watch: {
      brandMenu(value) {
        if (value) window.addEventListener('click', this.onWindowClick);
        else window.removeEventListener('click', this.onWindowClick);
      },
    },
    beforeDestroy() {
      window.removeEventListener('click', this.onWindowClick);
    },
    methods: {
      ...mapActions({
        setSideMenu: 'layout/setSideMenu',
      }),
      toggleBrandMenu() {
        if (this.sideMenu) this.setSideMenu(false);
        this.brandMenu = !this.brandMenu;
      },
      extractVersions(err) {
        if (err.result) {
          // Extract version from result, if available
          return {
            remoteVersion: err.result,
            localVersion: this.$store.getters['asf/version'],
          };
        }

        if (err.message.includes('≥')) {
          // Fallback to message parsing
          const [localVersion, remoteVersion] = err.message.split(' ≥ ');
          return { remoteVersion, localVersion };
        }

        // Return empty object to prevent throws on destructing if extraction failed
        // Shouldn't happen, but who knows...
        return {};
      },
      async update() {
        if (this.updating) return;
        this.updating = true;

        this.$info(this.$t('update-check'));
        const newVersionAvailable = await isReleaseAvailable();

        if (newVersionAvailable) {
          const notification = this.$snotify.info(this.$t('update-trying'), this.$t('info'));
          notification.on('click', toast => this.redirectToLog());
        }

        try {
          await this.$http.post('asf/update');
          this.brandMenu = false;
          await waitForRestart();
          this.$success(this.$t('update-complete'));
          await delay(3000);
          window.location.reload();
        } catch (err) {
          if (err.message === 'HTTP Error 504' || err.message === 'Network Error') {
            await waitForRestart();
            this.$success(this.$t('update-complete'));
            await delay(3000);
            window.location.reload();
          }
          if (!err.result && !err.message.includes('≥')) throw err;
          const { remoteVersion, localVersion } = this.extractVersions(err);
          if (localVersion === remoteVersion) this.$info(this.$t('update-is-up-to-date'));
          else this.$info(this.$t('update-is-newest'));
        } finally {
          this.updating = false;
        }
      },
      async restart() {
        if (this.restarting) return;
        this.restarting = true;

        try {
          await this.$http.post('asf/restart');
          this.$info(this.$t('restart-initiated'));
          this.brandMenu = false;
          await waitForRestart();
          this.$success(this.$t('restart-complete'));
          await delay(3000);
          window.location.reload();
        } catch (err) {
          this.$error(err.message);
        } finally {
          this.restarting = false;
        }
      },
      async shutdown() {
        try {
          await this.$http.post('asf/exit');
          this.$info(this.$t('shutdown-message'));
          this.brandMenu = false;
        } catch (err) {
          this.$error(err.message);
        }
      },
      onWindowClick($e) {
        const path = $e.path || $e.composedPath();
        if (path.includes(this.$el)) return;
        this.brandMenu = false;
      },
      redirectToLog() {
        if (this.$route.name !== 'log') this.$router.push({ name: 'log' });
      },
    },
  };
</script>

<style lang="scss">
	.brand {
		align-items: center;
		background: var(--color-theme-dark);
		box-sizing: border-box;
		color: var(--color-text);
		cursor: pointer;
		display: flex;
		height: var(--navigation-height);
		justify-content: space-between;
		padding: 0 1em;
		position: relative;
		transition: ease-in-out width .3s;
		width: var(--navigation-width);

		.app--not-authorized & {
			cursor: initial;
			justify-content: center;
		}

		.app--small-navigation & {
			flex-direction: column;
			justify-content: center;
			padding: 0;

			.brand__name--big {
				display: none;
			}

			.brand__icon {
				line-height: 0.5;
			}

			.brand__name--small {
				display: block;
			}
		}
	}

	.brand__name {
		font-size: 1.25em;
		overflow: hidden;
	}

	.brand__name--small {
		display: none;
	}

	.brand__menu {
		left: 0;
		position: absolute;
		top: var(--navigation-height);
		transform-origin: top;
		transition: transform .3s;
		width: 100%;
	}

	.brand__menu-item {
		align-items: center;
		background: var(--color-theme);
		color: var(--color-text);
		cursor: pointer;
		display: flex;
		height: var(--navigation-height);
		padding: 0 1.5em;

		.app--small-navigation & {
			justify-content: center;
			padding: 0;
		}

		&:hover {
			background: var(--color-theme-dark);
		}
	}

	.brand__menu-icon {
		margin-right: 0.5em;

		.app--small-navigation & {
			margin-right: 0;

			+ span {
				display: none;
			}
		}
	}

	.brand__menu-enter, .brand__menu-leave-to {
		transform: scaleY(0);
	}
</style>
