<template>
	<router-link tag="div" class="bot-action" :to="link" v-show="visible">
		<span class="bot-action__label" v-if="name">{{ name }}</span>
		<font-awesome-icon class="bot-action__icon" :icon="icon" v-if="icon"></font-awesome-icon>
	</router-link>
</template>

<script>
	export default {
		name: 'bot-link',
		props: {
			icon: String,
			name: String,
			link: Object,
			condition: Function
		},
		computed: {
			visible() {
				if (!this.condition) return true;
				return this.condition();
			}
		}
	};
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
	}

	.bot-action__label {
		display: none;
	}

	.bot-action__icon {
		.bot-action__label + & {
			margin-left: 0.5em;
		}
	}
</style>
