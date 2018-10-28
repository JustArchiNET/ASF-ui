<template>
	<div>
		<h2 class="title">{{ $t('farming-info') }}</h2>

		<div class="farming__info">
			<div class="farming__info-card">
				<div class="farming__info-card--icon"><font-awesome-icon icon="gamepad"></font-awesome-icon></div>
				<div class="farming__info-card-content">
					<div class="farming__info-card--name">{{ $t('farming-info-games') }}</div>
					<div class="farming__info-card--text">PLACEHOLDER</div>
				</div>
			</div>
			<div class="farming__info-card">
				<div class="farming__info-card--icon"><font-awesome-icon icon="clock"></font-awesome-icon></div>
				<div class="farming__info-card-content">
					<div class="farming__info-card--name">{{ $t('farming-info-time') }}</div>
					<div class="farming__info-card--text">PLACEHOLDER</div>
				</div>
			</div>
			<div class="farming__info-card">
				<div class="farming__info-card--icon"><font-awesome-icon icon="clone"></font-awesome-icon></div>
				<div class="farming__info-card-content">
					<div class="farming__info-card--name">{{ $t('farming-info-cards') }}</div>
					<div class="farming__info-card--text">PLACEHOLDER</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'bot-farming-info'
	};
</script>

<style lang="scss">
	.farming__info {
		display: grid;
		grid-gap: 1em;
		grid-template-columns: 1fr 1fr 1fr;
		justify-content: space-between;
	}

	.farming__info-card {
		background: var(--color-background-light);
		display: flex;
	}

	.farming__info-card--icon {
		height: 64px;
		width: 64px;
		line-height: 64px;
		font-size: 2.1em;
		text-align: center;
		background: var(--color-theme);
		color: var(--color-text);
	}

	.farming__info-card-content {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		padding: 5px 10px;
	}

	.farming__info-card--name {
		text-transform: uppercase;
		font-size: 0.9em;
	}

	.farming__info-card--text {
		font-weight: 600;
		font-size: 1.2em;
		padding-top: 10px;
	}
</style>
