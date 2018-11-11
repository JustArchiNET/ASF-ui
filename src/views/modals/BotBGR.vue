<template>
	<main class="main-container main-container--modal">
		<template v-if="!bot">
			<h2 class="title" v-if="!bot">Not found!</h2>
		</template>

		<template v-else>
			<h2 class="title">{{ bot.name }}</h2>

			<h3 class="subtitle" v-if="loading"><font-awesome-icon icon="spinner" size="lg" spin></font-awesome-icon></h3>
			<bgr-status v-if="!loading && state === 'input'" :used-keys="usedKeys" :unused-keys="unusedKeys" @reset="onReset" @show-unused="state = 'unusedKeys'" @show-used="state = 'usedKeys'"></bgr-status>

			<keep-alive>
				<bgr-input v-if="state === 'input'" @check="onCheck"></bgr-input>
				<bgr-check v-if="state === 'check'" :keys="keys" :bot="bot" :confirming="confirming" @confirm="onConfirm" @cancel="onCancel"></bgr-check>
				<bgr-summary v-if="state === 'summary'" :keys="summaryKeys" :title="$t('bgr-summary-success')" @back="$parent.close()"></bgr-summary>
				<bgr-summary v-if="state === 'usedKeys'" :keys="usedKeys" :title="$t('bgr-used-keys')" @back="state = 'input'"></bgr-summary>
				<bgr-summary v-if="state === 'unusedKeys'" :keys="unusedKeys" :title="$t('bgr-unused-keys')" @back="state = 'input'"></bgr-summary>
			</keep-alive>
		</template>
	</main>
</template>

<script>
	import BgrCheck from '../../components/BGR/Check.vue';
	import BgrInput from '../../components/BGR/Input.vue';
	import BgrStatus from '../../components/BGR/Status.vue';
	import BgrSummary from '../../components/BGR/Summary.vue';

	export default {
		name: 'bot-bgr',
		components: { BgrStatus, BgrInput, BgrCheck, BgrSummary },
		data() {
			return {
				loading: true,
				confirming: false,
				state: 'input',
				unusedKeys: {},
				usedKeys: {},
				keys: {},
				summaryKeys: {}
			};
		},
		computed: {
			bot() {
				return this.$store.getters['bots/bot'](this.$route.params.bot);
			}
		},
		watch: {
			'$route': {
				immediate: true,
				handler: async function() {
					this.loading = true;
					const { UnusedKeys, UsedKeys } = await this.loadBGR();
					this.unusedKeys = UnusedKeys;
					this.usedKeys = UsedKeys;
					this.loading = false;
				}
			}
		},
		methods: {
			async loadBGR() {
				if (!this.bot) return { UnusedKeys: {}, UsedKeys: {} };
				return (await this.$http.get(`bot/${this.bot.name}/GamesToRedeemInBackground`))[this.bot.name];
			},
			onCheck(keys) {
				this.keys = keys;
				this.state = 'check';
			},
			async onConfirm() {
				this.confirming = true;

				try {
					const activatedKeys = await this.$http.post(`bot/${this.bot.name}/GamesToRedeemInBackground`, { GamesToRedeemInBackground: this.keys });
					this.state = 'summary';
					this.summaryKeys = activatedKeys[this.bot.name];
				} finally {
					this.confirming = false;
				}
			},
			onCancel() {
				this.state = 'input';
			},
			async onReset() {
				await this.$http.del(`bot/${this.bot.name}/GamesToRedeemInBackground`);
				this.unusedKeys = {};
				this.usedKeys = {};
			}
		}
	};
</script>

<style lang="scss">
</style>
