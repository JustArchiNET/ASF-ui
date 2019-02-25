<template>
	<div class="brand" @click="toggleBrandMenu">
		<span class="brand__name brand__name--small"><b>A</b>SF</span>
		<span class="brand__name brand__name--big"><b>Archi</b>SteamFarm</span>
		<div v-if="authenticated" class="brand__icon">
			<font-awesome-icon v-if="brandMenu" icon="times"></font-awesome-icon>
			<font-awesome-icon v-else icon="angle-down"></font-awesome-icon>
		</div>

		<transition name="brand__menu">
			<div class="brand__menu" v-if="brandMenu && authenticated">
				<div class="brand__menu-item" @click="update">
					<font-awesome-icon class="brand__menu-icon" icon="cloud-download-alt" fixed-width></font-awesome-icon>
					<span>{{ $t('update') }}</span>
				</div>

				<div class="brand__menu-item" @click="restart">
					<font-awesome-icon class="brand__menu-icon" icon="power-off" fixed-width></font-awesome-icon>
					<span>{{ $t('restart') }}</span>
				</div>

				<div class="brand__menu-item" @click="exit">
					<font-awesome-icon class="brand__menu-icon" icon="sign-out-alt" fixed-width></font-awesome-icon>
					<span>{{ $t('exit') }}</span>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import { composeVersionString } from '../utils/composeVersionString';
	import { newReleaseAvailable } from '../utils/ui';
	import waitForRestart from '../utils/waitForRestart';

	import { mapGetters } from 'vuex';

	export default {
		name: 'navigation-brand',
		data() {
			return {
				brandMenu: false,
				restarting: false
			};
		},
		computed: mapGetters({
			authenticated: 'auth/authenticated',
			version: 'asf/version'
		}),
		methods: {
			toggleBrandMenu() {
				this.brandMenu = !this.brandMenu;
			},
			extractVersions(err) {
				if (err.result) {
					// Extract version from result, if available
					return {
						remoteVersion: composeVersionString(err.result),
						localVersion: this.$store.getters['asf/version']
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
				try {
					this.$info(this.$t('update-check'));
					const newVersionAvailable = await newReleaseAvailable('ArchiSteamFarm', this.version);
					if (newVersionAvailable) this.$info(this.$t('update-trying'));
					const response = await this.$http.post('asf/update');
					this.brandMenu = false;

					if (response.Success) {
						this.$success(this.$t('update-complete'));
						this.$info(this.$t('restart-initiated'));
						await waitForRestart();
						this.$success(this.$t('restart-complete'));
						window.location.reload(true);
					}
				} catch (err) {
					if (!err.result && !err.message.includes('≥')) throw err;

					const { remoteVersion, localVersion } = this.extractVersions(err);

					if (localVersion === remoteVersion) this.$info(this.$t('update-is-up-to-date'));
					else this.$info(this.$t('update-is-newest'));
				}
			},
			async restart() {
				if (this.restarting) return;
				this.restarting = true;

				try {
					await this.$http.post('asf/restart');
					this.$info(this.$t('restart-initiated'));
					await waitForRestart();
					this.$success(this.$t('restart-complete'));
					this.brandMenu = false;
				} catch (err) {
					this.$error(err.message);
				} finally {
					this.restarting = false;
				}
			},
			async exit() {
				try {
					await this.$http.post('asf/exit');
					this.$info(this.$t('exit-message'));
					this.brandMenu = false;
				} catch (err) {
					this.$error(err.message);
				}
			}
		}
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
