<template>
  <main v-if="bot" class="main-container main-container--bot-profile">
    <h2 v-tooltip="bot.name" class="title" id="modal-title">
      {{ $t("confirmation-title") }}
    </h2>

    <p
      class="info"
      v-html="$t('2fa-delete-warning', { name: bot.viewableName })"
      id="modal-description"
    ></p>

    <form @submit.prevent="onDelete" class="form-item">
      <div class="form-item__confirmation">
        <label
          for="confirmation-input"
          class="form-item__label"
          v-html="$t('confirmation', { name: bot.viewableName })"
        ></label>
        <input
          id="confirmation-input"
          v-model="confirmationText"
          class="form-item__input"
          type="text"
          autocomplete="off"
          :aria-describedby="error ? 'error-message' : undefined"
          :aria-invalid="!!error"
        />
        <div v-if="error" id="error-message" class="form-error">
          <FontAwesomeIcon icon="exclamation-circle" />
          {{ error }}
        </div>
      </div>

      <div class="form-item__buttons form-item__buttons--center">
        <button
          type="submit"
          class="button button--cancel"
          :disabled="!confirmed || deleting"
          :aria-busy="deleting"
          :aria-live="deleting ? 'polite' : 'off'"
        >
          <FontAwesomeIcon v-if="deleting" icon="spinner" spin />
          <span v-else>{{ $t("delete") }}</span>
        </button>

        <button
          type="button"
          class="button button--confirm"
          @click="onCancel"
          :disabled="deleting"
        >
          {{ $t("cancel") }}
        </button>
      </div>
    </form>
  </main>
</template>

<script>
// import { mapActions } from "vuex";
import delay from "../../utils/delay";

export default {
  name: "Bot2faDelete",

  data() {
    return {
      deleting: false,
      confirmationText: "",
      error: null
    };
  },

  computed: {
    bot() {
      return this.$store.getters["bots/bot"](this.$route.params.bot);
    },

    confirmed() {
      return this.confirmationText === this.bot.viewableName;
    }
  },

  watch: {
    confirmationText() {
      // Clear error when user types
      if (this.error) {
        this.error = null;
      }
    }
  },

  created() {
    if (!this.bot) {
      this.$router.replace({ name: "bots" });
    }
    // Set focus to input when component is mounted
    this.$nextTick(() => {
      const input = document.getElementById("confirmation-input");
      if (input) input.focus();
    });
  },

  methods: {
    onCancel() {
      this.$emit("cancel");
      this.$parent?.back?.();
    },

    async onDelete() {
      if (this.deleting || !this.confirmed) return;

      this.deleting = true;
      this.error = null;

      try {
        const botName = this.bot.name;
        const response = await this.$http.del(
          `bot/${encodeURIComponent(botName)}/twoFactorAuthentication`
        );

        if (response[botName]?.Success) {
          this.$success(this.$t("2fa-delete-success", { bot: botName }));
          await delay(1000);
          await this.updateBotList();
          this.$router.push({ name: "bots" });
        } else {
          throw new Error(
            response[botName]?.Message || this.$t("error-unknown")
          );
        }
      } catch (err) {
        this.error = err.message || this.$t("error-unknown");
        this.$error(this.error);
      } finally {
        this.deleting = false;
      }
    },

    async updateBotList() {
      try {
        await this.$store.dispatch("bots/updateBots");
      } catch (error) {
        console.error("Failed to update bot list:", error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.main-container--bot-profile {
  max-width: 500px;
  margin: 0 auto;
  padding: 1.5rem;
}

.form-item {
  margin-top: 1.5rem;

  &__confirmation {
    margin-bottom: 1.5rem;
  }

  &__label {
    font-weight: 500;
    display: block;
    margin-bottom: 0.5rem;
    color: var(--color-text);

    ::v-deep strong {
      color: var(--color-theme);
      font-weight: 600;
    }
  }

  &__input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--color-theme);
      box-shadow: 0 0 0 2px rgba(var(--color-theme-rgb), 0.2);
    }

    &[aria-invalid="true"] {
      border-color: var(--color-error);
    }
  }

  &__buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
  }
}

.form-error {
  color: var(--color-error);
  background-color: var(--color-error-bg);
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;

  svg {
    flex-shrink: 0;
  }
}

.button {
  min-width: 100px;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &--cancel {
    background-color: var(--color-error);
    color: white;
    border: 1px solid var(--color-error);

    &:hover:not(:disabled) {
      background-color: var(--color-error-dark);
      border-color: var(--color-error-dark);
    }
  }

  &--confirm {
    background-color: var(--color-success);
    color: white;
    border: 1px solid var(--color-success);

    &:hover:not(:disabled) {
      background-color: var(--color-success-dark);
      border-color: var(--color-success-dark);
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &[aria-busy="true"] {
    position: relative;
    color: transparent;

    &::after {
      content: "";
      position: absolute;
      width: 1em;
      height: 1em;
      border: 2px solid currentColor;
      border-radius: 50%;
      border-right-color: transparent;
      animation: spin 0.75s linear infinite;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.info {
  color: var(--color-text-secondary);
  margin: 1rem 0;
  line-height: 1.5;
}
</style>
