<template>
    <nav class="side-navigation">
        <navigation-brand></navigation-brand>

        <navigation-category name="Home" icon="home"></navigation-category>
        <navigation-link name="Statistics" :to="{ name: 'home' }"></navigation-link>
        <navigation-link name="Usage" :to="{ name: 'home' }"></navigation-link>

        <navigation-category name="Control" icon="tachometer-alt"></navigation-category>
        <navigation-link name="Commands" :to="{ name: 'home' }"></navigation-link>
        <navigation-link name="Bots" :to="{ name: 'home' }"></navigation-link>
        <navigation-link name="Lorem" :to="{ name: 'home' }"></navigation-link>
        <navigation-link name="Ipsum" :to="{ name: 'home' }"></navigation-link>

        <navigation-category name="Configuration" icon="wrench"></navigation-category>
        <navigation-link name="Setup" :to="{ name: 'setup' }"></navigation-link>
        <navigation-link name="ASF" :to="{ name: 'home' }"></navigation-link>
    </nav>
</template>

<script>
  import NavigationLink from './NavigationLink.vue';
  import NavigationCategory from './NavigationCategory.vue';
  import NavigationBrand from './NavigationBrand.vue';

  export default {
    name: 'app-navigation',
    components: { NavigationLink, NavigationCategory, NavigationBrand }
  };
</script>

<style lang="scss">
    .side-navigation {
        grid-area: side-navigation;
        background: var(--color-navigation);
    }
</style>