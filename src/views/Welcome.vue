<template>
	<main class="main-container main-container--center">
		<div class="container container--small">
			<h2 class="title">{{ $t('welcome') }}</h2>
			<p class="subtitle">{{ $t('welcome-message') }}</p>

			<div v-if="steamOwnerID === '0' || bots.length === 0" class="form-item">
				<p class="subtitle">{{ $t('welcome-message-todo') }}</p>
				<ul class="list">
					<li v-if="steamOwnerID === '0'" class="list-item">{{ $t('welcome-message-id') }}</li>
					<li v-if="bots.length === 0" class="list-item">{{ $t('welcome-message-bot') }}</li>
				</ul>
			</div>

			<div class="form-item">
				<div class="form-item__buttons form-item__buttons--center">
					<router-link tag="button" :to="{ name: 'home' }" class="button button--confirm">
						{{ $t('continue') }}
					</router-link>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
	import { mapGetters } from 'vuex';
	import { set, get } from '../utils/storage';

	export default {
		name: 'welcome',
		metaInfo() {
			return {
				title: this.$t('welcome')
			};
		},
		computed: mapGetters({
			bots: 'bots/bots',
			steamOwnerID: 'asf/steamOwnerID'
		}),
		mounted() {
			set('first-time', false);
		}
	};
</script>

<style lang="scss">
	.list {
		display: table;
		margin: 0 auto;
		padding-bottom: 20px;
	}
</style>
