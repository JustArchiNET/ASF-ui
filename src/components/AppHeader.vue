<template>
  <header class="upper-navigation">
    <NavigationBrand></NavigationBrand>

    <div class="navigation__button" @click="toggleNavigation">
      <FontAwesomeIcon icon="bars" fixed-width></FontAwesomeIcon>
    </div>

    <div class="navigation__menu">
      <div v-if="status === 'AUTHENTICATED' && password" class="navigation__button" @click="logout">
        <FontAwesomeIcon icon="sign-out-alt" fixed-width></FontAwesomeIcon>
      </div>

      <NavigationLanguageSwitch></NavigationLanguageSwitch>

      <div class="navigation__button" @click="toggleSideMenu">
        <FontAwesomeIcon icon="cogs" fixed-width></FontAwesomeIcon>
      </div>
    </div>
  </header>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import NavigationBrand from './NavigationBrand.vue';
  import NavigationLanguageSwitch from './NavigationLanguageSwitch.vue';

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
        if (path.includes(this.$el)) return;
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
