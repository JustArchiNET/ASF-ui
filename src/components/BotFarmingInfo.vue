<template>
	<div class="farming-info">
		<div class="farming-info__icon">
			<font-awesome-icon :icon="icon"></font-awesome-icon>
		</div>

		<p class="farming-info__value">{{ value }}</p>
	</div>
</template>

<script>
	export default {
		name: 'bot-farming-info',
		props: {
			icon: String,
			value: {},
			title: String
		}
	};
</script>

<style lang="scss">
	.farming-info {
		background: var(--color-background-light);
		display: grid;
		grid-template-columns: auto 1fr;
	}

	.farming-info__icon {
		padding: 0 0.5em;
		font-size: 1.4em;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text);
	}

	.farming-info__value {
		padding: 5px;
		font-weight: 600;
		font-size: 1.2em;
		margin: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
