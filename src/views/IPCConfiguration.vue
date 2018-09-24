<template>
	<main class="main-container main-container--center">
		<div class="container container--small">
			<h2 class="title">IPC Configuration</h2>

			<div class="form-item">
				<label for="baseURL" class="form-item__label">Base URL</label>
				<input id="baseURL" class="form-item__input" type="text" v-model="baseURL" @keydown.enter="update">
			</div>

			<div class="form-item">
				<label for="password" class="form-item__label">Password</label>
				<input id="password" class="form-item__input" type="password" v-model="password" @keydown.enter="update">
			</div>

			<div class="form-item">
				<button class="button button--confirm" @click="update">Save</button>
			</div>
		</div>
	</main>
</template>

<script>
	export default {
		name: 'ipc-configuration',
		metaInfo: { title: 'IPC Configuration' },
		components: {},
		data() {
			return {
				password: this.$store.getters['auth/password'],
				baseURL: this.$store.getters['auth/baseURL']
			};
		},
		computed: {
			normalizedBaseURL() {
				return this.baseURL.endsWith('/') ? this.baseURL : this.baseURL + '/';
			}
		},
		methods: {
			async update() {
				const baseURLChanged = this.normalizedBaseURL !== this.$store.getters['auth/baseURL'];

				this.$store.commit('auth/setBaseURL', this.normalizedBaseURL);
				this.$store.commit('auth/setPassword', this.password);

				if (baseURLChanged) window.location.href = `${this.normalizedBaseURL}ipc-configuration`;

				const validPassword = await this.$store.dispatch('auth/validate');
				if (!validPassword) await this.$router.replace({ name: 'setup' });
			}
		}
	};
</script>
