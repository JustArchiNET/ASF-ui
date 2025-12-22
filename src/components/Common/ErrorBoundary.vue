<template>
  <div>
    <slot v-if="!hasError"></slot>
    <div v-else class="error-boundary">
      <div class="error-boundary__content">
        <FontAwesomeIcon
          icon="exclamation-triangle"
          class="error-boundary__icon"
        />
        <h3 class="error-boundary__title">{{ $t("error.title") }}</h3>
        <p class="error-boundary__message">{{ errorMessage }}</p>
        <button class="error-boundary__retry" @click="handleRetry">
          {{ $t("error.retry") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ErrorBoundary",
  props: {
    errorMessage: {
      type: String,
      default: "An unexpected error occurred."
    }
  },
  data() {
    return {
      hasError: false,
      error: null
    };
  },
  errorCaptured(err, vm, info) {
    this.hasError = true;
    this.error = err;
    console.error("Error in component:", { err, vm, info });
    return false;
  },
  methods: {
    handleRetry() {
      this.hasError = false;
      this.error = null;
      this.$emit("retry");
    }
  }
};
</script>

<style lang="scss" scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  padding: 1rem;
  background-color: var(--color-background-light);
  border: 1px solid var(--color-error);
  border-radius: 4px;
  text-align: center;

  &__content {
    max-width: 300px;
  }

  &__icon {
    font-size: 2rem;
    color: var(--color-error);
    margin-bottom: 1rem;
  }

  &__title {
    margin: 0 0 0.5rem;
    color: var(--color-error);
    font-size: 1.1rem;
  }

  &__message {
    margin: 0 0 1rem;
    color: var(--color-text);
    font-size: 0.9rem;
  }

  &__retry {
    padding: 0.5rem 1rem;
    background-color: var(--color-primary);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--color-primary-dark);
    }
  }
}
</style>
