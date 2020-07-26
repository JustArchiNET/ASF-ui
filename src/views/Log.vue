<template>
  <main class="main-container main-container--fullheight log">
    <div class="container">
      <asf-log></asf-log>
    </div>
  </main>
</template>

<script>
  import AsfLog from '../components/AsfLog.vue';

  export default {
    name: 'log',
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
