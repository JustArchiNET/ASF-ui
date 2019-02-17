<template>
	<div class="bgr__keys">
		<span class="bgr__no-keys" v-if="noKeys">{{ $t('bgr-no-keys-detected') }}</span>

		<table class="bgr__table" v-else>
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
		props: { keys: Object },
		name: 'bgr-keys',
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
				padding: 0.35em .5em;
			}
		}
	}
</style>
