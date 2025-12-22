<template>
  <ErrorBoundary :error-message="errorMessage" @retry="handleRetry">
    <div
      v-if="loading"
      class="bot-skeleton-container"
      :aria-busy="true"
      aria-live="polite"
      :aria-label="`Loading ${bot?.name || 'bot'} information`"
    >
      <BotCardSkeleton :status="bot?.status || 'offline'" />
    </div>

    <div
      v-else
      class="bot"
      :class="[`status--${bot.status}`, { 'bot--favorite': isFavorite }]"
      role="article"
      :aria-label="`Bot: ${bot.name}, Status: ${bot.statusText}`"
      tabindex="0"
      @keydown.enter="handleCardClick"
      @click="handleCardClick"
    >
      <div class="bot__header">
        <router-link
          v-if="bot.steamid !== '0'"
          :to="{ name: 'bot', params: { bot: bot.name } }"
          class="bot__avatar-link"
          :aria-label="`View ${bot.name} profile`"
        >
          <img
            v-tooltip="bot.name"
            class="bot__avatar"
            :src="bot.avatarURL"
            :alt="`${bot.name} avatar`"
            loading="lazy"
          />
        </router-link>
        <router-link
          v-else
          v-slot="{ navigate }"
          custom
          :to="{ name: 'bot', params: { bot: bot.name } }"
        >
          <button
            class="bot__avatar-button"
            @click="navigate"
            :aria-label="`View ${bot.name} details`"
          >
            <img
              v-tooltip="bot.name"
              class="bot__avatar"
              :src="bot.avatarURL"
              :alt="`${bot.name} avatar`"
              loading="lazy"
            />
          </button>
        </router-link>

        <div class="bot__status">
          <div class="bot__status-header">
            <h3
              class="bot__status-property bot__status-property--name"
              v-tooltip.bottom-start="bot.name"
              tabindex="0"
            >
              {{ bot.viewableName }}
            </h3>
            <button
              class="bot__favorite"
              @click.stop="toggleFavorite"
              :aria-label="
                isFavorite ? 'Remove from favorites' : 'Add to favorites'
              "
            >
              <FontAwesomeIcon
                :icon="isFavorite ? 'star' : ['far', 'star']"
                :class="{ 'text-yellow-400': isFavorite }"
              />
            </button>
          </div>
          <span class="bot__status-property bot__status-property--text">
            {{ bot.statusText }}
          </span>
        </div>
      </div>

      <div
        class="bot__actions"
        role="toolbar"
        :aria-label="`Actions for ${bot.name}`"
      >
        <template v-for="button in visibleButtons" :key="button.name">
          <router-link
            v-if="button.name !== 'pause'"
            v-slot="{ navigate, isActive }"
            custom
            :to="{ name: `bot-${button.name}`, params: { bot: bot.name } }"
          >
            <button
              class="bot__action"
              :class="{ 'bot__action--active': isActive }"
              @click="navigate"
              v-tooltip="$t(`bot-fav-buttons-${button.name}`)"
              :aria-label="
                `${$t(`bot-fav-buttons-${button.name}`)} for ${bot.name}`
              "
            >
              <FontAwesomeIcon :icon="button.icon"></FontAwesomeIcon>
            </button>
          </router-link>
        </template>

        <button
          v-if="bot.paused && bot.active && isPauseButtonSelected"
          class="bot__action"
          @click="resume"
          v-tooltip="$t('bot-title-resume', { bot: bot.name })"
          :aria-label="`Resume ${bot.name}`"
          :disabled="actionInProgress"
        >
          <FontAwesomeIcon icon="play"></FontAwesomeIcon>
        </button>

        <button
          v-else-if="!bot.paused && bot.active && isPauseButtonSelected"
          class="bot__action"
          @click="pause"
          v-tooltip="$t('bot-title-pause', { bot: bot.name })"
          :aria-label="`Pause ${bot.name}`"
          :disabled="actionInProgress"
        >
          <FontAwesomeIcon icon="pause"></FontAwesomeIcon>
        </button>

        <button
          v-if="!bot.active"
          class="bot__action"
          @click="start"
          v-tooltip="$t('bot-title-start', { bot: bot.name })"
          :aria-label="`Start ${bot.name}`"
          :disabled="actionInProgress"
        >
          <FontAwesomeIcon icon="power-off"></FontAwesomeIcon>
        </button>

        <button
          v-if="bot.active"
          class="bot__action"
          @click="stop"
          v-tooltip="$t('bot-title-stop', { bot: bot.name })"
          :aria-label="`Stop ${bot.name}`"
          :disabled="actionInProgress"
        >
          <FontAwesomeIcon icon="power-off"></FontAwesomeIcon>
        </button>

        <div v-if="actionInProgress" class="bot__action bot__action--loading">
          <FontAwesomeIcon icon="spinner" spin />
        </div>
      </div>

      <div v-if="error" class="bot__error">
        <FontAwesomeIcon icon="exclamation-circle" />
        <span>{{ error }}</span>
      </div>
    </div>
  </ErrorBoundary>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { debounce } from "lodash";
