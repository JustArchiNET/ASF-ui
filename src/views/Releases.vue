<template>
  <main class="main-container main-container--fullheight">
    <div class="container">
      <AsfReleases></AsfReleases>
    </div>
  </main>
</template>

<script>
  import AsfReleases from '../components/AsfReleases.vue';

  export default {
    name: 'Releases',
    metaInfo() {
      return {
        title: this.$t('releases'),
      };
    },
    components: { AsfReleases },
  };
</script>
