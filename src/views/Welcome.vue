<template>
	<main class="welcome main-container main-container--center">
		<div class="container container--small">
			<h2 class="title">Welcome</h2>
			<p class="subtitle">Welcome to ASF-ui, standalone interface for ASF.</p>

			<div class="form-item">
				<div class="form-item__buttons form-item__buttons--center">
					<router-link tag="button" :to="{ name: 'setup' }" class="button button--confirm">Continue</router-link>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
  import { set } from '../utils/storage';

	export default {
    name: 'Welcome',
		created() {
    	set('welcome', true);
		}
  };
</script>

<style lang="scss">

</style>
