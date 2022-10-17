<template>
  <main class="main-container main-container--center">
    <div class="container container--small">
      <h2 class="title">{{ $t("welcome") }}</h2>
      <p class="subtitle">{{ $t("welcome-message") }}</p>

      <div v-if="bots.length === 0" class="form-item">
        <p class="subtitle">{{ $t("welcome-message-todo") }}</p>
        <ul class="list">
          <li v-if="bots.length === 0" class="list-item">
            {{ $t("welcome-message-bot") }}
          </li>
        </ul>
      </div>

      <div class="form-item">
        <div class="form-item__buttons form-item__buttons--center">
          <router-link v-slot="{ navigate }" custom :to="{ name: 'home' }">
            <button class="button button--confirm" @click="navigate">
              {{ $t("continue") }}
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapGetters } from "vuex";
import { set } from "../utils/storage";

export default {
  name: "Welcome",
  metaInfo() {
    return {
      title: this.$t("welcome"),
    };
  },
  computed: mapGetters({
    bots: "bots/bots",
  }),
  mounted() {
    set("first-time", false);
  },
};
</script>

<style lang="scss">
.list {
  display: table;
  margin: 0 auto;
  padding-bottom: 20px;
}
</style>
