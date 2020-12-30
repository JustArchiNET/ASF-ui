<template>
  <div class="farming-info">
    <div class="farming-info__icon">
      <FontAwesomeIcon :icon="icon"></FontAwesomeIcon>
    </div>

    <p class="farming-info__value">
      {{ value }}
    </p>
  </div>
</template>

<script>
  export default {
    name: 'BotFarmingInfo',
    props: {
      icon: String,
      value: {},
      title: String,
    },
  };
</script>

<style lang="scss">
	.farming-info {
		background: var(--color-background-light);
		display: grid;
		grid-template-columns: auto 1fr;
	}

	.farming-info__icon {
		align-items: center;
		color: var(--color-text-disabled);
		display: flex;
		font-size: 1.4em;
		justify-content: center;
		padding: 0 0.1em 0 0.5em;
	}

	.farming-info__value {
		font-size: 1.2em;
		font-weight: 600;
		margin: 0;
		overflow: hidden;
		padding: 5px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
