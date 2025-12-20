<template>
  <main v-if="bot" class="main-container main-container--bot-copy">
    <h2 class="title">{{ $t("bot-new") }}</h2>

    <div class="container">
      <p class="container-description">
        {{ $t("bot-new-copy", { name: bot.name }) }}
      </p>

      <form @submit.prevent="onCreate">
        <ConfigEditor
          ref="configEditor"
          :fields="fields"
          :model="model"
          :categories="displayCategories ? categories : null"
          :disabled="creating"
        ></ConfigEditor>

        <div class="form-item">
          <div v-if="error" class="form-error">
            <FontAwesomeIcon icon="exclamation-circle" />
            {{ error }}
          </div>

          <div class="form-item__buttons">
            <button
              type="submit"
              class="button button--confirm"
              :disabled="creating || !isFormValid"
              :class="{ 'button--loading': creating }"
            >
              <FontAwesomeIcon v-if="creating" icon="spinner" spin />
              <span v-else>{{ $t("create") }}</span>
            </button>

            <router-link
              v-slot="{ navigate }"
              custom
              :to="{ name: 'bot-config', params: { bot: bot.name } }"
            >
              <button
                type="button"
                class="button button--cancel pull-right"
                :disabled="creating"
                @click="navigate"
              >
                {{ $t("cancel") }}
              </button>
            </router-link>
          </div>
        </div>
      </form>
    </div>
  </main>
</template>

<script>
import { mapGetters } from "vuex";
import ConfigEditor from "../../components/Config/Editor.vue";
import delay from "../../utils/delay";
import botExists from "../../utils/botExists";
import { get } from "../../utils/storage";
import { newBotCategories } from "../../utils/configCategories";

// Cache for parameter descriptions
const paramDescriptionCache = new Map();

/**
 * Get parameter description with caching
 * @param {string} locale - Current locale
 * @param {string} param - Parameter name
 * @returns {string} Parameter description
 */
const getParamDescription = (locale, param) => {
  const cacheKey = `${locale}:${param}`;

  if (!paramDescriptionCache.has(cacheKey)) {
    const descriptions =
      get(`cache:parameter-descriptions:${locale}`)?.descriptions || {};
    paramDescriptionCache.set(cacheKey, descriptions[param] || "");
  }

  return paramDescriptionCache.get(cacheKey);
};

export default {
  name: "BotCopy",
  components: { ConfigEditor },

  data() {
    // Initialize fields with default values and descriptions
    const fields = [
      {
        defaultValue: "",
        param: "Name",
        paramName: "Name",
        type: "string",
        required: true,
        description: this.$t("name-description"),
        validate: value =>
          (value && value.trim().length > 0) || this.$t("validation.required")
      },
      {
        defaultValue: "",
        param: "SteamLogin",
        paramName: "SteamLogin",
        type: "string",
        required: true,
        description: getParamDescription(this.$i18n.locale, "SteamLogin"),
        validate: value =>
          (value && value.trim().length > 0) || this.$t("validation.required")
      },
      {
        defaultValue: "",
        param: "SteamPassword",
        paramName: "SteamPassword",
        type: "password",
        required: true,
        description: getParamDescription(this.$i18n.locale, "SteamPassword"),
        validate: value =>
          (value && value.trim().length > 0) || this.$t("validation.required")
      }
    ];

    return {
      creating: false,
      categories: newBotCategories,
      fields,
      model: {},
      error: null
    };
  },
  computed: {
    ...mapGetters({
      displayCategories: "settings/displayCategories",
      bots: "bots/bots"
    }),

    /**
     * Get the current bot from the store
     * @returns {Object|null} The bot object or null if not found
     */
    bot() {
      return this.$store.getters["bots/bot"](this.$route.params.bot);
    },

    /**
     * Check if the form is valid
     * @returns {boolean} True if all required fields are filled
     */
    isFormValid() {
      if (!this.$refs.configEditor) return false;
      return this.fields.every(field => {
        if (!field.required) return true;
        const value = this.model[field.param];
        return value && value.toString().trim().length > 0;
      });
    }
  },

  watch: {
    /**
     * Watch for route changes to update the model
     */
    $route: {
      immediate: true,
      deep: true,
      async handler() {
        if (!this.bot) return;
        // Create a clean copy of the bot config
        this.model = JSON.parse(JSON.stringify(this.bot.config));
        this.error = null;
      }
    },

    /**
     * Watch for locale changes to update field descriptions
     */
    "$i18n.locale"() {
      this.updateFieldDescriptions();
    }
  },

  created() {
    if (!this.bot) {
      this.$router.replace({ name: "bots" });
      return;
    }
    this.updateFieldDescriptions();
  },
  methods: {
    /**
     * Update field descriptions based on current locale
     */
    updateFieldDescriptions() {
      this.fields = this.fields.map(field => ({
        ...field,
        description:
          field.param === "Name"
            ? this.$t("name-description")
            : getParamDescription(this.$i18n.locale, field.param)
      }));
    },

    /**
     * Handle form submission for creating a new bot
     */
    async onCreate() {
      if (this.creating) return;

      this.creating = true;
      this.error = null;

      try {
        // Validate bot name
        const botName = this.model.Name?.trim();

        if (!botName) {
          throw new Error(this.$t("bot-create-name"));
        }

        if (botName === "ASF") {
          throw new Error(this.$t("bot-create-name-asf"));
        }

        if (botExists(this.bots, botName)) {
          throw new Error(this.$t("bot-create-name-exist", { name: botName }));
        }

        // Create a clean config object without the name
        const config = { ...this.model };
        delete config.Name;

        // Make API call to create bot
        await this.$http.post(`bot/${encodeURIComponent(botName)}`, {
          botConfig: config
        });

        // Update bot list and close modal
        await this.$store.dispatch("bots/updateBot", { name: botName });
        this.$parent?.close?.();
      } catch (error) {
        this.error = error.message || this.$t("error-unknown");
        this.$error(error.message);
      } finally {
        this.creating = false;
      }

      if (this.model.Name === "ASF") {
        this.$error(this.$t("bot-create-name-asf"));
        return;
      }

      if (botExists(this.bots, this.model.Name)) {
        this.$error(
          this.$t("bot-create-name-exist", { name: this.model.Name })
        );
        return;
      }

      this.creating = true;

      try {
        await this.$http.post(`bot/${this.model.Name}`, { botConfig: config });
        await delay(1000);
        await this.$store.dispatch("bots/updateBot", { name: this.model.Name });
        this.$parent.close();
      } catch (err) {
        this.$error(err.message);
      } finally {
        this.creating = false;
      }
    }
  }
};
</script>

<style lang="scss">
.main-container--bot-copy {
  .container {
    max-width: 800px;
  }

  .form-item {
    margin-top: 1.5rem;

    &__buttons {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }
  }

  .form-error {
    color: var(--color-error);
    background-color: var(--color-error-bg);
    padding: 0.75rem 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    svg {
      flex-shrink: 0;
    }
  }

  .button {
    &--loading {
      opacity: 0.7;
      cursor: wait;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}
</style>
