<template>
  <router-link v-show="visible" v-slot="{ navigate }" custom :to="link">
    <div class="bot-action" @click="navigate">
      <span v-if="name" class="bot-action__label">{{ name }}</span>
      <FontAwesomeIcon v-if="icon" class="bot-action__icon" :icon="icon"></FontAwesomeIcon>
    </div>
  </router-link>
</template>

<script>
  export default {
    name: 'BotLink',
    props: {
      icon: String,
      name: String,
      link: Object,
      condition: Function,
    },
    computed: {
      visible() {
        if (!this.condition) return true;
        return this.condition();
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
			margin-left: 0.5em;
		}
	}
</style>
