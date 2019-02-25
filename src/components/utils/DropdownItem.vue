<template>
	<li v-if="item.action" v-show="active" class="dropdown__item" @click="onClick">
		<font-awesome-icon v-if="item.icon" class="dropdown__item-icon" :icon="item.icon" />
		<span class="dropdown__item-name">{{ item.name }}</span>
	</li>

	<router-link v-else-if="item.link" v-show="active" tag="li" class="dropdown__item" :to="item.link">
		<font-awesome-icon v-if="item.icon" class="dropdown__item-icon" :icon="item.icon" />
		<span class="dropdown__item-name">{{ item.name }}</span>
	</router-link>

	<li v-show="active" v-else class="dropdown__item">
		<font-awesome-icon v-if="item.icon" class="dropdown__item-icon" :icon="item.icon" />
		<span class="dropdown__item-name">{{ item.name }}</span>
	</li>
</template>

<script>
	export default {
		name: 'dropdown-item',
		props: {
			item: Object
		},
		computed: {
			active() {
				if (!this.item.condition) return true;
				if (typeof this.item.condition === 'function') return this.item.condition();
				return this.item.condition;
			}
		},
		methods: {
			onClick() {
				if (!this.item.action) return;
				this.item.action();
			}
		}
	};
</script>

<style lang="scss">
	.dropdown__item {
		align-items: center;
		display: inline-flex;
		justify-content: space-between;
		padding: 0.5em 1.5em;
		text-align: right;
		white-space: nowrap;

		.button--small & {
			padding: 0.25em 0.5em;
		}

		&:hover {
			background: var(--color-navigation-dark);
		}
	}

	.dropdown__item-icon + .dropdown__item-name {
		margin-left: 1em;
	}

	.dropdown__item-icon {
		font-size: 0.8em;
	}

	.dropdown__item--disabled {
		color: var(--color-text-disabled);
		cursor: not-allowed;

		&:hover {
			background: var(--color-navigation);
		}
	}
</style>
