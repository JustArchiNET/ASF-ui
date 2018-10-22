<template>
	<main class="main-container main-container--center">
		<div class="container container--small">
			<h2 class="title">{{ $t('setup') }}</h2>
			<h4 class="subtitle">{{ $t('setup-description') }}</h4>

			<div class="form-item">
				<label for="password" class="form-item__label">{{ $t('password') }}</label>
				<input id="password" class="form-item__input" type="password" v-model="password" @keydown.enter="updatePassword">
			</div>

			<div class="form-item">
				<button class="button button--confirm" @click="updatePassword">{{ $t('continue') }}</button>
			</div>
		</div>
	</main>
</template>

<script>
	export default {
		name: 'setup',
		metaInfo: { title: 'Setup' },
		components: {},
		data() {
			return {
				password: this.$store.getters['auth/password']
			};
		},
		methods: {
			async updatePassword() {
				this.$store.commit('auth/setPassword', this.password);

				try {
					const validPassword = await this.$store.dispatch('auth/validate');
					if (validPassword) this.$router.replace('/');
					else this.$error(this.$t('password-invalid'));
				} catch (err) {
					this.$error(err.message);
				}
			}
		}
	};
</script>
