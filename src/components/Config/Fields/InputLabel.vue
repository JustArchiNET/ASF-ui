<template>
  <label class="form-item__label">{{ label }}
    <FontAwesomeIcon v-if="hasDescription" class="form-item__description-icon" icon="question" @click="$parent.toggleDescription"></FontAwesomeIcon>
  </label>
</template>

<script>
  export default {
    name: 'InputLabel',
    props: {
      label: String,
      field: String,
      hasDescription: Boolean,
    },
  };
</script>
