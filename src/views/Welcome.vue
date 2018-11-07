<template>
	<main class="welcome main-container main-container--center">
		<div class="container container--small">
			<h2 class="title">{{ $t('welcome') }}</h2>
			<p class="subtitle">{{ $t('welcome-message') }}</p>

			<div class="form-item">
				<div class="form-item__buttons form-item__buttons--center">
					<router-link tag="button" :to="{ name: 'setup' }" class="button button--confirm">{{ $t('continue') }}</router-link>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
  import { set } from '../utils/storage';

	export default {
    name: 'welcome',
		created() {
    	set('welcome', true);
		}
  };
</script>
