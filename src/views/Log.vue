<template>
  <main class="main-container main-container--fullheight log">
    <div class="container">
      <AsfLog></AsfLog>
    </div>
  </main>
</template>

<script>
  import AsfLog from '../components/ASF/Log.vue';

  export default {
    name: 'Log',
    metaInfo() {
      return {
        title: this.$t('log'),
      };
    },
    components: { AsfLog },
  };
</script>

<style lang="scss">
	.log {
		display: grid;
		grid-template-rows: 1fr;

		> div {
			min-height: 0;
		}
	}
</style>
