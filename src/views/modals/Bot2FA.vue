<template>
	<main class="main-container" v-if="bot">
		<h2 class="title" v-if="bot.nickname && nicknames">{{ bot.nickname }}</h2>
		<h2 class="title" v-else>{{ bot.name }}</h2>

		<div class="form-item">
			<div class="form-item__buttons form-item__buttons--center form-item__buttons--column">
				<button class="button button--confirm" @click="getCurrentToken">{{ $t('token-copy') }}</button>
				<button class="button button--confirm" @click="acceptTrades">
					<font-awesome-icon icon="spinner" v-if="accepting" spin></font-awesome-icon>
					<span v-else>{{ $t('2fa-ok') }}</span>
				</button>
				<button class="button button--cancel" @click="declineTrades">
					<font-awesome-icon icon="spinner" v-if="declining" spin></font-awesome-icon>
					<span v-else>{{ $t('2fa-no') }}</span>
				</button>
			</div>
		</div>
	</main>
</template>

<script>
	import { mapGetters } from 'vuex';
	import { command } from '../../plugins/http';
	import * as copy from 'copy-to-clipboard';

	// This whole module is based on commands instead of actions
	// Refactor to use actions as these become available

	export default {
		name: 'bot-2fa',
		data() {
			return {
				accepting: false,
				declining: false
			};
		},
		computed: {
			...mapGetters({
				nicknames: 'settings/nicknames'
			}),
			bot() {
				return this.$store.getters['bots/bot'](this.$route.params.bot);
			}
		},
		created() {
			if (!this.bot) this.$router.replace({ name: 'bots' });
		},
		methods: {
			async acceptTrades() {
				if (this.accepting) return;

				this.accepting = true;
				const result = await command('2faok', this.bot.name);
				this.$info(this.parseResultString(result));
				this.accepting = false;
			},
			async declineTrades() {
				if (this.declining) return;

				this.declining = true;
				const result = await command('2fano', this.bot.name);
				this.$info(this.parseResultString(result));
				this.declining = false;
			},
			async getCurrentToken() {
				const result = await command('2fa', this.bot.name);

				// Firstly, remove <bot-name> to prevent accidentally recognizing bot name as 2fa token
				const message = this.parseResultString(result);

				// Since we are parsing translated natural language string and there are no guarantees about it's structure
				// We will simply extract the first 5-character long string composed exclusively of characters available in 2fa token
				// To make the extraction stricter, we make sure the 5-character code is surrounded by word-boundaries (\b)
				const tokenResult = /\b([23456789BCDFGHJKMNPQRTVWXY]{5})\b/.exec(result);

				// If the extraction failed, we display the message
				// In case we missed the token, it'll at least be displayed (but not copied)
				if (!tokenResult) return this.$info(message);

				// Finally, if the token was found, copy it to clipboard and notify the user
				copy(tokenResult[1]);
				this.$success(this.$t('token-copied'));
			},
			parseResultString(result) {
				// Remove the response prefix, this is prone to command response format changes,
				// but should gracefully stop working when such change happens

				return result
						.replace(`<${this.bot.name}> `, '') // Remove bot name
						.replace('<ASF> ', ''); // Remove <ASF> if the bot doesn't exist
			}
		}
	};
</script>
