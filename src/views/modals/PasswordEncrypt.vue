<template>
  <main v-if="label && bot" class="main-container main-container--bot-profile">
    <h2 class="title">{{ $t("encrypt") }}</h2>

    <template v-if="loading">
      <h3 class="subtitle">
        <FontAwesomeIcon icon="spinner" size="lg" spin></FontAwesomeIcon>
      </h3>
    </template>
    <template v-else>
      <div class="form-item">
        <ConfigEditor
          :fields="fields"
          :model="config"
          :deleteDefaultValues="false"
        ></ConfigEditor>

        <div class="form-item__code">
          <div>
            <label for="password" class="form-item__label">{{ label }}</label>
            <input
              id="password"
              v-model="password"
              class="form-item__input"
              type="password"
              autocomplete="new-password"
              @keydown.enter="savePassword"
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

        <div class="form-item__buttons form-item__buttons--center">
          <button class="button" :disabled="!password" @click="savePassword">
            <FontAwesomeIcon
              v-if="saving"
              icon="spinner"
              spin
            ></FontAwesomeIcon>
            <span v-else>{{ $t("encrypt") }}</span>
          </button>

          <button class="button" @click="$router.back()">
            {{ $t("cancel") }}
          </button>
        </div>
      </div>
    </template>
  </main>
</template>

<script>
import { mapGetters } from "vuex";
import ConfigEditor from "../../components/Config/Editor.vue";
import fetchConfigSchema from "../../utils/fetchConfigSchema";
import loadParameterDescriptions from "../../utils/loadParameterDescriptions";

export default {
  name: "PasswordEncrypt",
  components: {
    ConfigEditor,
  },
  data() {
    return {
      password: "",
      inputHidden: true,
      config: {},
      loading: true,
      fields: [],
      saving: false,
    };
  },
  computed: {
    ...mapGetters({
      version: "asf/version",
    }),
    label() {
      return this.$route.params.label;
    },
    key() {
      if (this.$route.params.label.startsWith("Steam")) return "PasswordFormat";
      return `${this.$route.params.label}Format`;
    },
    bot() {
      return this.$store.getters["bots/bot"](this.$route.params.bot);
    },
  },
  async created() {
    if (!this.label || !this.bot) this.$router.replace({ name: "bots" });

    const [
      { body: fields },
      {
        [this.bot.name]: { BotConfig: model },
      },
      descriptions,
    ] = await Promise.all([
      fetchConfigSchema("ArchiSteamFarm.Steam.Storage.BotConfig"),
      this.$http.get(`bot/${this.bot.name}`),
      loadParameterDescriptions(this.version, this.$i18n.locale),
    ]);

    Object.keys(model).forEach((key) => {
      if (key.startsWith("s_")) delete model[key.substr(2)];
    });

    this.config = { [this.key]: model[this.key] };

    const description = !descriptions[this.key]
      ? this.$t("description-not-found")
      : descriptions[this.key].replace(
          /<a href="/g,
          '<a target="_blank" rel="noreferrer noopener" href="'
        );
    this.fields = [{ description, ...fields[this.key] }];

    this.loading = false;
  },
  methods: {
    switchInputType() {
      this.inputHidden = !this.inputHidden;
      const field = document.getElementById("password");

      if (field.getAttribute("type") === "password")
        field.setAttribute("type", "text");
      else field.setAttribute("type", "password");
    },
    async savePassword() {
      if (this.saving) return;
      this.saving = true;

      try {
        const newPassword = await this.$http.post("asf/encrypt", {
          CryptoMethod: this.config[this.key],
          StringToEncrypt: this.password,
        });

        this.config[this.label] = newPassword;

        await this.$http.post(`bot/${this.bot.name}`, {
          botConfig: this.config,
        });
        this.$router.back();
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.form-item__code {
  padding: 0 1em 1em;
}
</style>
