<template>
  <div class="bots-view">
    <div class="bots-view__header">
      <h1 class="bots-view__title">{{ $t("bots.management") }}</h1>

      <div class="bots-view__filters">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('bots.search_placeholder')"
            class="search-box__input"
            @input="handleSearch"
          />
          <FontAwesomeIcon icon="search" class="search-box__icon" />
        </div>

        <div class="filter-controls">
          <label class="filter-toggle">
            <input
              v-model="showFavoritesOnly"
              type="checkbox"
              class="filter-toggle__input"
            />
            <span class="filter-toggle__slider"></span>
            <span class="filter-toggle__label">{{
              $t("bots.favorites_only")
            }}</span>
          </label>
        </div>
      </div>
    </div>

    <div v-if="loading" class="bots-view__loading">
      <div v-for="i in 6" :key="i" class="bot-skeleton">
        <BotCardSkeleton />
      </div>
    </div>

    <ErrorBoundary
      v-else-if="error"
      :error-message="error"
      @retry="fetchBots"
    />

    <template v-else>
      <div v-if="filteredBots.length > 0" class="bots-view__grid">
        <BotCard
          v-for="bot in filteredBots"
          :key="bot.name"
          :bot="bot"
          class="bots-view__bot-card"
          @favorite="handleFavorite"
        />
      </div>

      <div v-else class="bots-view__empty">
        <FontAwesomeIcon icon="robot" class="bots-view__empty-icon" />
        <p class="bots-view__empty-text">
          {{ $t("bots.no_bots_found") }}
        </p>
        <button class="bots-view__empty-button" @click="resetFilters">
          {{ $t("bots.reset_filters") }}
        </button>
      </div>

      <Pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="handlePageChange"
      />
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { debounce } from "lodash";
import BotCard from "@/components/Bot/BotCard.vue";
import BotCardSkeleton from "@/components/Bot/BotCardSkeleton.vue";
import ErrorBoundary from "@/components/Common/ErrorBoundary.vue";
import Pagination from "@/components/Common/Pagination.vue";

export default {
  name: "BotsView",

  components: {
    BotCard,
    BotCardSkeleton,
    ErrorBoundary,
    Pagination
  },

  data() {
    return {
      loading: false,
      error: null,
      searchQuery: "",
      showFavoritesOnly: false,
      currentPage: 1,
      itemsPerPage: 12
    };
  },

  computed: {
    ...mapGetters({
      allBots: "bots/bots",
      favoriteBots: "favorites/favoriteBots",
      isFavorite: "favorites/isFavorite"
    }),

    filteredBots() {
      let filtered = this.allBots;

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          bot =>
            bot.name.toLowerCase().includes(query) ||
            (bot.nickname && bot.nickname.toLowerCase().includes(query))
        );
      }

      // Apply favorites filter
      if (this.showFavoritesOnly) {
        filtered = filtered.filter(bot => this.isFavorite(bot.name));
      }

      // Apply pagination
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return filtered.slice(start, start + this.itemsPerPage);
    },

    totalPages() {
      return Math.ceil(this.allBots.length / this.itemsPerPage);
    }
  },

  created() {
    this.fetchBots();
  },

  methods: {
    ...mapActions("bots", ["fetchBots"]),

    handleSearch: debounce(function() {
      this.currentPage = 1; // Reset to first page when searching
    }, 300),

    handleFavorite(botName, isFavorite) {
      const action = isFavorite
        ? "favorites/addFavorite"
        : "favorites/removeFavorite";
      this.$store.dispatch(action, botName);
    },

    handlePageChange(page) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    resetFilters() {
      this.searchQuery = "";
      this.showFavoritesOnly = false;
      this.currentPage = 1;
    },

    async fetchBots() {
      try {
        this.loading = true;
        this.error = null;
        await this.$store.dispatch("bots/fetchBots");
      } catch (err) {
        console.error("Failed to fetch bots:", err);
        this.error = this.$t("errors.failed_to_load_bots");
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.bots-view {
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;

  &__header {
    margin-bottom: 2rem;
  }

  &__title {
    font-size: 1.75rem;
    color: var(--color-text);
    margin-bottom: 1.5rem;
  }

  &__filters {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
    align-items: center;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  &__loading {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
    background: var(--color-background-light);
    border-radius: 8px;
  }

  &__empty-icon {
    font-size: 3rem;
    color: var(--color-text-muted);
    margin-bottom: 1rem;
  }

  &__empty-text {
    color: var(--color-text-muted);
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
  }

  &__empty-button {
    padding: 0.5rem 1.5rem;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background: var(--color-primary-dark);
    }
  }
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;

  &__input {
    width: 100%;
    padding: 0.5rem 2.5rem 0.5rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-background);
    color: var(--color-text);
    font-size: 0.9rem;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
    }
  }

  &__icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-muted);
    pointer-events: none;
  }
}

.filter-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;

  &__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .filter-toggle__slider {
      background-color: var(--color-primary);

      &::before {
        transform: translateX(1.25rem);
      }
    }
  }

  &__slider {
    position: relative;
    display: inline-block;
    width: 2.5rem;
    height: 1.5rem;
    background-color: var(--color-background-dark);
    border-radius: 1rem;
    transition: background-color 0.2s;

    &::before {
      content: "";
      position: absolute;
      left: 0.25rem;
      top: 0.25rem;
      width: 1rem;
      height: 1rem;
      background-color: white;
      border-radius: 50%;
      transition: transform 0.2s;
    }
  }

  &__label {
    font-size: 0.9rem;
    color: var(--color-text);
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .bots-view {
    padding: 1rem;

    &__grid {
      grid-template-columns: 1fr;
    }
  }

  .search-box {
    max-width: 100%;
  }
}
</style>
