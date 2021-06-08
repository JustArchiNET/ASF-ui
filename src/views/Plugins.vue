<template>
  <main class="main-container main-container--fullheight">
    <div class="container">
      <AsfPlugins></AsfPlugins>
    </div>
  </main>
</template>

<script>
  import AsfPlugins from '../components/ASF/Plugins.vue';

  export default {
    name: 'Plugins',
    metaInfo() {
      return {
        title: this.$t('plugins'),
      };
    },
    components: { AsfPlugins },
  };
</script>
