<template>
  <label class="form-item__label">{{ label }}
    <FontAwesomeIcon v-if="hasDescription" class="form-item__description-icon" icon="question" @click="$parent.toggleDescription"></FontAwesomeIcon>
    <FontAwesomeIcon v-if="showKey" class="form-item__description-icon pull-right" icon="key" @click="onRoute(label)"></FontAwesomeIcon>
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
    computed: {
      showKey() {
        return this.label === 'IPCPassword' && this.$route.name === 'asf-config'
          || this.label === 'SteamPassword' && this.$route.name === 'bot-config';
      },
    },
    methods: {
      onRoute(label) {
        if (label === 'IPCPassword') return this.$router.push({ name: 'password-hash', params: { label } });
        if (label === 'SteamPassword') return this.$router.push({ name: 'password-encrypt', params: { label } });
      },
    },
  };
</script>
