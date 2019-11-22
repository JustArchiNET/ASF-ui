<template>
	<main class="welcome main-container main-container--center">
		<div class="container container--small">
			<h2 class="title">{{ $t('welcome') }}</h2>
			<p class="subtitle">{{ $t('welcome-message') }}</p>
			<p v-if="firstTime" class="subtitle">{{ $t('welcome-message-first-time') }}</p>
			<p v-if="steamOwnerID === 0" class="subtitle">{{ $t('welcome-message-no-id') }}</p>
			<p v-if="bots.length === 0" class="subtitle">{{ $t('welcome-message-no-bots') }}</p>

			<div class="form-item">
				<div class="form-item__buttons form-item__buttons--center">
					<router-link tag="button" :to="{ name: 'setup' }" class="button button--confirm">
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
		data() {
			return {
				firstTime: true
			};
		},
		computed: mapGetters({
			bots: 'bots/bots',
			steamOwnerID: 'asf/steamOwnerID'
		}),
		firstTime() {
			return get('first-time', true);
		},
		created() {
			set('welcome', true);
		}
	};
</script>
