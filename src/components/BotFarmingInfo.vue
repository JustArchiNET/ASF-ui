<template>
	<div>
		<h2 class="title">{{ $t('farming-info') }}</h2>

		<div class="farming__info">
			<div class="farming__card">
				<div class="farming__card-icon"><font-awesome-icon icon="gamepad"></font-awesome-icon></div>
				<div class="farming__card-content">
					<div class="farming__card-content--name">{{ $t('farming-info-games') }}</div>
					<div class="farming__card-content--text">PLACEHOLDER</div>
				</div>
			</div>
			<div class="farming__card">
				<div class="farming__card-icon"><font-awesome-icon icon="clock"></font-awesome-icon></div>
				<div class="farming__card-content">
					<div class="farming__card-content--name">{{ $t('farming-info-time') }}</div>
					<div class="farming__card-content--text">PLACEHOLDER</div>
				</div>
			</div>
			<div class="farming__card">
				<div class="farming__card-icon"><font-awesome-icon icon="clone"></font-awesome-icon></div>
				<div class="farming__card-content">
					<div class="farming__card-content--name">{{ $t('farming-info-cards') }}</div>
					<div class="farming__card-content--text">PLACEHOLDER</div>
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

	.farming__card {
		background: var(--color-background-light);
		display: flex;
	}

	.farming__card-icon {
		height: 4rem;
		width: 4rem;
		font-size: 2.1em;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-theme);
		color: var(--color-text);
	}

	.farming__card-content {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		padding: 5px 10px;
	}

	.farming__card-content--name {
		text-transform: uppercase;
		font-size: 0.9em;
	}

	.farming__card-content--text {
		font-weight: 600;
		font-size: 1.2em;
		padding-top: 10px;
	}
</style>
