<template>
  <header class="upper-navigation">
    <NavigationBrand></NavigationBrand>

    <div class="navigation__button" :title="$t('sidenav-toggle')" @click="toggleNavigation">
      <FontAwesomeIcon icon="bars" fixedWidth></FontAwesomeIcon>
    </div>

    <div class="navigation__menu">
      <NavigationLanguageSwitch></NavigationLanguageSwitch>

      <div class="navigation__button" :title="$t('sidebar-toggle')" @click="toggleSideMenu">
        <FontAwesomeIcon icon="cogs" fixedWidth></FontAwesomeIcon>
      </div>

      <div v-if="status === 'AUTHENTICATED' && password" :title="$t('logout-title')" class="navigation__button" @click="logout">
        <FontAwesomeIcon icon="sign-out-alt" fixedWidth></FontAwesomeIcon>
      </div>
    </div>
  </header>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import NavigationBrand from '../Navigation/Brand.vue';
  import NavigationLanguageSwitch from '../Navigation/LanguageSwitch.vue';

  export default {
    name: 'AppHeader',
    components: { NavigationBrand, NavigationLanguageSwitch },
    computed: {
      ...mapGetters({
        status: 'auth/status',
        password: 'auth/password',
        sideMenu: 'layout/sideMenu',
      }),
    },
    watch: {
      sideMenu(value) {
        if (value) window.addEventListener('click', this.onWindowClick);
        else window.removeEventListener('click', this.onWindowClick);
      },
    },
    beforeDestroy() {
      window.removeEventListener('click', this.onWindowClick);
    },
    methods: {
      ...mapActions({
        toggleNavigation: 'layout/toggleNavigation',
        toggleSideMenu: 'layout/toggleSideMenu',
      }),
      async logout() {
        await this.$store.dispatch('auth/setPassword');
        this.$router.replace({ name: 'setup' });
      },
      onWindowClick($e) {
        const path = $e.path || $e.composedPath();
        const sideMenu = document.getElementById('side-menu');
        if (path.includes(this.$el) || path.includes(sideMenu)) return;
        this.toggleSideMenu();
      },
    },
  };
</script>

<style lang="scss">
	.upper-navigation {
		background: var(--color-theme);
		display: flex;
		height: var(--navigation-height);
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 1002;

		.app--boxed-layout & {
			@media screen and (min-width: 1250px) {
				position: absolute;
			}
		}
	}

	.navigation__button {
		align-items: center;
		color: var(--color-text);
		cursor: pointer;
		display: flex;
		justify-content: center;
		padding: 0 1em;

		&.navigation__button--active, &:hover {
			background: var(--color-theme-dark);
		}
	}

	.navigation__menu {
		display: flex;
		justify-content: space-between;
		margin-left: auto;
	}
</style>
