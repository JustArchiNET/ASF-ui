<template>
    <fieldset class="config-category form-group">
        <legend class="form-group__legend" v-if="name">{{ name }}</legend>
        <slot></slot>
    </fieldset>
</template>

<script>
    export default {
      name: 'config-category',
      props: {
        name: String
      }
    }
</script>