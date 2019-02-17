<template>
	<button class="dropdown button button-confirm" :class="[{ 'dropdown--active': open, 'button--disabled': disabled, 'button--small': small }, buttonStyle ? `button--${buttonStyle}` : null]" @click="toggle">
		<span class="dropdown__label">{{ label }}</span>
		<font-awesome-icon class="dropdown__icon" icon="angle-down"></font-awesome-icon>

		<ul class="dropdown__items" v-if="open">
			<dropdown-item v-for="item in items" :item="item" :key="item.name"></dropdown-item>
			<slot></slot>
		</ul>
	</button>
</template>

<script>
	import DropdownItem from './DropdownItem.vue';

	export default {
		name: 'dropdown',
		props: {
			label: String,
			disabled: Boolean,
			small: Boolean,
			buttonStyle: String,
			items: Array
		},
		components: { DropdownItem },
		data() {
			return {
				open: false
			};
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

	.dropdown--active {
		border-bottom-left-radius: 0 !important;
		border-bottom-right-radius: 0 !important;

		.dropdown__icon {
			transform: rotate(180deg);
		}
	}

	.dropdown__icon {
		margin-left: 0.5em;
		transition: transform .3s;
	}

	.dropdown__items {
		background: var(--color-navigation);
		border-radius: 0.1875em 0 0.1875em 0.1875em;
		color: var(--color-text);
		display: flex;
		flex-direction: column;
		margin: 0;
		min-width: 100%;
		overflow: hidden;
		padding: 0;
		position: absolute;
		right: 0;
		top: 100%;
		user-select: none;
	}
</style>