import BotCardSkeleton from "./BotCardSkeleton.vue";
import ErrorBoundary from "../Common/ErrorBoundary.vue";
import getUserInputType from "../../utils/getUserInputType";

const quickActionButtons = [
  { name: "2fa", icon: "lock" },
  { name: "bgr", icon: "key" },
  { name: "config", icon: "wrench" },
  { name: "pause", icon: "none" }
];

export default {
  name: "BotCard",
  components: {
    BotCardSkeleton,
    ErrorBoundary
  },
  props: {
    bot: {
      type: Object,
      required: true,
      validator: bot => typeof bot === "object" && bot !== null
    }
  },
  data() {
    return {
      loading: false,
      actionInProgress: false,
      error: null,
      localFavorites: JSON.parse(localStorage.getItem("favoriteBots") || "{}")
    };
  },
  computed: {
    ...mapGetters({
      favButtons: "settings/favButtons",
      isRunningHeadless: "asf/isRunningHeadless"
    }),
    isFavorite() {
      return !!this.localFavorites[this.bot.name];
    },
    isPauseButtonSelected() {
      return this.visibleButtons.some(btn => btn.name === "pause");
    },
    visibleButtons() {
      return Array.from(this.favButtons.toString(2))
        .reverse()
        .reduce((activeButtons, enabled, index) => {
          if (enabled === "1" && quickActionButtons[index]) {
            activeButtons.push(quickActionButtons[index]);
          }
          return activeButtons;
        }, []);
    },
    errorMessage() {
      return this.error || "An error occurred while loading bot information.";
    }
  },
  methods: {
    ...mapActions("bots", ["updateBot"]),
    ...mapActions("favorites", ["addFavorite", "removeFavorite"]),

    handleCardClick(event) {
      // If the click was on a button or link, let that handle the navigation
      if (event.target.closest('button, a, [role="button"]')) {
        return;
      }
      this.$router.push({ name: "bot", params: { bot: this.bot.name } });
    },
    toggleFavorite() {
      if (this.isFavorite) {
        this.removeFavorite(this.bot.name);
      } else {
        this.addFavorite(this.bot.name);
      }
      // Update local state
      this.localFavorites = {
        ...this.localFavorites,
        [this.bot.name]: !this.isFavorite
      };
      localStorage.setItem("favoriteBots", JSON.stringify(this.localFavorites));
    },
    async performAction(action, params = {}) {
      if (this.actionInProgress) return;

      this.loading = true;
      this.actionInProgress = true;
      this.error = null;

      try {
        await this.$http.botAction(this.bot.name, action, params);
        // Update local bot state
        const updates = { ...params };
        if (action === "start") updates.active = true;
        if (action === "stop") updates.active = false;
        if (action === "pause") updates.paused = true;
        if (action === "resume") updates.paused = false;

        await this.updateBot({ name: this.bot.name, ...updates });
      } catch (err) {
        console.error(`Error performing ${action} on ${this.bot.name}:`, err);
        this.error = err.message || `Failed to ${action} bot`;
        this.$snotify.error(this.error, "Error", { timeout: 3000 });
      } finally {
        this.loading = false;
        this.actionInProgress = false;
      }
    },
    // Debounce rapid clicks to prevent multiple actions
    pause: debounce(
      function() {
        this.performAction("pause", { permanent: true, resumeInSeconds: 0 });
      },
      300,
      { leading: true, trailing: false }
    ),
    resume: debounce(
      function() {
        this.performAction("resume");
      },
      300,
      { leading: true, trailing: false }
    ),
    start: debounce(
      async function() {
        try {
          const inputType = getUserInputType(this.bot.requiredInput);
          if (this.isRunningHeadless && inputType !== "None") {
            this.$router.push({
              name: "bot-input",
              params: { bot: this.bot.name, type: inputType }
            });
            return;
          }
          await this.performAction("start");
        } catch (err) {
          console.error("Error starting bot:", err);
          this.error = err.message || "Failed to start bot";
        }
      },
      300,
      { leading: true, trailing: false }
    ),
    stop: debounce(
      function() {
        this.performAction("stop");
      },
      300,
      { leading: true, trailing: false }
    ),
    handleRetry() {
      this.error = null;
      this.loading = false;
      this.actionInProgress = false;
      this.$emit("retry");
    }
  }
};
</script>

