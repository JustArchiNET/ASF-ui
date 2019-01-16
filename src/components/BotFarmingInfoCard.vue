<template>
	<div class="info-card">
		<div class="info-card__icon">
			<font-awesome-icon :icon="icon"></font-awesome-icon>
		</div>
		<div class="info-card__body">
			<p class="info-card__title">{{ title }}</p>
			<p class="info-card__value">{{ value }}</p>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'bot-farming-info-card',
		props: {
			icon: String,
			value: {},
			title: String
		}
	};
</script>

<style lang="scss">
	.info-card {
		background: var(--color-background-light);
		display: grid;
		grid-template-columns: auto 1fr;
	}

	.info-card__icon {
		height: 4rem;
		width: 4rem;
		font-size: 2.1em;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-theme);
		color: var(--color-text);
	}

	.info-card__body {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		padding: 5px 10px;
		justify-content: space-between;
	}

	.info-card__title {
		text-transform: uppercase;
		font-size: 0.9em;
		margin: 0;
	}

	.info-card__value {
		font-weight: 600;
		font-size: 1.2em;
		margin: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
