<template>
  <label class="form-item__label">{{ label }}
    <font-awesome-icon v-if="hasDescription" class="form-item__description-icon" icon="question" @click="$parent.toggleDescription"></font-awesome-icon>
  </label>
</template>

<script>
  export default {
    name: 'input-label',
    props: {
      label: String,
      field: String,
      hasDescription: Boolean,
    },
  };
</script>
