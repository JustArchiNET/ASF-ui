<template>
    <main class="main-container main-container--center">
        <div class="container container--small">
            <h2 class="title">Setup</h2>
            <h4 class="subtitle">Before continuing, you need to configure IPC access</h4>

            <div class="form-item">
                <label for="password" class="form-item__label">Password</label>
                <input id="password" class="form-item__input" type="password" v-model="password" @keydown.enter="updatePassword">
            </div>

            <div class="form-item">
                <button class="button button--confirm" @click="updatePassword">Continue</button>
            </div>
        </div>
    </main>
</template>

<script>
  export default {
    name: 'setup',
    metaInfo: { title: 'Setup' },
    components: {},
    data() {
      return {
        password: this.$store.getters['auth/password']
      }
    },
    methods: {
      async updatePassword() {
        this.$store.commit('auth/setPassword', this.password);
        const validPassword = await this.$store.dispatch('auth/validate');
        if (validPassword) this.$router.replace('/')
      }
    }
  };
</script>
