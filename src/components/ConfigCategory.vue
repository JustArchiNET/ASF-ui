<template>
	<fieldset class="config-category form-group">
		<legend v-if="name" class="form-group__legend">
			{{ name }}
		</legend>
		<slot />
	</fieldset>
</template>

<script>
	export default {
		name: 'config-category',
		props: {
			name: String
		},
		computed: {
			isValid() {
				return this.$children.every(child => child.isValid);
			}
		}
	};
</script>
