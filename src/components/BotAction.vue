<template>
  <div v-show="visible" class="bot-action" :class="[color ? `bot-action--${color}` : null]" @click="onClick">
    <span v-if="name" class="bot-action__label">{{ name }}</span>
    <FontAwesomeIcon v-if="icon" class="bot-action__icon" :icon="icon"></FontAwesomeIcon>
  </div>
</template>

<script>
  export default {
    name: 'BotAction',
    props: {
      icon: String,
      name: String,
      action: Function,
      condition: Function,
      color: String,
    },
    computed: {
      visible() {
        if (!this.condition) return true;
        return this.condition();
      },
    },
    methods: {
      onClick() {
        if (this.action) this.action();
        this.$emit('click');
      },
    },
  };
</script>

<style lang="scss">
	.bot-action {
		color: var(--color-text-disabled);
		cursor: pointer;
		margin: 0 0.1em;
		padding: 0.25em;
		transition: color .3s;

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
			margin-left: 0.5rem;
		}
	}
</style>
