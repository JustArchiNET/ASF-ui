<template>
	<div class="bot-action" :class="[color ? `bot-action--${color}` : null]" @click="onClick" v-show="visible">
		<span class="bot-action__label" v-if="name">{{ name }}</span>
		<font-awesome-icon class="bot-action__icon" :icon="icon" v-if="icon"></font-awesome-icon>
	</div>
</template>

<script>
	export default {
		name: 'bot-action',
		props: {
			icon: String,
			name: String,
			action: Function,
			condition: Function,
			color: String
		},
		computed: {
			visible() {
				if (!this.condition) return true;
				return this.condition();
			}
		},
		methods: {
			onClick() {
				if (this.action) this.action();
				this.$emit('click');
			}
		}
	}
</script>

<style lang="scss">
	.bot-action {
		padding: 0.25em;
		margin: 0 0.1em;
		cursor: pointer;
		transition: color .3s;
		color: var(--color-text-disabled);

		&:hover {
			color: var(--color-text-dark);

			.app--dark-mode & {
				color: var(--color-text);
			}
		}

		&.bot-action--red:hover {
			color: red;
		}

		&.bot-action--orange:hover {
			color: orange;
		}

		&.bot-action--green:hover {
			color: green;
		}
	}

	.bot-action__label {
		display: none;
	}

	.bot-action__icon {
		font-size: 0.8em;

		.bot-action__label + & {
			margin-left: 0.5em;
		}
	}
</style>
