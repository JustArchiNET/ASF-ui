<template>
	<main class="main-container main-container--center">
		<div class="container container--small">
			<h2 class="title">{{ $t('setup') }}</h2>

			<p class="status-text status-text--error" v-if="status === 'NOT_CONNECTED'">Unable to connect to ASF IPC server. Make sure ASF is running!</p>
			<p class="status-text status-text--error" v-if="status === 'RATE_LIMITED'">Seems like you are rate limited, restart ASF or try again in a while!</p>
			<p class="status-text" v-if="status === 'AUTHENTICATED'">Everything configured</p>

			<div class="form-item" v-if="status === 'UNAUTHORIZED'">
				<label for="password" class="form-item__label">{{ $t('password') }}</label>
				<input id="password" class="form-item__input" type="password" v-model="password" @keydown.enter="updatePassword">
			</div>

			<div class="form-item">
				<div class="form-item__buttons form-item__buttons--center">
					<button class="button button--confirm" @click="onButtonClick">
						<font-awesome-icon icon="spinner" v-if="processing" spin></font-awesome-icon>
						<span v-else>{{ buttonText }}</span>
					</button>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
	import { mapGetters } from 'vuex';
	import { STATUS } from '../utils/getStatus';

	export default {
		name: 'setup',
		metaInfo() {
			return {
				title: this.$t('setup')
			};
		},
		components: {},
		data() {
			return {
				password: this.$store.getters['auth/password'],
				processing: false
			};
		},
		computed: {
			...mapGetters({
				status: 'auth/status'
			}),
			buttonText() {
				switch (this.status) {
					case STATUS.UNAUTHORIZED:
						return this.$t('continue');
					default:
						return 'Refresh status';
				}
			}
		},
		methods: {
			async onButtonClick() {
				if (this.processing) return;

				switch (this.status) {
					case STATUS.UNAUTHORIZED:
						return this.updatePassword();
					default:
						return this.refreshStatus();
				}
			},
			async updatePassword() {
				this.processing = true;

				try {
					await this.$store.dispatch('auth/setPassword', this.password);

					const validPassword = await this.$store.dispatch('auth/validate');
					if (validPassword) this.$router.replace({ name: 'home' });
					else this.$error(this.$t('password-invalid'));
				} catch (err) {
					this.$error(err.message);
				} finally {
					this.processing = false;
				}
			},
			async refreshStatus() {
				this.processing = true;

				try {
					await this.$store.dispatch('auth/updateStatus');
				} catch (err) {
					this.$error(err.message);
				} finally {
					this.processing = false;
				}
			}
		}
	};
</script>

<style lang="scss">
	.status-text {
		text-align: center;
	}

	.status-text--error {
		color: var(--color-button-cancel);
	}
</style>