<style lang="scss" scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.bot {
  $self: &;
  background: var(--color-background-light);
  border-radius: 0.5rem;
  border-top: 3px solid var(--color-status);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    #{$self}__actions {
      opacity: 1;
      visibility: visible;
    }
  }

  &--favorite {
    border-left: 3px solid var(--color-warning);
  }

  &__header {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--color-border);
  }

  &__avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    object-fit: cover;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }

    &-link,
    &-button {
      display: inline-flex;
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
    }

    &-button {
      &:focus {
        outline: 2px solid var(--color-primary);
        border-radius: 50%;
      }
    }
  }

  &__status {
    flex: 1;
    margin-left: 0.75rem;
    min-width: 0;

    &-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    &-property {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &--name {
        font-weight: 600;
        font-size: 0.95rem;
        color: var(--color-text-dark);

        &:focus {
          outline: 2px solid var(--color-primary);
          border-radius: 4px;
        }
      }

      &--text {
        font-size: 0.8rem;
        color: var(--color-text-muted);
        margin-top: 0.2rem;
      }
    }
  }

  &__favorite {
    background: none;
    border: none;
    color: var(--color-text-muted);
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;

    &:hover,
    &:focus {
      color: var(--color-warning);
      outline: none;
    }

    .text-yellow-400 {
      color: #fbbf24;
    }
  }

  &__actions {
    display: flex;
    justify-content: space-around;
    padding: 0.75rem;
    background: var(--color-background-lighter);
    transition: all 0.3s ease;

    @media (max-width: 768px) {
      padding: 0.5rem;
    }
  }

  &__action {
    background: none;
    border: none;
    color: var(--color-text-muted);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    width: 2.25rem;
    height: 2.25rem;

    &:hover,
    &:focus {
      color: var(--color-primary);
      background: var(--color-background-dark);
      outline: none;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &--active {
      color: var(--color-primary);
      background: var(--color-primary-light);
    }

    &--loading {
      animation: spin 1s linear infinite;
      color: var(--color-primary);
    }
  }

  &__error {
    background-color: var(--color-error-bg);
    color: var(--color-error);
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    svg {
      flex-shrink: 0;
    }
  }
}

// Skeleton loader styles
.bot-skeleton-container {
  background: var(--color-background-light);
  border-radius: 0.5rem;
  padding: 1rem;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

// Responsive adjustments
@media (max-width: 480px) {
  .bot {
    &__actions {
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    &__action {
      width: 2rem;
      height: 2rem;
      padding: 0.35rem;
    }
  }
}

// Dark mode adjustments
.app--dark-mode {
  .bot {
    background: var(--color-background-darker);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

    &:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    &__status-property--name {
      color: var(--color-text-light);
    }

    &__action {
      &:hover,
      &:focus {
        background: var(--color-background-dark);
      }
    }
  }
}
</style>
