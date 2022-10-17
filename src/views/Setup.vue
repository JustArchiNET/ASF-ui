<template>
  <main class="main-container main-container--center">
    <div class="container container--small">
      <h2 class="title">{{ $t("setup") }}</h2>

      <div v-if="status === 'AUTHENTICATED'">
        <p v-if="$route.params.restart" class="status-text">
          {{ $t("setup-restart") }}
        </p>
        <p v-else-if="$route.params.update" class="status-text">
          {{ $t("setup-update") }}
        </p>
        <p v-else class="status-text">{{ $t("setup-authenticated") }}</p>
      </div>

      <p v-if="statusText" class="status-text" v-html="statusText"></p>

      <div v-if="status === 'UNAUTHORIZED'" class="form-item">
        <div class="form-item__code">
          <div>
            <label for="password" class="form-item__label">{{
              $t("password")
            }}</label>
            <input
              id="password"
              v-model="password"
              class="form-item__input"
              type="password"
              @keydown.enter="updatePassword"
            />
          </div>
          <div class="form-item__buttons form-item__buttons--column">
            <button
              v-tooltip="$t('input-switch-visibility')"
              class="button button--helper"
              @click="switchInputType"
            >
              <FontAwesomeIcon
                v-if="inputHidden"
                icon="eye"
                size="lg"
              ></FontAwesomeIcon>
              <FontAwesomeIcon
                v-else
                icon="eye-slash"
                size="lg"
              ></FontAwesomeIcon>
            </button>
          </div>
        </div>
      </div>

      <div v-if="status !== 'AUTHENTICATED'" class="form-item">
        <div class="form-item__buttons form-item__buttons--center">
          <button class="button button--confirm" @click="onButtonClick">
            <FontAwesomeIcon
              v-if="processing"
              icon="spinner"
              spin
            ></FontAwesomeIcon>
            <span v-else>{{ buttonText }}</span>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapGetters } from "vuex";
import { STATUS } from "../utils/getStatus";
import * as storage from "../utils/storage";
import waitForRestart from "../utils/waitForRestart";

export default {
  name: "Setup",
  metaInfo() {
    return {
      title: this.$t("setup"),
    };
  },
  data() {
    return {
      password: this.$store.getters["auth/password"],
      processing: false,
      countdown: 5,
      timer: null,
      inputHidden: true,
    };
  },
  computed: {
    ...mapGetters({ status: "auth/status" }),
    buttonText() {
      switch (this.status) {
        case STATUS.UNAUTHORIZED:
        case STATUS.AUTHENTICATED:
          return this.$t("continue");
        default:
          return this.$t("refresh");
      }
    },
    statusText() {
      switch (this.status) {
        case STATUS.UNAUTHORIZED:
          return this.$t("setup-description");
        case STATUS.NOT_CONNECTED:
          return this.$t("setup-not-connected");
        case STATUS.GATEWAY_TIMEOUT:
          return this.$t("setup-gateway-timeout", { n: this.countdown });
        case STATUS.NETWORK_ERROR:
          return this.$t("setup-network-error", { n: this.countdown });
        case STATUS.NO_IPC_PASSWORD:
          return this.$t("setup-no-ipc-password");
        case STATUS.RATE_LIMITED:
          return this.$t("setup-rate-limited");
        default:
          return null;
      }
    },
  },
  watch: {
    status() {
      this.cancelAutoUpdate();
      this.checkStatus();
    },
    countdown: {
      immediate: true,
      handler(value) {
        if (value > 0) setTimeout(() => this.countdown--, 1000);
        if (value === 0) this.countdown = 5;
      },
    },
    $route: {
      immediate: true,
      async handler() {
        if (this.$route.params.restart) await this.handleWaiting("restart");
        else if (this.$route.params.update) await this.handleWaiting("update");
        else this.checkStatus();
      },
    },
  },
  beforeDestroy() {
    this.cancelAutoUpdate();
  },
  mounted() {
    this.onButtonClick();
  },
  methods: {
    switchInputType() {
      this.inputHidden = !this.inputHidden;
      const field = document.getElementById("password");

      if (field.getAttribute("type") === "password")
        field.setAttribute("type", "text");
      else field.setAttribute("type", "password");
    },
    async handleWaiting(mode = "restart") {
      this.processing = true;
      await waitForRestart();
      if (mode === "restart") this.$success(this.$t("restart-complete"));
      else if (mode === "update") this.$success(this.$t("update-complete"));
      this.processing = false;
      this.checkStatus();
    },
    async onButtonClick() {
      if (this.processing) return;

      switch (this.status) {
        case STATUS.UNAUTHORIZED:
          this.updatePassword();
          break;
        case STATUS.AUTHENTICATED:
          this.redirect();
          break;
        default:
          this.refreshStatus();
      }
    },
    async updatePassword() {
      this.processing = true;

      storage.remove("cache:authentication-required");

      try {
        await this.$store.dispatch("auth/setPassword", this.password);

        const validPassword = await this.$store.dispatch("auth/validate");
        if (validPassword) {
          this.redirect();
        } else {
          await this.resetPassword();
          this.$error(this.$t("password-invalid"));
        }
      } catch (err) {
        this.$error(err.message);
      } finally {
        this.processing = false;
      }
    },
    async refreshStatus() {
      this.processing = true;

      try {
        await this.$store.dispatch("auth/updateStatus");
      } catch (err) {
        this.$error(err.message);
      } finally {
        this.processing = false;
      }
    },
    redirect() {
      // Add empty onAbort callback, since we are expecting navigation abort and redirect via beforeEnter guard
      // https://router.vuejs.org/guide/advanced/navigation-failures.html#navigation-failures
      this.$router.replace(
        { name: "home" },
        () => {},
        () => {}
      );
    },
    cancelAutoUpdate() {
      clearInterval(this.timer);
    },
    async checkStatus() {
      switch (this.status) {
        case STATUS.AUTHENTICATED:
          this.redirect();
          break;
        case STATUS.RATE_LIMITED:
          this.cancelAutoUpdate();
          break;
        case STATUS.UNAUTHORIZED:
        case STATUS.NO_IPC_PASSWORD:
          this.cancelAutoUpdate();
          await this.resetPassword();
          break;
        default:
          this.timer = setInterval(this.refreshStatus, this.countdown * 1000);
      }
    },
    async resetPassword() {
      this.password = null;
      await this.$store.dispatch("auth/setPassword", this.password);
    },
  },
};
</script>

<style lang="scss">
.status-text {
  text-align: center;

  a {
    color: var(--color-theme);
  }
}

.button--helper {
  max-width: 2em;
}
</style>
