<template>
	<div class="farming-info">
		<h2 class="title">{{ $t('farming-info') }}</h2>

		<div class="info-cards">
			<div class="info-card">
				<div class="info-card__icon"><font-awesome-icon icon="gamepad"></font-awesome-icon></div>
				<div class="info-card__body">
					<div class="info-card__title">{{ $t('farming-info-games') }}</div>
					<div class="info-card__value">PLACEHOLDER</div>
				</div>
			</div>

			<div class="info-card">
				<div class="info-card__icon"><font-awesome-icon icon="clock"></font-awesome-icon></div>
				<div class="info-card__body">
					<div class="info-card__title">{{ $t('farming-info-time') }}</div>
					<div class="info-card__value">PLACEHOLDER</div>
				</div>
			</div>
			<div class="info-card">
				<div class="info-card__icon"><font-awesome-icon icon="clone"></font-awesome-icon></div>
				<div class="info-card__body">
					<div class="info-card__title">{{ $t('farming-info-cards') }}</div>
					<div class="info-card__value">PLACEHOLDER</div>
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
	.info-cards {
		display: grid;
		grid-gap: 1em;
		grid-template-columns: 1fr 1fr 1fr;
		justify-content: space-between;
	}

	.info-card {
		background: var(--color-background-light);
		display: flex;
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
	}

	.info-card__title {
		text-transform: uppercase;
		font-size: 0.9em;
	}

	.info-card__value {
		font-weight: 600;
		font-size: 1.2em;
		padding-top: 10px;
	}
</style>
