<template>
	<div class="dropdown button button-confirm" :class="{ 'dropdown--active': open, 'button--disabled': disabled }" @click="toggle">
		<span class="dropdown__label">{{ label }}</span>
		<font-awesome-icon class="dropdown__icon" icon="angle-down"></font-awesome-icon>

		<ul class="dropdown__items" v-if="open">
			<slot></slot>
		</ul>
	</div>
</template>

<script>
	export default {
		name: 'dropdown',
		props: {
			label: String,
			disabled: Boolean
		},
		data() {
			return {
				open: false
			}
		},
		watch: {
			disabled(value) {
				if (value) this.open = false;
			}
		},
		methods: {
			toggle() {
			if (this.disabled) return;
				this.open = !this.open;
			}
		}
	};
</script>

<style lang="scss">
	.dropdown {
		position: relative;
	}

	.dropdown__icon {
		margin-left: 0.5em;
		transition: transform .3s;
	}

	.dropdown--active {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;

		.dropdown__icon {
			transform: rotate(180deg);
		}
	}

	.dropdown__items {
		user-select: none;
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
		position: absolute;
		top: 100%;
		right: 0;
		min-width: 100%;
		background: var(--color-navigation);
		color: var(--color-text);
		border-radius: .1875em 0 .1875em .1875em;
		overflow: hidden;
	}

	.dropdown__item {
		display: inline-block;
		padding: 0.5em 1.5em;
		white-space: nowrap;
		text-align: right;

		&:hover {
			background: var(--color-navigation-dark);
		}
	}
</style>
