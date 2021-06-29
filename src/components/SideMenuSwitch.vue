<template>
  <div class="side-menu__switch" @click="$emit('click')">
    <span class="side-menu__switch-left-side">
      <FontAwesomeIcon :icon="icon" fixedWidth></FontAwesomeIcon>
      <span>{{ name }}</span>
    </span>

    <FontAwesomeIcon v-if="checked" icon="check-circle"></FontAwesomeIcon>
    <FontAwesomeIcon v-else icon="times-circle"></FontAwesomeIcon>
  </div>
</template>

<script>
  export default {
    name: 'SideMenuSwitch',
    props: {
      name: {
        type: String,
        required: true,
      },
      icon: {
        type: String,
        required: true,
      },
      checked: {
        type: Boolean,
        required: true,
      },
    },
  };
</script>

<style lang="scss">
	.side-menu__switch {
		align-items: center;
		color: var(--color-text-secondary);
		cursor: pointer;
		display: flex;
		justify-content: space-between;
		padding: 1em 1em 0.5em;

		> svg[data-icon="times-circle"] {
			color: var(--color-text-disabled);
		}
	}

	.side-menu__switch-left-side {
		justify-content: space-between;
		margin-right: 0.5em;
	}
</style>
