<template>
	<main class="main-container main-container--modal">
		<template v-if="!bot">
			<h2 class="title" v-if="!bot">Not found!</h2>
		</template>

		<template v-else>
			<h2 class="title">{{ bot.name }}</h2>

			<h3 class="subtitle" v-if="loading"><font-awesome-icon icon="spinner" size="lg" spin></font-awesome-icon></h3>
			<template v-else>
				<h3 class="subtitle">Doesn't work, yet</h3>
			</template>
		</template>
	</main>
</template>

<script>
	import { get, post } from '../../utils/http';
	import { mapGetters } from 'vuex';

	export default {
		name: 'bot-bgr',
		components: { },
		metaInfo() {
			return {
				title: `BGR - ${this.$route.params.bot}`
			};
		},
		data() {
			return {
				loading: true,
				unusedKeys: {},
				usedKeys: {}
			};
		},
		computed: {
			...mapGetters({ version: 'status/version' }),
			bot() {
				return this.$store.getters['bots/bot'](this.$route.params.bot);
			}
		},
		watch: {

		},
		async created() {
			const { UnusedKeys, UsedKeys } = await this.loadBGR();
			this.unusedKeys = UnusedKeys;
			this.usedKeys = UsedKeys;
			this.loading = false;
		},
		methods: {
			async loadBGR() {
				return (await get(`bot/${this.bot.name}/GamesToRedeemInBackground`))[this.bot.name];
			}
		}
	};
</script>

<style lang="scss">

</style>
