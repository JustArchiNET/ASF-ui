<template>
  <main class="main-container main-container--fullheight">
    <div class="container">
      <asf-releases></asf-releases>
    </div>
  </main>
</template>

<script>
  import AsfReleases from '../components/AsfReleases.vue';

  export default {
    name: 'releases',
    metaInfo() {
      return {
        title: this.$t('releases'),
      };
    },
    components: { AsfReleases },
  };
</script>
