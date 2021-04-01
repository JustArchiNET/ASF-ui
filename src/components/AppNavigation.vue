<template>
  <nav class="side-navigation" @transitionend="onTransitionEnd">
    <template v-if="authenticated">
      <div class="navigation-category">
        <NavigationCategoryTitle :name="$t('control')"></NavigationCategoryTitle>
        <NavigationLink :name="$t('bots')" icon="users" :to="{ name: 'bots' }"></NavigationLink>
        <NavigationLink :name="$t('commands')" icon="laptop" :to="{ name: 'commands' }"></NavigationLink>
        <NavigationLink :name="$t('releases')" icon="code-branch" :to="{ name: 'releases' }"></NavigationLink>
        <NavigationLink :name="$t('plugins')" icon="puzzle-piece" :to="{ name: 'plugins' }"></NavigationLink>
        <NavigationLink :name="$t('log')" icon="file-alt" :to="{ name: 'log' }"></NavigationLink>
      </div>

      <div class="navigation-category">
        <NavigationCategoryTitle :name="$t('config')"></NavigationCategoryTitle>
        <NavigationLink :name="$t('asf-config')" icon="edit" :to="{ name: 'asf-config' }"></NavigationLink>
        <NavigationLink :name="$t('ui-config')" icon="wrench" :to="{ name: 'ui-config' }"></NavigationLink>
        <NavigationLink :name="$t('mass-editor')" icon="paste" :to="{ name: 'mass-editor' }"></NavigationLink>
      </div>

      <div class="navigation-category navigation-category--pull-bottom">
        <NavigationCategoryTitle :name="$t('statistics')"></NavigationCategoryTitle>
        <NavigationBots ref="bots"></NavigationBots>
        <NavigationStatistics></NavigationStatistics>
      </div>
    </template>

    <template v-else>
      <div class="navigation-category">
        <NavigationCategoryTitle :name="$t('config')"></NavigationCategoryTitle>
        <NavigationLink :name="$t('setup')" icon="wrench" :to="{ name: 'setup' }"></NavigationLink>
      </div>
    </template>
  </nav>
</template>

<script>
  import { mapGetters } from 'vuex';
  import NavigationLink from './NavigationLink.vue';
  import NavigationCategoryTitle from './NavigationCategoryTitle.vue';
  import NavigationBots from './NavigationBots.vue';
  import NavigationStatistics from './NavigationStatistics.vue';

  export default {
    name: 'AppNavigation',
    components: {
      NavigationLink, NavigationCategoryTitle, NavigationStatistics, NavigationBots,
    },
    computed: mapGetters({
      authenticated: 'auth/authenticated',
      smallNavigation: 'layout/smallNavigation',
    }),
    watch: {
      smallNavigation: {
        handler(value) {
          this.onTransitionStart();
        },
      },
    },
    methods: {
      onTransitionStart() {
        if (!this.$refs.bots) return;
        this.$refs.bots.onTransitionStart();
      },
      onTransitionEnd() {
        if (!this.$refs.bots) return;
        this.$refs.bots.onTransitionEnd();
      },
    },
  };
</script>

<style lang="scss">
	.side-navigation {
		background: var(--color-navigation);
		bottom: 0;
		display: flex;
		flex-direction: column;
		left: 0;
		overflow: hidden;
		padding-top: var(--navigation-height);
		position: fixed;
		top: 0;
		transition: ease-in-out width .3s;
		width: var(--navigation-width);
		z-index: 1001;

		.app--small-navigation & {
			overflow: initial;
		}

		.app--boxed-layout & {
			@media screen and (min-width: 1250px) {
				position: absolute;
			}
		}
	}

	.navigation-category--pull-bottom {
		margin-top: auto;
	}
</style>
