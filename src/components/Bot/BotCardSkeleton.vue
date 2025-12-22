<template>
  <div class="bot skeleton" :class="[`status--${status || 'offline'}`]">
    <div class="bot__avatar skeleton__item"></div>
    <div class="bot__status">
      <div
        class="bot__status-property bot__status-property--name skeleton__item"
      ></div>
      <div
        class="bot__status-property bot__status-property--text skeleton__item"
      ></div>
    </div>
    <div class="bot__actions">
      <div v-for="i in 3" :key="i" class="bot__action skeleton__item"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BotCardSkeleton",
  props: {
    status: {
      type: String,
      default: "offline"
    }
  }
};
</script>

<style lang="scss" scoped>
.skeleton {
  &__item {
    background: var(--color-background-dark);
    border-radius: 4px;
    position: relative;
    overflow: hidden;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      transform: translateX(-100%);
      background-image: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0,
        rgba(255, 255, 255, 0.2) 20%,
        rgba(255, 255, 255, 0.5) 60%,
        rgba(255, 255, 255, 0)
      );
      animation: shimmer 2s infinite;
    }
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
}

.bot {
  &__avatar {
    width: 2.25em;
    height: 2.25em;
    margin-right: 0.5em;
  }

  &__status {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__status-property {
    height: 1em;
    margin: 0.2em 0;

    &--name {
      width: 80%;
    }

    &--text {
      width: 60%;
    }
  }

  &__actions {
    display: flex;
    gap: 0.5em;

    .bot__action {
      width: 1.5em;
      height: 1.5em;
      border-radius: 50%;
    }
  }
}
</style>
