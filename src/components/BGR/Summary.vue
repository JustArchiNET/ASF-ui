<template>
	<div class="bgr__summary">
		<h3 class="subtitle bgr__summary-title">{{ title }}</h3>

		<div class="form-item">
			<div class="bgr__keys">
				<span class="bgr__key" v-if="noKeys"><strong>No key pairs accepted</strong></span>
				<span v-for="(name, key) in keys" class="key">{{ key }} - {{ name }}</span>
			</div>
		</div>

		<div class="form-item">
			<div class="form-item__buttons form-item__buttons--center">
				<button class="button button--confirm" @click="$emit('back')" :key="'back'">Back</button>
			</div>
		</div>
	</div>
</template>

<script>
  export default {
  	props: {
  		keys: Object,
			title:  String,
		},
    name: 'bgr-summary',
		computed: {
  		noKeys() {
  			return Object.keys(this.keys).length === 0;
			}
		}
  };
</script>

<style lang="scss">
	.bgr__summary-title {
		margin-bottom: 0.5em;
	}
</style>
