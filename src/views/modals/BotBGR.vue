<template>
	<main class="main-container" v-if="bot">
		<h2 class="title" v-if="bot.nickname && nicknames">{{ bot.nickname }}</h2>
		<h2 class="title" v-else>{{ bot.name }}</h2>

		<h3 class="subtitle" v-if="loading">
			<font-awesome-icon icon="spinner" size="lg" spin></font-awesome-icon>
		</h3>

		<bgr-status v-if="!loading && state === 'input'" :used-keys="usedKeys" :unused-keys="unusedKeys" @reset="showReset" @show-unused="state = 'unusedKeys'" @show-used="state = 'usedKeys'"></bgr-status>

		<keep-alive>
			<bgr-input v-if="state === 'input'" @check="onCheck"></bgr-input>
			<bgr-check v-if="state === 'check'" :keys="keys" :title="$t('bgr-check', { n: foundKeysCount })" :bot="bot" :confirming="confirming" @confirm="onConfirm" @cancel="onCancel"></bgr-check>
			<bgr-reset v-if="state === 'reset'" :title="$t('bgr-reset')" :resetting="resetting" @reset="onReset" @cancel="onCancel"></bgr-reset>
			<bgr-summary v-if="state === 'summary'" :keys="summaryKeys" :title="$t('bgr-summary-success', { n: addedKeysCount })" @back="$parent.back()"></bgr-summary>
			<bgr-summary v-if="state === 'usedKeys'" :keys="usedKeys" :title="$t('bgr-used-keys')" @back="state = 'input'"></bgr-summary>
			<bgr-summary v-if="state === 'unusedKeys'" :keys="unusedKeys" :title="$t('bgr-unused-keys')" @back="state = 'input'"></bgr-summary>
		</keep-alive>
	</main>
</template>

<script>
	import BgrCheck from '../../components/BGR/Check.vue';
	import BgrInput from '../../components/BGR/Input.vue';
	import BgrReset from '../../components/BGR/Reset.vue';
	import BgrStatus from '../../components/BGR/Status.vue';
	import BgrSummary from '../../components/BGR/Summary.vue';

	import { mapGetters } from 'vuex';

	export default {
		name: 'bot-bgr',
		components: { BgrCheck, BgrInput, BgrReset, BgrStatus, BgrSummary },
		data() {
			return {
				loading: true,
				confirming: false,
				resetting: false,
				state: 'input',
				unusedKeys: {},
				usedKeys: {},
				keys: {},
				summaryKeys: {}
			};
		},
		computed: {
			...mapGetters({
				nicknames: 'settings/nicknames'
			}),
			bot() {
				return this.$store.getters['bots/bot'](this.$route.params.bot);
			},
			foundKeysCount() {
				return Object.keys(this.keys).length;
			},
			addedKeysCount() {
				return Object.keys(this.summaryKeys).length;
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
		created() {
			if (!this.bot) this.$router.replace({ name: 'bots' });
		},
		methods: {
			async loadBGR() {
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
			showReset() {
				this.state = 'reset';
			},
			async onReset() {
				this.resetting = true;

				try {
					await this.$http.del(`bot/${this.bot.name}/GamesToRedeemInBackground`);
					this.unusedKeys = {};
					this.usedKeys = {};
				} finally {
					this.resetting = false;
					this.state = 'input';
				}
			}
		}
	};
</script>
