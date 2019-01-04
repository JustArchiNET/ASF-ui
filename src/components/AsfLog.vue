<template>
	<div class="terminal" ref="terminal">
		<div class="terminal-message terminal-message--truncated" v-for="{ type, message } in log">
			<span class="terminal-message__content">
				<span class="terminal-message__time">[{{ message.time.toLocaleTimeString() }}]</span>
				<span class="terminal-message__level" :class="`terminal-message__level--${message.level.toLowerCase()}`">{{ message.level }}</span>
				<span class="terminal-message__logger">{{ message.logger }}</span>
				<span>></span>
				<span class="terminal-message__text">{{ message.text }}</span>
			</span>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';

	export default {
		name: 'asf-log',
		data() {
			return {
				log: []
			};
		},
		computed: mapGetters({
			password: 'auth/password'
		}),
		created() {
			const websocketURL = `${window.__BASE_URL__.replace(/^http/, 'ws')}api/nlog${this.password ? `?password=${encodeURIComponent(this.password)}` : ''}`;

			this.ws = new WebSocket(websocketURL);
			this.ws.onopen = this.onOpen.bind(this);
			this.ws.onmessage = this.onMessage.bind(this);
			this.ws.onclose = this.onClose.bind(this);
		},
		methods: {
			onOpen(event) {

			},
			onMessage(event) {
				const message = JSON.parse(event.data).Result;
				this.log.push({ type: 'in', message: this.parseMessage(message) });
			},
			parseMessage(message) {
				const [time, process, level, logger, ...text] = message.split('|');

				return {
					time: new Date(time),
					process,
					level,
					logger,
					text: text.join()
				};
			},
			onClose(event) {

			}
		},
		watch: {
			log() {
				if (this.$refs.terminal.scrollTop < this.$refs.terminal.scrollHeight - this.$refs.terminal.clientHeight - 20) return;

				this.$nextTick(() => {
					this.$refs.terminal.scrollTop = Math.max(0, this.$refs.terminal.scrollHeight - this.$refs.terminal.clientHeight);
				});
			}
		},
		beforeDestroy() {
			this.ws.close();
		}
	};
</script>
