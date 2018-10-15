<template>
  <label class="form-item__label" :for="field">{{ label }}<font-awesome-icon class="form-item__description-icon" icon="question" v-if="hasDescription" @click="$parent.toggleDescription"></font-awesome-icon></label>
</template>

<script>
  export default {
    name: 'input-label',
		props: {
    	label: String,
			field: String,
			hasDescription: Boolean
		}
  };
</script>
