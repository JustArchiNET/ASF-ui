<template>
	<div class="bgr__keys">
		<span v-if="noKeys" class="bgr__no-keys">{{ $t('bgr-no-keys-detected') }}</span>

		<table v-else class="bgr__table">
			<tr>
				<th>Game</th>
				<th>Key</th>
			</tr>
			<tr v-for="(name, key) in keys" class="key">
				<td>{{ name }}</td>
				<td>{{ key }}</td>
			</tr>
		</table>
	</div>
</template>

<script>
	export default {
		name: 'bgr-keys',
		props: { keys: Object },
		computed: {
			noKeys() {
				return Object.keys(this.keys).length === 0;
			}
		}
	};
</script>

<style lang="scss">
	.bgr__no-keys {
		font-weight: bold;
		text-align: center;
	}

	.bgr__table {
		min-width: 100%;
		text-align: center;

		td {
			@media screen and (max-width: 335px) {
				padding: 0.35em 0.5em;
			}
		}
	}
</style>
